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
        'font-medium capitalize',
        status === 'online'
          ? 'bg-status-online-bg text-status-online border-status-online/20'
          : 'bg-status-offline-bg text-status-offline border-status-offline/20',
        className
      )}
      variant="outline"
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'online' ? 'bg-status-online' : 'bg-status-offline'
      )} />
      {status}
    </Badge>
  );
};
