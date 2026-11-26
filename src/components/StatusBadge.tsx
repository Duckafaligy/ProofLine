import type { ClaimStatus } from '../data/claims';
import { getStatusConfig } from '../utils/status';

interface StatusBadgeProps {
  status: ClaimStatus;
  label?: string;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const cfg = getStatusConfig(status);
  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium tracking-tight ${sizeClasses} ${cfg.badgeClass}`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dotClass}`}
      />
      {label ?? cfg.defaultLabel}
    </span>
  );
}
