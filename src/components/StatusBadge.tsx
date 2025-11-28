import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'online' | 'offline';
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <Badge
      className={cn(
        'font-medium capitalize relative',
        status === 'online'
          ? 'bg-status-online-bg text-status-online border-status-online/20 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.3)]'
          : 'bg-status-offline-bg text-status-offline border-status-offline/20',
        className
      )}
      variant="outline"
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5 animate-ping absolute',
        status === 'online' ? 'bg-status-online' : 'bg-status-offline'
      )} />
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5 relative',
        status === 'online' ? 'bg-status-online' : 'bg-status-offline'
      )} />
      {status}
    </Badge>
  );
};
