// Bluetooth Service for Health Device Connection
// Uses Web Bluetooth API for device discovery and data reading

export interface BluetoothDevice {
  id: string;
  name: string;
  type: 'wearable' | 'smartphone' | 'medical_device' | 'fitness_tracker';
  brand: string;
  model: string;
  isConnected: boolean;
  lastSync: string;
  dataTypes: string[];
  device?: globalThis.BluetoothDevice; // Native Bluetooth device object
  server?: globalThis.BluetoothRemoteGATTServer;
}

export interface HealthData {
  heartRate?: number;
  steps?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  temperature?: number;
  oxygenSaturation?: number;
  batteryLevel?: number;
  timestamp: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  deviceName?: string;
  error?: string;
  isConnecting: boolean;
  isDiscovering: boolean;
}

// GATT Service UUIDs for common health devices
const GATT_SERVICES = {
  HEART_RATE: 0x180D,
  HEALTH_THERMOMETER: 0x1809,
  BLOOD_PRESSURE: 0x1810,
  WEIGHT_SCALE: 0x181D,
  FITNESS_TRACKER: 0x1826,
  BATTERY: 0x180F,
  DEVICE_INFORMATION: 0x180A,
  GENERIC_ATTRIBUTE: 0x1801,
  GENERIC_ACCESS: 0x1800,
};

// GATT Characteristic UUIDs
const GATT_CHARACTERISTICS = {
  HEART_RATE_MEASUREMENT: 0x2A37,
  BLOOD_PRESSURE_MEASUREMENT: 0x2A35,
  TEMPERATURE_MEASUREMENT: 0x2A1C,
  BATTERY_LEVEL: 0x2A19,
  MANUFACTURER_NAME: 0x2A29,
  MODEL_NUMBER: 0x2A24,
  SERIAL_NUMBER: 0x2A25,
  FIRMWARE_REVISION: 0x2A26,
  HARDWARE_REVISION: 0x2A27,
};

class BluetoothService {
  private connectedDevices: Map<string, BluetoothDevice> = new Map();
  private connectionStatus: ConnectionStatus = {
    isConnected: false,
    isConnecting: false,
    isDiscovering: false,
  };
  private listeners: Map<string, (data: HealthData) => void> = new Map();

  // Check if Web Bluetooth is supported
  isSupported(): boolean {
    return 'bluetooth' in navigator && 'requestDevice' in navigator.bluetooth!;
  }

  // Get connection status
  getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  // Get connected devices
  getConnectedDevices(): BluetoothDevice[] {
    return Array.from(this.connectedDevices.values());
  }

