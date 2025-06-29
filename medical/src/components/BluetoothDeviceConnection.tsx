import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Bluetooth, 
  BluetoothConnected, 
  BluetoothOff, 
  Search, 
  X, 
  RefreshCw, 
  Heart, 
  Activity, 
  Battery, 
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Watch,
  Stethoscope
} from 'lucide-react';
import { bluetoothService, BluetoothDevice, HealthData, ConnectionStatus } from '../lib/bluetoothService';

interface BluetoothDeviceConnectionProps {
  onDeviceConnected?: (device: BluetoothDevice) => void;
  onDeviceDisconnected?: (deviceId: string) => void;
  onHealthDataReceived?: (deviceId: string, data: HealthData) => void;
}

const BluetoothDeviceConnection: React.FC<BluetoothDeviceConnectionProps> = ({
  onDeviceConnected,
  onDeviceDisconnected,
  onHealthDataReceived
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    isConnecting: false,
    isDiscovering: false,
  });
  const [discoveredDevices, setDiscoveredDevices] = useState<BluetoothDevice[]>([]);
  const [connectedDevices, setConnectedDevices] = useState<BluetoothDevice[]>([]);
  const [healthData, setHealthData] = useState<Map<string, HealthData>>(new Map());
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Initialize connection status
    setConnectionStatus(bluetoothService.getConnectionStatus());
    setConnectedDevices(bluetoothService.getConnectedDevices());

    // Set up data listeners for existing devices
    connectedDevices.forEach(device => {
      bluetoothService.addDataListener(device.id, (data) => {
        setHealthData(prev => new Map(prev.set(device.id, data)));
        onHealthDataReceived?.(device.id, data);
      });
    });

    return () => {
      // Clean up listeners
      connectedDevices.forEach(device => {
        bluetoothService.removeDataListener(device.id);
      });
    };
  }, []);

  const handleDiscoverDevices = async () => {
    setError('');
    setDiscoveredDevices([]);

    try {
      const devices = await bluetoothService.discoverDevices();
      setDiscoveredDevices(devices);
      setConnectionStatus(bluetoothService.getConnectionStatus());
    } catch (err: any) {
      setError(err.message);
      setConnectionStatus(bluetoothService.getConnectionStatus());
    }
  };

  const handleConnectDevice = async (device: BluetoothDevice) => {
    setError('');

    try {
      const connectedDevice = await bluetoothService.connectToDevice(device.id);
      
      // Add data listener
      bluetoothService.addDataListener(device.id, (data) => {
        setHealthData(prev => new Map(prev.set(device.id, data)));
        onHealthDataReceived?.(device.id, data);
      });

      setConnectedDevices(bluetoothService.getConnectedDevices());
      setConnectionStatus(bluetoothService.getConnectionStatus());
      setDiscoveredDevices([]);
      
      onDeviceConnected?.(connectedDevice);
    } catch (err: any) {
      setError(err.message);
      setConnectionStatus(bluetoothService.getConnectionStatus());
    }
  };

  const handleDisconnectDevice = async (deviceId: string) => {
    try {
      await bluetoothService.disconnectDevice(deviceId);
      bluetoothService.removeDataListener(deviceId);
      
      setConnectedDevices(bluetoothService.getConnectedDevices());
      setConnectionStatus(bluetoothService.getConnectionStatus());
      setHealthData(prev => {
        const newMap = new Map(prev);
        newMap.delete(deviceId);
        return newMap;
      });
      
      onDeviceDisconnected?.(deviceId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getDeviceIcon = (type: BluetoothDevice['type']) => {
    switch (type) {
      case 'wearable':
        return <Watch className="h-4 w-4" />;
      case 'smartphone':
        return <Smartphone className="h-4 w-4" />;
      case 'medical_device':
        return <Stethoscope className="h-4 w-4" />;
      case 'fitness_tracker':
        return <Activity className="h-4 w-4" />;
      default:
        return <Bluetooth className="h-4 w-4" />;
    }
  };

  const renderHealthData = (deviceId: string) => {
    const data = healthData.get(deviceId);
    if (!data) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
        {data.heartRate && (
          <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-lg">
            <Heart className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-xs text-gray-600">Heart Rate</p>
              <p className="font-semibold text-red-600">{data.heartRate} BPM</p>
            </div>
          </div>
        )}
        
        {data.bloodPressure && (
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
            <Activity className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-600">Blood Pressure</p>
              <p className="font-semibold text-blue-600">
                {data.bloodPressure.systolic}/{data.bloodPressure.diastolic}
              </p>
            </div>
          </div>
        )}
        
        {data.temperature && (
          <div className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-600">Temperature</p>
              <p className="font-semibold text-orange-600">{data.temperature}°C</p>
            </div>
          </div>
        )}
        
        {data.batteryLevel && (
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
            <Battery className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-600">Battery</p>
              <p className="font-semibold text-green-600">{data.batteryLevel}%</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConnectionStatus = () => {
    if (connectionStatus.isConnecting) {
      return (
        <div className="flex items-center space-x-2 text-blue-600">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Connecting to device...</span>
        </div>
      );
    }

    if (connectionStatus.isDiscovering) {
      return (
        <div className="flex items-center space-x-2 text-blue-600">
          <Search className="h-4 w-4 animate-pulse" />
          <span>Searching for devices...</span>
        </div>
      );
    }

    if (connectionStatus.isConnected) {
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <BluetoothConnected className="h-4 w-4" />
          <span>Connected to {connectionStatus.deviceName}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <BluetoothOff className="h-4 w-4" />
        <span>No devices connected</span>
      </div>
    );
  };

  if (!bluetoothService.isSupported()) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bluetooth className="h-5 w-5 text-blue-600" />
            Device Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera for device connectivity.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bluetooth className="h-5 w-5 text-blue-600" />
          Health Device Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          {renderConnectionStatus()}
          <Button
            onClick={handleDiscoverDevices}
            disabled={connectionStatus.isConnecting || connectionStatus.isDiscovering}
            variant="outline"
            size="sm"
          >
            <Search className="h-4 w-4 mr-2" />
            Discover Devices
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Discovered Devices */}
        {discoveredDevices.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Available Devices</h4>
            {discoveredDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  {getDeviceIcon(device.type)}
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-gray-500">{device.brand} • {device.type}</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleConnectDevice(device)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Connect
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Connected Devices */}
        {connectedDevices.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Connected Devices</h4>
            {connectedDevices.map((device) => (
              <div
                key={device.id}
                className="border rounded-lg p-4 bg-green-50 border-green-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-sm text-gray-500">
                        {device.brand} • Connected • Last sync: {new Date(device.lastSync).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button
                      onClick={() => handleDisconnectDevice(device.id)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Health Data Display */}
                {renderHealthData(device.id)}
              </div>
            ))}
          </div>
        )}

        {/* No Devices Connected */}
        {connectedDevices.length === 0 && discoveredDevices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bluetooth className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="mb-2">No devices connected</p>
            <p className="text-sm">Click "Discover Devices" to find and connect your health devices</p>
          </div>
        )}

        {/* Connection Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Connection Tips:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Make sure your device is in pairing mode</li>
            <li>• Keep your device within 10 feet of your computer</li>
            <li>• Ensure Bluetooth is enabled on your device</li>
            <li>• Supported devices: Smartwatches, fitness trackers, blood pressure monitors</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BluetoothDeviceConnection; 