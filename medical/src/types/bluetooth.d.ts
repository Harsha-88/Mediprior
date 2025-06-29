// TypeScript declarations for Web Bluetooth API
// This file provides type definitions for the Web Bluetooth API

declare global {
  interface Navigator {
    bluetooth?: Bluetooth;
  }

  interface Bluetooth {
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    getAvailability(): Promise<boolean>;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface RequestDeviceOptions {
    acceptAllDevices?: boolean;
    optionalServices?: Array<string | number>;
    filters?: Array<BluetoothLEScanFilter>;
  }

  interface BluetoothLEScanFilter {
    name?: string;
    namePrefix?: string;
    services?: Array<string | number>;
    manufacturerData?: Array<BluetoothManufacturerDataFilter>;
    serviceData?: Array<BluetoothServiceDataFilter>;
  }

  interface BluetoothManufacturerDataFilter {
    companyIdentifier: number;
    dataPrefix?: BufferSource;
    mask?: BufferSource;
  }

  interface BluetoothServiceDataFilter {
    service: string | number;
    dataPrefix?: BufferSource;
    mask?: BufferSource;
  }

  interface BluetoothDevice extends EventTarget {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    uuids?: Array<string>;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string | number): Promise<BluetoothRemoteGATTService>;
    getPrimaryServices(service?: string | number): Promise<Array<BluetoothRemoteGATTService>>;
  }

  interface BluetoothRemoteGATTService {
    device: BluetoothDevice;
    isPrimary: boolean;
    uuid: string;
    getCharacteristic(characteristic: string | number): Promise<BluetoothRemoteGATTCharacteristic>;
    getCharacteristics(characteristic?: string | number): Promise<Array<BluetoothRemoteGATTCharacteristic>>;
    getIncludedService(service: string | number): Promise<BluetoothRemoteGATTService>;
    getIncludedServices(service?: string | number): Promise<Array<BluetoothRemoteGATTService>>;
  }

  interface BluetoothRemoteGATTCharacteristic {
    service: BluetoothRemoteGATTService;
    uuid: string;
    properties: BluetoothCharacteristicProperties;
    value?: DataView;
    getDescriptor(descriptor: string | number): Promise<BluetoothRemoteGATTDescriptor>;
    getDescriptors(descriptor?: string | number): Promise<Array<BluetoothRemoteGATTDescriptor>>;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    writeValueWithResponse(value: BufferSource): Promise<void>;
    writeValueWithoutResponse(value: BufferSource): Promise<void>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
  }

  interface BluetoothCharacteristicProperties {
    authenticatedSignedWrites: boolean;
    broadcast: boolean;
    indicate: boolean;
    notify: boolean;
    read: boolean;
    reliableWrite: boolean;
    writableAuxiliaries: boolean;
    write: boolean;
    writeWithoutResponse: boolean;
  }

  interface BluetoothRemoteGATTDescriptor {
    characteristic: BluetoothRemoteGATTCharacteristic;
    uuid: string;
    value?: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
  }

  // Event types
  interface BluetoothDeviceEvent extends Event {
    device: BluetoothDevice;
  }

  interface CharacteristicValueChangedEvent extends Event {
    target: BluetoothRemoteGATTCharacteristic;
  }

  // Permission API
  interface Permissions {
    query(permissionDesc: PermissionDescriptor): Promise<PermissionStatus>;
  }

  interface PermissionDescriptor {
    name: string;
  }

  interface PermissionStatus {
    state: 'granted' | 'denied' | 'prompt';
    onchange: ((this: PermissionStatus, ev: Event) => any) | null;
  }

  interface NavigatorPermissions {
    query(permissionDesc: PermissionDescriptor): Promise<PermissionStatus>;
  }

  interface Navigator {
    permissions?: NavigatorPermissions;
  }
}

export {}; 