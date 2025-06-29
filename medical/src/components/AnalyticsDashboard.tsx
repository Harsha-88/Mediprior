import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Heart, Activity, Droplets, Moon, TrendingUp, AlertTriangle, Plus, Smartphone, Calendar, Target, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BluetoothDevice, HealthData } from '../lib/bluetoothService';

const AnalyticsDashboard = ({ userId }: { userId?: string }) => {
  const [hasData, setHasData] = useState(false); // Toggle for demo purposes
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([]);
  const [healthData, setHealthData] = useState<Map<string, HealthData>>(new Map());
  const navigate = useNavigate();

  // Sample health data
  const vitalTrends = [
    { day: 'Mon', heartRate: 72, bloodPressure: 120, sleep: 7.5 },
    { day: 'Tue', heartRate: 75, bloodPressure: 118, sleep: 6.8 },
    { day: 'Wed', heartRate: 70, bloodPressure: 122, sleep: 8.2 },
    { day: 'Thu', heartRate: 78, bloodPressure: 125, sleep: 7.0 },
    { day: 'Fri', heartRate: 73, bloodPressure: 119, sleep: 7.8 },
    { day: 'Sat', heartRate: 71, bloodPressure: 117, sleep: 8.5 },
    { day: 'Sun', heartRate: 74, bloodPressure: 121, sleep: 7.2 }
  ];

  const activityBreakdown = [
    { activity: 'Steps', value: 8500, target: 10000, color: '#10b981' },
    { activity: 'Exercise', value: 45, target: 60, color: '#3b82f6' },
    { activity: 'Hydration', value: 6, target: 8, color: '#06b6d4' },
    { activity: 'Sleep', value: 7.5, target: 8, color: '#8b5cf6' }
  ];

  const alerts = [
    { type: 'info', message: 'Low activity detected - consider a short walk', time: '2 hours ago', icon: Activity },
    { type: 'warning', message: 'Hydration below recommended level', time: '1 day ago', icon: Droplets },
    { type: 'reminder', message: 'Upcoming appointment: Annual checkup tomorrow', time: '1 day ago', icon: Calendar }
  ];

  const getAlertColor = (type: string) => {
    const colors = {
      info: 'border-l-blue-400 bg-blue-50',
      warning: 'border-l-yellow-400 bg-yellow-50',
      reminder: 'border-l-green-400 bg-green-50'
    };
    return colors[type] || 'border-l-gray-400 bg-gray-50';
  };

  // Get real-time health data from connected devices
  const getRealTimeHealthData = () => {
    const data: any = {};
    
    healthData.forEach((healthData, deviceId) => {
      if (healthData.heartRate) data.heartRate = healthData.heartRate;
      if (healthData.bloodPressure) data.bloodPressure = healthData.bloodPressure;
      if (healthData.temperature) data.temperature = healthData.temperature;
      if (healthData.batteryLevel) data.batteryLevel = healthData.batteryLevel;
    });
    
    return data;
  };

  const realTimeData = getRealTimeHealthData();

  if (!hasData) {
    return (
      <div className="space-y-6">
        {/* Getting Started Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-teal-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Target className="h-5 w-5" />
              Let's Get Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Start your health monitoring journey by connecting your devices and setting up your first health check-in.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/device-connection')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Connect Device
              </Button>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => navigate('/health-checkin')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Start Health Check-in
              </Button>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-medium text-gray-800 mb-2">Quick Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Connect your smartwatch or fitness tracker for automatic data sync</li>
                <li>• Set up medication reminders and appointment tracking</li>
                <li>• Configure your health goals and target ranges</li>
                <li>• Enable notifications for important health alerts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Sample Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Sample Dashboard Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">72</div>
                <p className="text-sm text-gray-600">Heart Rate (bpm)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">8,500</div>
                <p className="text-sm text-gray-600">Daily Steps</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Droplets className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">6/8</div>
                <p className="text-sm text-gray-600">Hydration (glasses)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Moon className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">7.5h</div>
                <p className="text-sm text-gray-600">Sleep Duration</p>
              </div>
            </div>
            <Button onClick={() => setHasData(true)} className="w-full bg-blue-600 hover:bg-blue-700">
              View Full Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Devices Status */}
      {connectedDevices.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Smartphone className="h-5 w-5" />
              Connected Devices ({connectedDevices.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {connectedDevices.map((device) => (
                <div key={device.id} className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-green-200">
                  <Smartphone className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">{device.name}</span>
                  <span className="text-xs text-green-600">• {device.brand}</span>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3"
              onClick={() => navigate('/device-connection')}
            >
              Manage Device Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Heart className="h-4 w-4 text-red-500" />
              Heart Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {realTimeData.heartRate ? `${realTimeData.heartRate} bpm` : '72 bpm'}
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {realTimeData.heartRate ? 'Live data' : 'Sample data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Activity className="h-4 w-4 text-blue-500" />
              Blood Pressure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">
              {realTimeData.bloodPressure 
                ? `${realTimeData.bloodPressure.systolic}/${realTimeData.bloodPressure.diastolic}`
                : '120/80'
              }
            </div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {realTimeData.bloodPressure ? 'Live data' : 'Sample data'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Moon className="h-4 w-4 text-purple-500" />
              Sleep Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">7.5h</div>
            <p className="text-xs text-yellow-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Below target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Droplets className="h-4 w-4 text-cyan-500" />
              Hydration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">6/8</div>
            <p className="text-xs text-yellow-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Need more water
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vital Trends and Activity Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Vital Sign Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={vitalTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Line type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} name="Heart Rate" />
                <Line type="monotone" dataKey="bloodPressure" stroke="#3b82f6" strokeWidth={2} name="BP Systolic" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">Activity Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{item.activity}</span>
                    <span className="text-gray-600">{item.value}/{item.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((item.value / item.target) * 100, 100)}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Health Alerts & Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className={`border-l-4 p-4 ${getAlertColor(alert.type)}`}>
                <div className="flex items-start gap-3">
                  <alert.icon className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Plus className="h-6 w-6 text-blue-600" />
              <span className="text-sm">Log Health Data</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Calendar className="h-6 w-6 text-green-600" />
              <span className="text-sm">Schedule Appointment</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Target className="h-6 w-6 text-purple-600" />
              <span className="text-sm">Set Health Goals</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
