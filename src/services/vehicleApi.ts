import { mockVehicles, Vehicle } from '@/data/mockVehicles';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface VehicleQuery {
  search?: string;
  status?: 'all' | 'online' | 'offline';
  sortBy?: 'name' | 'lastSeen';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  totalPages: number;
}

export const vehicleApi = {
  async getVehicles(query: VehicleQuery = {}): Promise<VehicleListResponse> {
    await delay(100);

    let filtered = [...mockVehicles];

    // Search filter
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      filtered = filtered.filter(v => 
        v.vehicleName.toLowerCase().includes(searchLower) ||
        v.id.toLowerCase().includes(searchLower) ||
        v.model.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (query.status && query.status !== 'all') {
      filtered = filtered.filter(v => v.status === query.status);
    }

    // Sorting
    const sortBy = query.sortBy || 'name';
    const sortOrder = query.sortOrder || 'asc';

    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === 'name') {
        compareValue = a.vehicleName.localeCompare(b.vehicleName);
      } else if (sortBy === 'lastSeen') {
        compareValue = new Date(a.lastSeen).getTime() - new Date(b.lastSeen).getTime();
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    // Pagination
    const page = query.page || 1;
    const limit = query.limit || 8;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVehicles = filtered.slice(startIndex, endIndex);

    return {
      vehicles: paginatedVehicles,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    };
  },

  async getVehicleById(id: string): Promise<Vehicle | null> {
    await delay(50);
    return mockVehicles.find(v => v.id === id) || null;
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    await delay(100);
    
    const vehicleIndex = mockVehicles.findIndex(v => v.id === id);
    if (vehicleIndex === -1) {
      throw new Error('Vehicle not found');
    }

    mockVehicles[vehicleIndex] = {
      ...mockVehicles[vehicleIndex],
      ...updates,
    };

    return mockVehicles[vehicleIndex];
  },
};
