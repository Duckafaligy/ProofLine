import type { ClaimStatus } from '../data/claims';

export interface StatusConfig {
  defaultLabel: string;
  dotClass: string;
  badgeClass: string;
  /** WCAG AA compliant hex on Pure White (#FFFFFF) */
  hex: string;
}

export const STATUS_CONFIG: Record<ClaimStatus, StatusConfig> = {
  verified: {
    defaultLabel: 'Verified',
    dotClass: 'bg-emerald-700',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    hex: '#15803D',
  },
  'failed-replication': {
    defaultLabel: 'Failed Replication',
    dotClass: 'bg-rose-600',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    hex: '#DC2626',
  },
  'sources-differ': {
    defaultLabel: 'Sources Differ',
    dotClass: 'bg-amber-700',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    hex: '#B45309',
  },
};

export function getStatusConfig(status: ClaimStatus): StatusConfig {
  return STATUS_CONFIG[status];
}

export function getStatusHex(status: ClaimStatus): string {
  return STATUS_CONFIG[status].hex;
}
