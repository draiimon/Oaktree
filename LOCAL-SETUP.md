# OakTree Project - Local Setup Guide

Ang guide na ito ay magpapaliwanag kung paano patakbuhin ang OakTree DevOps Platform sa lokal na environment (sa labas ng Replit).

## Prerequisites

- Node.js v18+ installed
- npm installed

## Quick Setup (Recommended)

Para sa mabilisan at madaling setup, sundin ang mga steps na ito:

```bash
# 1. Clone the repository
git clone -b Week-4 https://github.com/draiimon/Oaktree.git
cd Oaktree

# 2. Install dependencies
npm install

# 3. Run the fix script para sa automatic setup
node fix.cjs

# 4. Start the application
npm run dev
```

## Detailed Setup Instructions

Kung nagkaroon ka ng problema sa quick setup, sundin ang detailed steps:

### 1. Install NodeJS at NPM

Kung wala kang Node.js v18 o mas bago:

```bash
# Using NVM (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
# Close at buksan ulit ang terminal
nvm install 18
nvm use 18

# O direct download from nodejs.org
```

### 2. Environment Setup

Gumawa ng `.env` file sa root directory:

```bash
# Create .env file with AWS configuration
cat > .env << EOL
AWS_REGION=ap-southeast-1
AWS_ACCESS_KEY_ID=placeholder
AWS_SECRET_ACCESS_KEY=placeholder
USE_AWS_DB=false
EOL
```

Kung gusto mong magkaroon ng real AWS connectivity, update mo ang .env file na may valid credentials at gawin ang `USE_AWS_DB=true`.

### 3. Setup Local Development Scripts

Para sa mas madaling development process, gumawa ako ng `local-scripts.sh` script na pwede mong gamitin:

```bash
# Gawin munang executable
chmod +x local-scripts.sh

# Run local dev server
./local-scripts.sh dev

# Build for production
./local-scripts.sh build

# Run in production mode
./local-scripts.sh start

# Fix common issues
./local-scripts.sh fix
```

### 4. Run the Application

May dalawang paraan para patakbuhin ang app:

#### Using Standard Replit Setup

```bash
npm run dev
```

#### Using Local-Compatible Scripts

```bash
./local-scripts.sh dev
```

Kapag successful, makikita mo ang app sa http://localhost:5000

## Troubleshooting

### React UI Hindi Lumalabas

Kung hindi lumalabas ang UI, subukan ang isa sa mga sumusunod:

#### Option 1: Build muna then start

```bash
# Build the frontend
./local-scripts.sh build
# Then start the server
./local-scripts.sh start
```

#### Option 2: Run Vite separately

```bash
# Sa window 1, patakbuhin ang backend
node local-dev.cjs

# Sa window 2, patakbuhin ang frontend
npx vite --config vite.config.local.ts
```

### TypeScript Errors

Kung nakakakuha ka ng errors tungkol sa TypeScript, subukan ito:

```bash
# Install TSX globally
npm install -g tsx
# Run the server with tsx
tsx server/index.ts
```

### Import.meta Errors

Kung nakakakuha ka ng errors tungkol sa `import.meta`, tiyaking na-run mo ang fix script:

```bash
node fix.cjs
```

### Connectivity Issues

Kung may issues connecting sa AWS:

1. Check na ang `.env` file ay nasa tamang location at may tamang values
2. Tiyakin na ang `USE_AWS_DB=false` kung wala kang valid AWS credentials
3. Kung gusto mong gumamit ng real AWS, tiyakin na ang IAM user ay may tamang permissions para sa DynamoDB

## Mga Utility Scripts

Ang project na ito ay may mga sumusunod na utility scripts para makatulong sa local development:

- `fix.cjs` - Nag-aayos ng common issues sa local setup
- `local-dev.cjs` - Server startup script para sa local development
- `generate-admin-hash.cjs` - Generates admin password hash for local testing

## Notes

- Ang local setup ay gumagamit ng modified vite configuration (`vite.config.local.ts`) na compatible sa regular Node.js environments
- Kung kinakailangan mo ang AWS features, kakailanganin mo ng valid AWS credentials