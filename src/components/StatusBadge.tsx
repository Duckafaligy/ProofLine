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
    dotClass: 'bg-[#10B981]',
    badgeClass:
      'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
    hex: '#10B981',
  },
  'failed-replication': {
    defaultLabel: 'Failed Replication',
    dotClass: 'bg-[#F43F5E]',
    badgeClass:
      'bg-[#F43F5E]/10 text-[#F43F5E] border-[#F43F5E]/25',
    hex: '#F43F5E',
  },
  'sources-differ': {
    defaultLabel: 'Sources Differ',
    dotClass: 'bg-[#F59E0B]',
    badgeClass:
      'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/25',
    hex: '#F59E0B',
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
