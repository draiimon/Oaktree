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
      <title>Oaktree Innovation Cloud</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Inter', sans-serif;
        }
        .gradient-bg {
          background: linear-gradient(135deg, #34d399 0%, #3b82f6 100%);
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      </style>
    </head>
    <body class="bg-gray-50 min-h-screen">
      <div class="gradient-bg text-white py-12 mb-8">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold text-center mb-2">HELLO OAKTREE INNOVATION!</h1>
          <p class="text-xl text-center opacity-90">Cloud-Native Deployment Information</p>
        </div>
      </div>
      
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div class="p-8">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h2 class="text-2xl font-bold text-gray-800">Deployment Dashboard</h2>
                <p class="text-gray-500">Real-time cloud infrastructure information</p>
              </div>
              <span class="px-4 py-2 rounded-full ${isEcs ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-blue-100 text-blue-800 border border-blue-200'} font-medium">
                ${isEcs ? '🚀 AWS ECS' : '🖥️ Local Development'}
              </span>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6 mt-8">
              <div class="card bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <h3 class="text-lg font-semibold text-blue-800 mb-4">Environment</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">AWS Region</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">${awsRegion}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">ECS Task ID</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">${ecsTaskId}</span>
                  </div>
                </div>
              </div>
              
              <div class="card bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                <h3 class="text-lg font-semibold text-green-800 mb-4">System Resources</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Hostname</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">${hostname}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Platform</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">${platform}</span>
                  </div>
                </div>
              </div>
              
              <div class="card bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                <h3 class="text-lg font-semibold text-purple-800 mb-4">Hardware</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">CPU Cores</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">${cpus}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Memory</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">${freeMemory}GB free of ${totalMemory}GB</span>
                  </div>
                </div>
              </div>
              
              <div class="card bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border border-yellow-100">
                <h3 class="text-lg font-semibold text-amber-800 mb-4">Request Details</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">Request IP</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm">${req.ip || req.connection.remoteAddress}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-600">User Agent</span>
                    <span class="font-medium text-gray-900 bg-white px-3 py-1 rounded-md shadow-sm text-xs">${req.headers['user-agent']}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-10 pt-6 border-t border-gray-200 text-center">
              <p class="text-gray-500 text-sm">Deployed using AWS ECS, Terraform IaC, and Docker</p>
              <p class="text-gray-400 text-xs mt-1">© 2025 Oaktree Innovation</p>
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
