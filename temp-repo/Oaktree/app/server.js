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
      <title>Real-time cloud infrastructure information</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background: #f8fafc;
        }
        .hero-gradient {
          background: linear-gradient(120deg, #4f46e5 0%, #7c3aed 50%, #2dd4bf 100%);
        }
        .card {
          transition: all 0.3s ease;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 30px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .card-body {
          padding: 1.5rem;
        }
        .data-pill {
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          font-weight: 500;
          display: inline-block;
        }
      </style>
    </head>
    <body class="min-h-screen">
      <div class="hero-gradient text-white py-16">
        <div class="container mx-auto px-6 text-center">
          <h1 class="text-5xl font-bold mb-4 tracking-tight">CLOUD INFRASTRUCTURE DASHBOARD</h1>
          <p class="text-2xl font-light max-w-3xl mx-auto opacity-90">Real-time cloud infrastructure information</p>
        </div>
      </div>
      
      <div class="container mx-auto px-6 py-12 -mt-12 relative z-10">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-50 backdrop-blur-sm">
          <div class="p-8">
            <div class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <div>
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Week 3 Project Dashboard</h2>
                <p class="text-gray-500 text-lg">Monitoring your cloud infrastructure in real-time</p>
              </div>
              <span class="px-6 py-3 rounded-full ${isEcs ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'} font-medium text-lg shadow-lg">
                ${isEcs ? '🚀 Running on AWS ECS' : '🖥️ Local Development Environment'}
              </span>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8 mt-12">
              <div class="card bg-gradient-to-br from-indigo-600 to-blue-500 text-white">
                <div class="card-header">
                  <h3 class="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    AWS Environment
                  </h3>
                </div>
                <div class="card-body space-y-6">
                  <div class="flex flex-col">
                    <span class="text-indigo-100 mb-2">AWS Region</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm">${awsRegion}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-indigo-100 mb-2">ECS Task ID</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm">${ecsTaskId}</span>
                  </div>
                </div>
              </div>
              
              <div class="card bg-gradient-to-br from-emerald-600 to-teal-500 text-white">
                <div class="card-header">
                  <h3 class="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                    </svg>
                    System Resources
                  </h3>
                </div>
                <div class="card-body space-y-6">
                  <div class="flex flex-col">
                    <span class="text-emerald-100 mb-2">Hostname</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm">${hostname}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-emerald-100 mb-2">Platform</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm">${platform}</span>
                  </div>
                </div>
              </div>
              
              <div class="card bg-gradient-to-br from-purple-600 to-fuchsia-500 text-white">
                <div class="card-header">
                  <h3 class="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                    Hardware
                  </h3>
                </div>
                <div class="card-body space-y-6">
                  <div class="flex flex-col">
                    <span class="text-purple-100 mb-2">CPU Cores</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm">${cpus}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-purple-100 mb-2">Memory</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm">${freeMemory}GB free of ${totalMemory}GB</span>
                  </div>
                </div>
              </div>
              
              <div class="card bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <div class="card-header">
                  <h3 class="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Request Details
                  </h3>
                </div>
                <div class="card-body space-y-6">
                  <div class="flex flex-col">
                    <span class="text-amber-100 mb-2">Request IP</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm">${req.ip || req.connection.remoteAddress}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-amber-100 mb-2">User Agent</span>
                    <span class="data-pill bg-white/20 backdrop-blur-sm text-xs">${req.headers['user-agent']}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-12 pt-6 border-t border-gray-100 text-center">
              <p class="text-gray-500">Powered by AWS ECS, Terraform Infrastructure as Code, and Docker</p>
              <p class="text-gray-400 text-sm mt-2">© 2025 Week 3 Project Dashboard</p>
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
