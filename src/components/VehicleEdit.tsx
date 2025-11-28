import { useState } from 'react';
import { Vehicle } from '@/data/mockVehicles';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { vehicleApi } from '@/services/vehicleApi';

interface VehicleEditProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VehicleEdit = ({ vehicle, open, onClose, onSuccess }: VehicleEditProps) => {
  const [vehicleName, setVehicleName] = useState(vehicle?.vehicleName || '');
  const [status, setStatus] = useState<'online' | 'offline'>(vehicle?.status || 'offline');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!vehicleName.trim()) {
      setError('Vehicle name cannot be empty');
      return;
    }

    if (!vehicle) return;

    setLoading(true);
    try {
      await vehicleApi.updateVehicle(vehicle.id, {
        vehicleName: vehicleName.trim(),
        status,
      });

      toast({
        title: 'Success',
        description: 'Vehicle updated successfully',
      });

      onSuccess();
      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleName">Vehicle Name *</Label>
            <Input
              id="vehicleName"
              value={vehicleName}
              onChange={(e) => setVehicleName(e.target.value)}
              placeholder="Enter vehicle name"
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={status} onValueChange={(value: 'online' | 'offline') => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Vehicle ID: <span className="font-mono">{vehicle.id}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Model: {vehicle.model}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
