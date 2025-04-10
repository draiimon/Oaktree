import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import expressSession from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import * as awsDb from "./aws-db";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: expressSession.SessionOptions = {
    secret: process.env.SESSION_SECRET || "oaktree-dev-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(expressSession(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Check if AWS is configured and set up table
  awsDb.createUsersTable().then(tableAvailable => {
    if (tableAvailable) {
      console.log("AWS DynamoDB integration is ready for use");
    } else {
      console.log("AWS DynamoDB table is not available, using local authentication only");
    }
  }).catch(err => {
    console.log("Error checking DynamoDB table, using local authentication only:", err.message || err);
  });

  // Using local auth strategy with AWS DynamoDB integration
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const isAWSConfigured = await awsDb.isAWSConfigured();
        
        // First try to authenticate with AWS DynamoDB if configured
        if (isAWSConfigured) {
          try {
            const awsUser = await awsDb.authenticateUser(username, password);
            
            if (awsUser) {
              // Check if user exists in local DB
              let user = await storage.getUserByUsername(username);
              
              // If not, create the user in our database to maintain session
              if (!user) {
                user = await storage.createUser({
                  username: username,
                  password: await hashPassword(password), // Store hashed password locally
                  email: awsUser.email || `${username}@example.com`,
                });
              }
              
              console.log("AWS DynamoDB authentication successful");
              return done(null, user);
            }
          } catch (awsError) {
            console.log("AWS DynamoDB auth failed, falling back to local:", awsError);
          }
        }
        
        // Local authentication fallback
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      // Check if user already exists in local DB
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      let awsUserCreated = false;
      
      // Try to register with AWS DynamoDB if configured
      if (await awsDb.isAWSConfigured()) {
        try {
          const awsUser = await awsDb.createUser({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email || ""
          });
          
          if (awsUser) {
            console.log("User registered in AWS DynamoDB successfully");
            awsUserCreated = true;
          } else {
            console.log("AWS registration skipped - table may not exist");
          }
        } catch (awsError: any) {
          if (awsError.name === "ConditionalCheckFailedException" || 
              (awsError.__type && awsError.__type.includes("ConditionalCheckFailedException"))) {
            console.log("AWS registration failed - username already exists in DynamoDB");
          } else {
            console.log("Error registering with AWS DynamoDB:", awsError?.message || awsError);
          }
          // Continue with local registration if AWS fails
        }
      }

      // Always register locally to maintain session
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      // Add a message noting where the user was registered
      const registrationMessage = awsUserCreated
        ? "User registered successfully in both AWS DynamoDB and local database"
        : "User registered in local database";
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({
          ...user,
          message: registrationMessage
        });
      });
    } catch (error: any) {
      console.error("Registration error:", error?.message || error);
      res.status(500).send("Error creating user: " + (error?.message || "Unknown error"));
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  app.get("/api/aws-status", async (req, res) => {
    const isAWSConfigured = await awsDb.isAWSConfigured();
    
    res.json({
      isConfigured: isAWSConfigured,
      region: process.env.AWS_REGION,
      integration: "DynamoDB",
      features: ["User Authentication", "Data Storage"]
    });
  });
}
