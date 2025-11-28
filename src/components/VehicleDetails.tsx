import { Vehicle } from '@/data/mockVehicles';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from './StatusBadge';
import { formatLastSeen, formatDateTime } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { MapPin, Gauge, Battery, Clock, Activity } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface VehicleDetailsProps {
  vehicle: Vehicle | null;
  open: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const VehicleDetails = ({ vehicle, open, onClose, onEdit }: VehicleDetailsProps) => {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{vehicle.vehicleName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={vehicle.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Vehicle ID</span>
              <span className="font-mono text-sm">{vehicle.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Model</span>
              <span className="text-sm font-medium">{vehicle.model}</span>
            </div>
          </div>

          <Separator />

          {/* Location & Time */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{vehicle.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Last Seen</p>
                <p className="font-medium">{formatLastSeen(vehicle.lastSeen)}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(vehicle.lastSeen)}</p>
              </div>
            </div>
          </div>

          {/* Telemetry */}
          {vehicle.telemetry && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Telemetry
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <Gauge className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Speed</span>
                    </div>
                    <p className="text-2xl font-bold">{vehicle.telemetry.speed} mph</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                      <Battery className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Battery</span>
                    </div>
                    <p className="text-2xl font-bold">{vehicle.telemetry.battery}%</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Activity Log */}
          {vehicle.activityLog && vehicle.activityLog.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Recent Activity</h3>
                <div className="space-y-3">
                  {vehicle.activityLog.map((activity, index) => (
                    <div key={index} className="flex gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.activity}</p>
                        <p className="text-muted-foreground text-xs">
                          {formatDateTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={onEdit} className="flex-1">
              Edit Vehicle
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
