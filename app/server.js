const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Get system information
const hostname = os.hostname();
const platform = os.platform();
const cpus = os.cpus().length;
const totalMemory = Math.round(os.totalmem() / (1024 * 1024 * 1024));
const freeMemory = Math.round(os.freemem() / (1024 * 1024 * 1024));

app.get('/', (req, res) => {
  const awsRegion = process.env.AWS_REGION || 'Not deployed to AWS yet';
  const ecsTaskId = process.env.ECS_TASK_ID || 'Not running in ECS';
  const isEcs = process.env.ECS_TASK_ID ? true : false;
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cloud Deployment Info</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-100">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div class="p-6">
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold text-gray-800">Server Information</h1>
              <span class="px-3 py-1 rounded-full ${isEcs ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                ${isEcs ? 'AWS ECS' : 'Local Development'}
              </span>
            </div>
            
            <div class="space-y-4">
              <div class="border-b pb-2">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">Environment</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">AWS Region</p>
                    <p class="font-medium">${awsRegion}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">ECS Task ID</p>
                    <p class="font-medium">${ecsTaskId}</p>
                  </div>
                </div>
              </div>
              
              <div class="border-b pb-2">
                <h2 class="text-lg font-semibold text-gray-700 mb-2">System</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Hostname</p>
                    <p class="font-medium">${hostname}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Platform</p>
                    <p class="font-medium">${platform}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">CPU Cores</p>
                    <p class="font-medium">${cpus}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Memory</p>
                    <p class="font-medium">${freeMemory}GB free of ${totalMemory}GB</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 class="text-lg font-semibold text-gray-700 mb-2">Request Details</h2>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500">Request IP</p>
                    <p class="font-medium">${req.ip || req.connection.remoteAddress}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">User Agent</p>
                    <p class="font-medium text-xs">${req.headers['user-agent']}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Hostname: ${hostname}`);
  console.log(`Platform: ${platform}`);
  console.log(`CPUs: ${cpus}`);
  console.log(`Memory: ${freeMemory}GB free of ${totalMemory}GB`);
});
