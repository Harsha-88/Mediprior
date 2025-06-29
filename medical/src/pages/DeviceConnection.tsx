import React from 'react';
import BluetoothDeviceConnection from '../components/BluetoothDeviceConnection';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Bluetooth, Shield, Zap, Smartphone, Heart, Activity, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeviceConnection = () => {
  const navigate = useNavigate();

  const handleDeviceConnected = (device: any) => {
    navigate('/');
  };

  const handleDeviceDisconnected = (deviceId: string) => {
    console.log('Device disconnected:', deviceId);
  };

  const handleHealthDataReceived = (deviceId: string, data: any) => {
    console.log('Health data received:', deviceId, data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-white/50 hover:bg-white/80 transition-all duration-300 border-blue-200 hover:border-blue-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Bluetooth className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Device Connection
                </h1>
                <p className="text-gray-600 text-sm">Connect your health devices seamlessly</p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Device Connection Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
                <BluetoothDeviceConnection
                  onDeviceConnected={handleDeviceConnected}
                  onDeviceDisconnected={handleDeviceDisconnected}
                  onHealthDataReceived={handleHealthDataReceived}
                />
              </div>
            </div>

            {/* Enhanced Information Panel */}
            <div className="space-y-6">
              {/* Connection Guide */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span>Quick Setup Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <span className="text-white text-sm font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Enable Bluetooth</p>
                        <p className="text-sm text-gray-600">Make sure Bluetooth is enabled on your device</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <span className="text-white text-sm font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Pairing Mode</p>
                        <p className="text-sm text-gray-600">Put your device in pairing mode</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-md">
                        <span className="text-white text-sm font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Discover & Connect</p>
                        <p className="text-sm text-gray-600">Click discover and select your device</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supported Devices */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <Smartphone className="h-5 w-5 text-blue-500" />
                    <span>Supported Devices</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">⌚</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Smartwatches</p>
                        <p className="text-sm text-gray-600">Apple Watch, Galaxy Watch, Garmin</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg">🏃</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Fitness Trackers</p>
                        <p className="text-sm text-gray-600">Fitbit, Polar, Withings</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100 hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Medical Devices</p>
                        <p className="text-sm text-gray-600">Blood pressure monitors, thermometers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <Activity className="h-5 w-5 text-green-500" />
                    <span>Key Features</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <Wifi className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Real-time data sync</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Secure encryption</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <Zap className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Instant connection</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Privacy */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>Data Privacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>All health data processed locally</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>No data sent without consent</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Encrypted connections</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p>Disconnect anytime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceConnection;