  // Request Bluetooth permissions and discover devices
  async discoverDevices(): Promise<BluetoothDevice[]> {
    if (!this.isSupported()) {
      throw new Error('Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Opera.');
    }

    this.connectionStatus.isDiscovering = true;

    try {
      // Request device with health-related services
      const device = await navigator.bluetooth!.requestDevice({
        acceptAllDevices: false,
        optionalServices: [
          GATT_SERVICES.HEART_RATE,
          GATT_SERVICES.HEALTH_THERMOMETER,
          GATT_SERVICES.BLOOD_PRESSURE,
          GATT_SERVICES.WEIGHT_SCALE,
          GATT_SERVICES.FITNESS_TRACKER,
          GATT_SERVICES.BATTERY,
          GATT_SERVICES.DEVICE_INFORMATION,
        ],
        filters: [
          // Common health device names
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Apple Watch' },
          { namePrefix: 'Galaxy Watch' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Polar' },
          { namePrefix: 'Withings' },
          { namePrefix: 'Omron' },
          { namePrefix: 'iHealth' },
          { namePrefix: 'Qardio' },
          { namePrefix: 'Beurer' },
          // Generic health device names
          { namePrefix: 'HR' },
          { namePrefix: 'BP' },
          { namePrefix: 'Temp' },
          { namePrefix: 'Scale' },
          { namePrefix: 'Tracker' },
        ],
      });

      // Create device object
      const bluetoothDevice: BluetoothDevice = {
        id: device.id,
        name: device.name || 'Unknown Device',
        type: this.detectDeviceType(device.name || ''),
        brand: this.detectDeviceBrand(device.name || ''),
        model: device.name || 'Unknown Model',
        isConnected: false,
        lastSync: new Date().toISOString(),
        dataTypes: [],
        device: device,
      };

      return [bluetoothDevice];
    } catch (error: any) {
      this.handleBluetoothError(error);
      throw error;
    } finally {
      this.connectionStatus.isDiscovering = false;
    }
  }

  // Connect to a specific device
  async connectToDevice(deviceId: string): Promise<BluetoothDevice> {
    const device = this.connectedDevices.get(deviceId);
    if (!device || !device.device) {
      throw new Error('Device not found or not properly initialized');
    }

    this.connectionStatus.isConnecting = true;

    try {
      // Connect to GATT server
      const server = await device.device.gatt?.connect();
      if (!server) {
        throw new Error('Failed to connect to GATT server');
      }

      // Update device with server connection
      const updatedDevice: BluetoothDevice = {
        ...device,
        isConnected: true,
        server,
        lastSync: new Date().toISOString(),
      };

      this.connectedDevices.set(deviceId, updatedDevice);
      this.connectionStatus = {
        isConnected: true,
        deviceName: updatedDevice.name,
        isConnecting: false,
        isDiscovering: false,
      };

      // Start reading data from the device
      await this.startDataReading(updatedDevice);

      return updatedDevice;
    } catch (error: any) {
      this.handleBluetoothError(error);
      throw error;
    } finally {
      this.connectionStatus.isConnecting = false;
    }
  }

  // Disconnect from a device
  async disconnectDevice(deviceId: string): Promise<void> {
    const device = this.connectedDevices.get(deviceId);
    if (!device) {
      return;
    }

    try {
      if (device.server && device.server.connected) {
        await device.server.disconnect();
      }

      const updatedDevice: BluetoothDevice = {
        ...device,
        isConnected: false,
        server: undefined,
      };

      this.connectedDevices.set(deviceId, updatedDevice);

      // Update connection status
      const connectedDevices = this.getConnectedDevices().filter(d => d.isConnected);
      this.connectionStatus = {
        isConnected: connectedDevices.length > 0,
        deviceName: connectedDevices.length > 0 ? connectedDevices[0].name : undefined,
        isConnecting: false,
        isDiscovering: false,
      };
    } catch (error) {
      console.error('Error disconnecting device:', error);
    }
  }

  // Start reading health data from connected device
  private async startDataReading(device: BluetoothDevice): Promise<void> {
    if (!device.server || !device.device) {
      return;
    }

    try {
      // Get primary service
      const services = await device.server.getPrimaryServices();
      
      for (const service of services) {
        await this.readServiceData(service, device);
      }
    } catch (error) {
      console.error('Error reading device data:', error);
    }
  }

  // Read data from specific GATT service
  private async readServiceData(service: globalThis.BluetoothRemoteGATTService, device: BluetoothDevice): Promise<void> {
    try {
      const characteristics = await service.getCharacteristics();
      
      for (const characteristic of characteristics) {
        if (characteristic.properties.read) {
          await this.readCharacteristic(characteristic, device);
        }
        
        if (characteristic.properties.notify) {
          await this.startNotifications(characteristic, device);
        }
      }
    } catch (error) {
      console.error('Error reading service data:', error);
    }
  }

  // Read specific characteristic
  private async readCharacteristic(characteristic: globalThis.BluetoothRemoteGATTCharacteristic, device: BluetoothDevice): Promise<void> {
    try {
      const value = await characteristic.readValue();
      const data = this.parseCharacteristicData(characteristic.uuid, value, device);
      
      if (data) {
        this.notifyListeners(device.id, data);
      }
    } catch (error) {
      console.error('Error reading characteristic:', error);
    }
  }

  // Start notifications for real-time data
  private async startNotifications(characteristic: globalThis.BluetoothRemoteGATTCharacteristic, device: BluetoothDevice): Promise<void> {
    try {
      await characteristic.startNotifications();
      
      characteristic.addEventListener('characteristicvaluechanged', (event: Event) => {
        const target = event.target as unknown as globalThis.BluetoothRemoteGATTCharacteristic;
        const value = target.value;
        if (value) {
          const data = this.parseCharacteristicData(characteristic.uuid, value, device);
          
          if (data) {
            this.notifyListeners(device.id, data);
          }
        }
      });
    } catch (error) {
      console.error('Error starting notifications:', error);
    }
  }

  // Parse characteristic data based on UUID
  private parseCharacteristicData(uuid: string, value: DataView, device: BluetoothDevice): HealthData | null {
    const data: HealthData = {
      timestamp: new Date().toISOString(),
    };

    try {
      // Heart Rate Measurement
      if (uuid.includes('2A37') || uuid.includes('180D')) {
        const flags = value.getUint8(0);
        let heartRate = 0;
        
        if (flags & 0x01) {
          // 16-bit heart rate
          heartRate = value.getUint16(1, true);
        } else {
          // 8-bit heart rate
          heartRate = value.getUint8(1);
        }
        
        data.heartRate = heartRate;
      }
      
      // Blood Pressure Measurement
      else if (uuid.includes('2A35') || uuid.includes('1810')) {
        const flags = value.getUint8(0);
        const systolic = value.getUint16(1, true);
        const diastolic = value.getUint16(3, true);
        
        data.bloodPressure = { systolic, diastolic };
      }
      
      // Temperature Measurement
      else if (uuid.includes('2A1C') || uuid.includes('1809')) {
        const flags = value.getUint8(0);
        const tempValue = value.getUint16(1, true);
        const temperature = tempValue / 100; // Convert from hundredths of degrees
        
        data.temperature = temperature;
      }
      
      // Battery Level
      else if (uuid.includes('2A19') || uuid.includes('180F')) {
        const batteryLevel = value.getUint8(0);
        data.batteryLevel = batteryLevel;
      }

      return Object.keys(data).length > 1 ? data : null;
    } catch (error) {
      console.error('Error parsing characteristic data:', error);
      return null;
    }
  }

  // Detect device type based on name
  private detectDeviceType(name: string): BluetoothDevice['type'] {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('watch') || lowerName.includes('fitbit') || lowerName.includes('garmin')) {
      return 'wearable';
    } else if (lowerName.includes('phone') || lowerName.includes('iphone') || lowerName.includes('android')) {
      return 'smartphone';
    } else if (lowerName.includes('bp') || lowerName.includes('blood') || lowerName.includes('omron')) {
      return 'medical_device';
    } else if (lowerName.includes('tracker') || lowerName.includes('fitness') || lowerName.includes('activity')) {
      return 'fitness_tracker';
    }
    
    return 'wearable'; // Default
  }

