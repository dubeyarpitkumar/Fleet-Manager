import { describe, it, expect } from 'vitest';
import { vehicleApi } from './vehicleApi';

describe('vehicleApi', () => {
  describe('getVehicles', () => {
    it('should return paginated vehicles with correct structure', async () => {
      const result = await vehicleApi.getVehicles({
        page: 1,
        limit: 8,
      });

      expect(result).toHaveProperty('vehicles');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('totalPages');
      expect(Array.isArray(result.vehicles)).toBe(true);
      expect(result.vehicles.length).toBeLessThanOrEqual(8);
      expect(result.page).toBe(1);
    });

    it('should filter vehicles by status', async () => {
      const result = await vehicleApi.getVehicles({
        status: 'online',
      });

      result.vehicles.forEach((vehicle) => {
        expect(vehicle.status).toBe('online');
      });
    });

    it('should search vehicles by name', async () => {
      const result = await vehicleApi.getVehicles({
        search: 'Fleet Unit 1',
      });

      result.vehicles.forEach((vehicle) => {
        expect(
          vehicle.vehicleName.toLowerCase().includes('fleet unit 1')
        ).toBe(true);
      });
    });

    it('should sort vehicles by name in ascending order', async () => {
      const result = await vehicleApi.getVehicles({
        sortBy: 'name',
        sortOrder: 'asc',
      });

      if (result.vehicles.length > 1) {
        for (let i = 0; i < result.vehicles.length - 1; i++) {
          expect(
            result.vehicles[i].vehicleName.localeCompare(
              result.vehicles[i + 1].vehicleName
            )
          ).toBeLessThanOrEqual(0);
        }
      }
    });

    it('should sort vehicles by lastSeen in descending order', async () => {
      const result = await vehicleApi.getVehicles({
        sortBy: 'lastSeen',
        sortOrder: 'desc',
      });

      if (result.vehicles.length > 1) {
        for (let i = 0; i < result.vehicles.length - 1; i++) {
          const date1 = new Date(result.vehicles[i].lastSeen).getTime();
          const date2 = new Date(result.vehicles[i + 1].lastSeen).getTime();
          expect(date1).toBeGreaterThanOrEqual(date2);
        }
      }
    });
  });

  describe('getVehicleById', () => {
    it('should return a vehicle by id', async () => {
      const result = await vehicleApi.getVehicles({ limit: 1 });
      const vehicleId = result.vehicles[0]?.id;

      if (vehicleId) {
        const vehicle = await vehicleApi.getVehicleById(vehicleId);
        expect(vehicle).not.toBeNull();
        expect(vehicle?.id).toBe(vehicleId);
      }
    });

    it('should return null for non-existent vehicle', async () => {
      const vehicle = await vehicleApi.getVehicleById('NON_EXISTENT_ID');
      expect(vehicle).toBeNull();
    });
  });

  describe('updateVehicle', () => {
    it('should update vehicle name and status', async () => {
      const result = await vehicleApi.getVehicles({ limit: 1 });
      const vehicleId = result.vehicles[0]?.id;

      if (vehicleId) {
        const updatedVehicle = await vehicleApi.updateVehicle(vehicleId, {
          vehicleName: 'Updated Name',
          status: 'offline',
        });

        expect(updatedVehicle.vehicleName).toBe('Updated Name');
        expect(updatedVehicle.status).toBe('offline');
      }
    });

    it('should throw error for non-existent vehicle', async () => {
      await expect(
        vehicleApi.updateVehicle('NON_EXISTENT_ID', { vehicleName: 'Test' })
      ).rejects.toThrow('Vehicle not found');
    });
  });
});
