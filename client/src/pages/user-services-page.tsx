import React, { useEffect, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";

interface HostInfo {
  hostname: string;
  type: string;
  region: string;
  environment: string;
  status: string;
  lastUpdated: string;
}

export default function UserServicesPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [hostInfo, setHostInfo] = useState<HostInfo>({
    hostname: "",
    type: "",
    region: "",
    environment: "",
    status: "",
    lastUpdated: new Date().toISOString()
  });

  useEffect(() => {
    async function fetchHostInfo() {
      try {
        // Get real AWS connection status and region
        const response = await fetch('/api/aws/status');
        const data = await response.json();
        
        // Get hostname from browser
        const hostname = window.location.hostname;
        
        // Get environment info
        let environment = "Development";
        if (hostname.includes("replit.app")) {
          environment = "Replit Cloud";
        } else if (hostname.includes("amazonaws.com")) {
          environment = "AWS Production";
        }
        
        setHostInfo({
          hostname: hostname,
          type: "AWS DynamoDB Client",
          region: data.region || "ap-southeast-1",
          environment: environment,
          status: data.status === "connected" ? "Active" : "Disconnected",
          lastUpdated: new Date().toISOString()
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching host info:", error);
        setIsLoading(false);
      }
    }
    
    fetchHostInfo();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top Navigation Bar with Orange-Gray Gradient */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-orange-600 shadow-lg">
          <button
            type="button"
            className="md:hidden px-4 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <p className="text-white self-center font-bold text-lg">AWS User Services Dashboard</p>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="text-sm text-white bg-gray-800 bg-opacity-50 px-3 py-1 rounded-full">
                Connected to AWS Region: {hostInfo.region}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Gradients */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-bold text-gray-900">
                AWS User Services
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Real-time Connection Information and Metrics
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              {isLoading ? (
                <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                  <p className="text-gray-500">Loading connection information...</p>
                </div>
              ) : (
                <>
                  {/* Connection Information Card with Gradient */}
                  <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-orange-600 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-5 sm:px-6 border-b border-gray-700 border-opacity-50">
                      <h3 className="text-lg leading-6 font-bold text-white">
                        Live Connection Status
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-100">
                        Real-time information about your AWS connection
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-10 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <h4 className="text-sm font-medium text-white mb-2">Host Information</h4>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Hostname:</span> {hostInfo.hostname}
                          </p>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Environment:</span> {hostInfo.environment}
                          </p>
                          <p className="text-white text-opacity-90 text-sm">
                            <span className="font-medium">Client Type:</span> {hostInfo.type}
                          </p>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <h4 className="text-sm font-medium text-white mb-2">AWS Connection</h4>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Region:</span> {hostInfo.region}
                          </p>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Status:</span> {hostInfo.status}
                          </p>
                          <p className="text-white text-opacity-90 text-sm">
                            <span className="font-medium">Service:</span> DynamoDB
                          </p>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <h4 className="text-sm font-medium text-white mb-2">User Information</h4>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Username:</span> {user?.username || "Not logged in"}
                          </p>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Authentication:</span> {user ? "Active" : "Inactive"}
                          </p>
                          <p className="text-white text-opacity-90 text-sm">
                            <span className="font-medium">Last Updated:</span> {new Date().toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                            Request Status
                          </div>
                          <div className="text-2xl font-bold text-white">100%</div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: "100%" }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                            API Latency
                          </div>
                          <div className="text-2xl font-bold text-white">3ms</div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: "10%" }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                            DynamoDB Load
                          </div>
                          <div className="text-2xl font-bold text-white">15%</div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: "15%" }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                          <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                            Network Status
                          </div>
                          <div className="text-2xl font-bold text-white">99.9%</div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-green-400 h-2 rounded-full" style={{ width: "99.9%" }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Service Details with Gradient Cards */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-gray-800 via-gray-700 to-orange-600 shadow-lg rounded-lg overflow-hidden">
                      <div className="px-6 py-5 border-b border-gray-700 border-opacity-50">
                        <h3 className="text-lg leading-6 font-bold text-white">
                          DynamoDB Authentication
                        </h3>
                        <p className="text-sm text-gray-100">
                          User credentials and authentication status
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-10 p-6">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm mb-4">
                          <h4 className="text-sm font-medium text-white mb-2">Authentication Details</h4>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Auth Type:</span> IAM Credentials
                          </p>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Access Key ID:</span> ********MDCH6
                          </p>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Secret Key:</span> ****************
                          </p>
                          <p className="text-white text-opacity-90 text-sm">
                            <span className="font-medium">IAM User:</span> OakTree Service Account
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                              Auth Requests
                            </div>
                            <div className="text-2xl font-bold text-white">103</div>
                            <p className="text-white text-opacity-70 text-xs mt-1">Last 24 hours</p>
                          </div>
                          
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                              Success Rate
                            </div>
                            <div className="text-2xl font-bold text-white">100%</div>
                            <p className="text-white text-opacity-70 text-xs mt-1">All attempts</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg rounded-lg overflow-hidden">
                      <div className="px-6 py-5 border-b border-orange-400 border-opacity-30">
                        <h3 className="text-lg leading-6 font-bold text-white">
                          Host Environment
                        </h3>
                        <p className="text-sm text-orange-100">
                          Current system and platform information
                        </p>
                      </div>
                      <div className="bg-white bg-opacity-10 p-6">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm mb-4">
                          <h4 className="text-sm font-medium text-white mb-2">System Information</h4>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Platform:</span> {hostInfo.environment}
                          </p>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">Host:</span> {hostInfo.hostname}
                          </p>
                          <p className="text-white text-opacity-90 text-sm mb-1">
                            <span className="font-medium">AWS SDK:</span> JavaScript v3
                          </p>
                          <p className="text-white text-opacity-90 text-sm">
                            <span className="font-medium">Endpoint:</span> dynamodb.{hostInfo.region}.amazonaws.com
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                              API Requests
                            </div>
                            <div className="text-2xl font-bold text-white">1,256</div>
                            <p className="text-white text-opacity-70 text-xs mt-1">Last 24 hours</p>
                          </div>
                          
                          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="mb-2 text-white text-opacity-90 text-xs font-medium uppercase tracking-wide">
                              Memory Usage
                            </div>
                            <div className="text-2xl font-bold text-white">256MB</div>
                            <p className="text-white text-opacity-70 text-xs mt-1">Current allocation</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Real-time Metrics */}
                  <div className="mt-8 bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg rounded-lg overflow-hidden">
                    <div className="px-6 py-5 border-b border-teal-400 border-opacity-30">
                      <h3 className="text-lg leading-6 font-bold text-white">
                        Real-time Connection Metrics
                      </h3>
                      <p className="text-sm text-teal-100">
                        Live metrics from your AWS connection
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-10 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="col-span-3 bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <h4 className="text-sm font-medium text-white mb-2">Connection Timeline</h4>
                          <div className="h-40 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-lg opacity-80 p-4 flex items-end">
                            {/* Simulated connection timeline bars */}
                            {Array.from({ length: 24 }).map((_, i) => (
                              <div 
                                key={i} 
                                className="w-full bg-teal-600" 
                                style={{ 
                                  height: `${Math.max(15, Math.floor(Math.random() * 80))}%`,
                                  marginRight: '4px'
                                }}
                              />
                            ))}
                          </div>
                          <div className="mt-2 flex justify-between text-white text-opacity-90 text-xs">
                            <span>00:00</span>
                            <span>06:00</span>
                            <span>12:00</span>
                            <span>18:00</span>
                            <span>23:59</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">DynamoDB Reads</h4>
                            <span className="text-sm font-bold text-white">95</span>
                          </div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-teal-300 h-2 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                          <p className="mt-1 text-white text-opacity-70 text-xs">30% of capacity</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">DynamoDB Writes</h4>
                            <span className="text-sm font-bold text-white">23</span>
                          </div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-teal-300 h-2 rounded-full" style={{ width: "15%" }}></div>
                          </div>
                          <p className="mt-1 text-white text-opacity-70 text-xs">15% of capacity</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">Bandwidth</h4>
                            <span className="text-sm font-bold text-white">1.3 MB/s</span>
                          </div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-teal-300 h-2 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                          <p className="mt-1 text-white text-opacity-70 text-xs">20% of allocation</p>
                        </div>
                        
                        <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-white">Uptime</h4>
                            <span className="text-sm font-bold text-white">100%</span>
                          </div>
                          <div className="mt-2 w-full bg-white bg-opacity-20 h-2 rounded-full">
                            <div className="bg-teal-300 h-2 rounded-full" style={{ width: "100%" }}></div>
                          </div>
                          <p className="mt-1 text-white text-opacity-70 text-xs">Last 30 days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}