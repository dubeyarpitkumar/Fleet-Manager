import { Vehicle } from '@/data/mockVehicles';
import { formatDateTime } from './formatters';

export const exportToCSV = (vehicles: Vehicle[], filename: string = 'fleet-vehicles.csv') => {
  // Define CSV headers
  const headers = [
    'Vehicle ID',
    'Vehicle Name',
    'Model',
    'Status',
    'Location',
    'Last Seen',
    'Speed (mph)',
    'Battery (%)',
  ];

  // Convert vehicles to CSV rows
  const rows = vehicles.map(vehicle => [
    vehicle.id,
    vehicle.vehicleName,
    vehicle.model,
    vehicle.status,
    vehicle.location,
    formatDateTime(vehicle.lastSeen),
    vehicle.telemetry?.speed.toString() || '0',
    vehicle.telemetry?.battery.toString() || 'N/A',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
