import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import expressSession from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { registerUser, authenticateUser, getUserAttributes } from "./aws";

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

  // Using local auth strategy with AWS Cognito fallback
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // First try to authenticate with AWS Cognito
        if (process.env.AWS_COGNITO_CLIENT_ID && process.env.AWS_COGNITO_USER_POOL_ID) {
          try {
            const cognitoUser = await authenticateUser(username, password);
            
            // Check if user exists in local DB
            let user = await storage.getUserByUsername(username);
            
            // If not, create the user in our database to maintain session
            if (!user) {
              user = await storage.createUser({
                username: username,
                password: await hashPassword(password), // Store hashed password locally
                email: `${username}@example.com`, // Default email, this would be from Cognito
              });
            }
            
            return done(null, user);
          } catch (cognitoError) {
            // If Cognito auth fails, fall back to local auth
            console.log("Cognito auth failed, falling back to local:", cognitoError);
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
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    try {
      // Register with AWS Cognito if configured
      if (process.env.AWS_COGNITO_CLIENT_ID && process.env.AWS_COGNITO_USER_POOL_ID) {
        try {
          await registerUser(req.body.username, req.body.password, req.body.email);
          console.log("User registered in Cognito successfully");
        } catch (cognitoError) {
          console.error("Error registering with Cognito:", cognitoError);
          // Continue with local registration if Cognito fails
        }
      }

      // Always register locally to maintain session
      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).send("Error creating user");
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

  app.get("/api/aws-status", (req, res) => {
    const isConfigured = !!(process.env.AWS_COGNITO_CLIENT_ID && 
                         process.env.AWS_COGNITO_USER_POOL_ID && 
                         process.env.AWS_ACCESS_KEY_ID && 
                         process.env.AWS_SECRET_ACCESS_KEY && 
                         process.env.AWS_REGION);
    
    res.json({
      isConfigured,
      region: process.env.AWS_REGION,
      cognito: {
        configured: !!(process.env.AWS_COGNITO_CLIENT_ID && process.env.AWS_COGNITO_USER_POOL_ID)
      }
    });
  });
}
