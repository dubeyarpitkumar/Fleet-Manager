import { Vehicle } from '@/data/mockVehicles';
import { StatusBadge } from './StatusBadge';
import { formatLastSeen } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export const VehicleCard = ({ vehicle, onClick }: VehicleCardProps) => {
  return (
    <Card
      className="p-4 sm:p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
      onClick={onClick}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
              {vehicle.vehicleName}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{vehicle.model}</p>
          </div>
          <StatusBadge status={vehicle.status} className="flex-shrink-0" />
        </div>

        <div className="space-y-1.5 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{vehicle.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{formatLastSeen(vehicle.lastSeen)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs font-mono text-muted-foreground truncate">{vehicle.id}</p>
        </div>
      </div>
    </Card>
  );
};
