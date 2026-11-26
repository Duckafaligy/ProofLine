import type { ClaimStatus } from '../data/claims';

interface StatusBadgeProps {
  status: ClaimStatus;
  label?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<
  ClaimStatus,
  { defaultLabel: string; dotClass: string; badgeClass: string; hex: string }
> = {
  verified: {
    defaultLabel: 'Verified',
    dotClass: 'bg-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    hex: '#16A34A',
  },
  'failed-replication': {
    defaultLabel: 'Failed Replication',
    dotClass: 'bg-rose-600',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    hex: '#DC2626',
  },
  'sources-differ': {
    defaultLabel: 'Sources Differ',
    dotClass: 'bg-amber-600',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    hex: '#D97706',
  },
};

export function getStatusHex(status: ClaimStatus): string {
  return STATUS_CONFIG[status].hex;
}

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const sizeClasses =
    size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight ${sizeClasses} ${cfg.badgeClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClass}`} />
      {label ?? cfg.defaultLabel}
    </span>
  );
}