  // Detect device brand based on name
  private detectDeviceBrand(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('fitbit')) return 'Fitbit';
    if (lowerName.includes('apple')) return 'Apple';
    if (lowerName.includes('samsung') || lowerName.includes('galaxy')) return 'Samsung';
    if (lowerName.includes('garmin')) return 'Garmin';
    if (lowerName.includes('polar')) return 'Polar';
    if (lowerName.includes('withings')) return 'Withings';
    if (lowerName.includes('omron')) return 'Omron';
    if (lowerName.includes('ihealth')) return 'iHealth';
    if (lowerName.includes('qardio')) return 'Qardio';
    if (lowerName.includes('beurer')) return 'Beurer';
    
    return 'Unknown';
  }

  // Handle Bluetooth errors
  private handleBluetoothError(error: any): void {
    let errorMessage = 'Bluetooth connection failed. ';
    
    if (error.name === 'NotFoundError') {
      errorMessage += 'No Bluetooth device found.';
    } else if (error.name === 'NotAllowedError') {
      errorMessage += 'Bluetooth permission denied. Please allow Bluetooth access.';
    } else if (error.name === 'NotSupportedError') {
      errorMessage += 'Bluetooth is not supported on this device.';
    } else if (error.name === 'NetworkError') {
      errorMessage += 'Network error occurred during connection.';
    } else if (error.name === 'InvalidStateError') {
      errorMessage += 'Device is already connected or in an invalid state.';
    } else if (error.name === 'SecurityError') {
      errorMessage += 'Security error occurred. Please check your browser settings.';
    } else {
      errorMessage += error.message || 'Unknown error occurred.';
    }

    this.connectionStatus.error = errorMessage;
    this.connectionStatus.isConnecting = false;
    this.connectionStatus.isDiscovering = false;
  }

  // Add listener for health data updates
  addDataListener(deviceId: string, callback: (data: HealthData) => void): void {
    this.listeners.set(deviceId, callback);
  }

  // Remove listener
  removeDataListener(deviceId: string): void {
    this.listeners.delete(deviceId);
  }

  // Notify listeners of new data
  private notifyListeners(deviceId: string, data: HealthData): void {
    const listener = this.listeners.get(deviceId);
    if (listener) {
      listener(data);
    }
  }

  // Clear all connections
  async disconnectAll(): Promise<void> {
    const deviceIds = Array.from(this.connectedDevices.keys());
    
    for (const deviceId of deviceIds) {
      await this.disconnectDevice(deviceId);
    }
    
    this.connectedDevices.clear();
    this.listeners.clear();
    
    this.connectionStatus = {
      isConnected: false,
      isConnecting: false,
      isDiscovering: false,
    };
  }
}

// Export singleton instance
export const bluetoothService = new BluetoothService(); 