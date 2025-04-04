const express = require("express");
const os = require("os");
const app = express();
const PORT = process.env.PORT || 3000;

// Get the hostname and other system information
const hostname = os.hostname();
const platform = os.platform();
const cpus = os.cpus().length;
const totalMemory = Math.round(os.totalmem() / (1024 * 1024 * 1024)); // GB
const freeMemory = Math.round(os.freemem() / (1024 * 1024 * 1024)); // GB
const uptime = Math.round(os.uptime() / 3600); // hours

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Oaktree Cloud App</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-screen">
        <div class="container mx-auto px-4 py-10">
            <header class="text-center mb-12">
                <h1 class="text-4xl md:text-6xl font-bold text-blue-400 mb-4">Oaktree Cloud Infrastructure</h1>
                <p class="text-xl text-gray-300">Week 3: Cloud Services & Infrastructure as Code</p>
            </header>
            
            <div class="bg-gray-700 rounded-lg shadow-lg p-6 mb-8">
                <h2 class="text-2xl font-bold mb-4 text-blue-300">Deployment Information</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">Host</h3>
                        <p class="text-gray-300">${hostname}</p>
                    </div>
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">Platform</h3>
                        <p class="text-gray-300">${platform}</p>
                    </div>
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">CPU Cores</h3>
                        <p class="text-gray-300">${cpus}</p>
                    </div>
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">Memory</h3>
                        <p class="text-gray-300">${freeMemory}GB free of ${totalMemory}GB</p>
                    </div>
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">Uptime</h3>
                        <p class="text-gray-300">${uptime} hours</p>
                    </div>
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">Container Port</h3>
                        <p class="text-gray-300">${PORT}</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-gray-700 rounded-lg shadow-lg p-6 mb-8">
                <h2 class="text-2xl font-bold mb-4 text-blue-300">AWS Infrastructure (Terraform Managed)</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">VPC & Networking</h3>
                        <ul class="list-disc pl-5 text-gray-300">
                            <li>Custom VPC</li>
                            <li>Public & Private Subnets</li>
                            <li>Internet Gateway</li>
                            <li>NAT Gateway</li>
                            <li>Route Tables</li>
                        </ul>
                    </div>
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">Compute & Container</h3>
                        <ul class="list-disc pl-5 text-gray-300">
                            <li>ECR Repository</li>
                            <li>ECS Fargate Cluster</li>
                            <li>Task Definitions</li>
                            <li>Fargate Services</li>
                            <li>Auto Scaling</li>
                        </ul>
                    </div>
                    <div class="bg-gray-600 p-4 rounded">
                        <h3 class="text-lg font-semibold text-blue-200">Security & Access</h3>
                        <ul class="list-disc pl-5 text-gray-300">
                            <li>Security Groups</li>
                            <li>Load Balancer</li>
                            <li>IAM Roles</li>
                            <li>CloudWatch Logs</li>
                            <li>Health Checks</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <p class="text-gray-400 text-sm">© ${new Date().getFullYear()} Oaktree - Week 3: Cloud Services & Infrastructure as Code</p>
            </div>
        </div>
        
        <script>
            // You can add JavaScript functionality here if needed
            console.log("Application running on port ${PORT}");
        </script>
    </body>
    </html>
  `);
});

// Health check endpoint for AWS load balancer
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Hostname: ${hostname}`);
  console.log(`Platform: ${platform}`);
  console.log(`CPUs: ${cpus}`);
  console.log(`Memory: ${freeMemory}GB free of ${totalMemory}GB`);
});
