export interface Vehicle {
  id: string;
  vehicleName: string;
  model: string;
  status: 'online' | 'offline';
  lastSeen: string;
  location: string;
  telemetry?: {
    speed: number;
    battery: number;
  };
  activityLog?: Array<{
    timestamp: string;
    activity: string;
  }>;
}

const generateMockVehicles = (): Vehicle[] => {
  const models = ['Sprinter 3500', 'Transit 350', 'ProMaster 2500', 'Express 3500', 'NV3500'];
  const locations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'Miami, FL',
  ];

  const vehicles: Vehicle[] = [];

  for (let i = 1; i <= 25; i++) {
    const isOnline = Math.random() > 0.3;
    const hoursAgo = Math.floor(Math.random() * 48);
    const lastSeen = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

    vehicles.push({
      id: `VEH-${String(i).padStart(4, '0')}`,
      vehicleName: `Fleet Unit ${i}`,
      model: models[Math.floor(Math.random() * models.length)],
      status: isOnline ? 'online' : 'offline',
      lastSeen,
      location: locations[Math.floor(Math.random() * locations.length)],
      telemetry: {
        speed: isOnline ? Math.floor(Math.random() * 80) : 0,
        battery: Math.floor(Math.random() * 100),
      },
      activityLog: [
        {
          timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          activity: 'Started route delivery',
        },
        {
          timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
          activity: 'Completed maintenance check',
        },
        {
          timestamp: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000).toISOString(),
          activity: 'Refueled at depot',
        },
      ],
    });
  }

  return vehicles;
};

export const mockVehicles = generateMockVehicles();
