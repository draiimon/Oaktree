/**
 * SIMPLE FIX SCRIPT FOR LOCAL ENVIRONMENTS
 * Run this once with: node scripts/fix.cjs
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running OakTree Local Fix Tool...');

// Fix vite.config.ts
try {
  const viteConfigPath = path.join(__dirname, '..', 'vite.config.ts');
  console.log(`Checking ${viteConfigPath}...`);
  
  if (fs.existsSync(viteConfigPath)) {
    console.log('Found vite.config.ts, fixing it...');
    
    // Read the file
    let content = fs.readFileSync(viteConfigPath, 'utf8');
    
    // Check if it needs to be fixed
    if (content.includes('runtime-error-modal') && !content.includes('//')) {
      console.log('Fixing runtime-error-modal import...');
      
      // Fix runtime-error-modal import
      content = content.replace(
        /import runtimeErrorModal from ['"]@replit\/vite-plugin-runtime-error-modal['"];/g,
        "// import runtimeErrorModal from '@replit/vite-plugin-runtime-error-modal';"
      );
      
      // Fix runtime-error-modal usage
      content = content.replace(
        /runtimeErrorModal\(\)/g,
        "// runtimeErrorModal()"
      );
      
      // Write the file
      fs.writeFileSync(viteConfigPath, content, 'utf8');
      console.log('✅ Fixed vite.config.ts');
    } else {
      console.log('✅ vite.config.ts already fixed or doesn\'t need fixing');
    }
  }
} catch (err) {
  console.error('❌ Error fixing vite.config.ts:', err);
}

// Setup environment variables
try {
  const envPath = path.join(__dirname, '..', '.env');
  const envExamplePath = path.join(__dirname, '..', '.env.example');
  
  console.log(`Checking ${envPath}...`);
  
  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    console.log('.env file not found, creating from example...');
    
    // Read the example file
    let content = fs.readFileSync(envExamplePath, 'utf8');
    
    // Ensure USE_AWS_DB is set to false for local development
    if (!content.includes('USE_AWS_DB=')) {
      content += '\nUSE_AWS_DB=false\n';
    } else {
      content = content.replace(/USE_AWS_DB=true/g, 'USE_AWS_DB=false');
    }
    
    // Write the file
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ Created .env file with USE_AWS_DB=false');
  } else if (fs.existsSync(envPath)) {
    console.log('.env file exists, checking contents...');
    
    // Read the file
    let content = fs.readFileSync(envPath, 'utf8');
    
    // Check if USE_AWS_DB is missing
    if (!content.includes('USE_AWS_DB=')) {
      content += '\nUSE_AWS_DB=false\n';
      
      // Write the file
      fs.writeFileSync(envPath, content, 'utf8');
      console.log('✅ Added USE_AWS_DB=false to .env file');
    } else {
      console.log('✅ USE_AWS_DB already set in .env file');
    }
  } else {
    console.log('❌ .env and .env.example files not found');
  }
} catch (err) {
  console.error('❌ Error setting up environment variables:', err);
}

console.log('✅ Local environment setup completed successfully!');
console.log('🔄 You may now start the development server with: ./local-scripts.sh dev');