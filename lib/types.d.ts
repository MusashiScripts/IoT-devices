export interface User {
  username: string
  password: string
}

export interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
  isOn: boolean;
  location: string;
  powerConsumption?: number;
  lastUpdated: string;
  schedule?: {
    enabled: boolean;
    time: string;
    action: 'on' | 'off';
    repeat: string[];
  };
}