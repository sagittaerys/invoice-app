import { InvoiceStatus } from '../types/invoice';

interface StatusBadgeProps {
  status: InvoiceStatus;
}

const config: Record<InvoiceStatus, { label: string; dot: string; bg: string; text: string }> = {
  paid: {
    label: 'Paid',
    dot: 'bg-[#33D69F]',
    bg: 'bg-[#33D69F]/10',
    text: 'text-[#33D69F]',
  },
  pending: {
    label: 'Pending',
    dot: 'bg-[#FF8F00]',
    bg: 'bg-[#FF8F00]/10',
    text: 'text-[#FF8F00]',
  },
  draft: {
    label: 'Draft',
    dot: 'bg-[var(--status-draft-dot)]',
    bg: 'bg-[var(--status-draft-bg)]',
    text: 'text-[var(--status-draft-text)]',
  },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const { label, dot, bg, text } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-[10px] rounded-md font-bold text-[12px] leading-[15px] tracking-[-0.25px] ${bg} ${text} min-w-[104px] justify-center`}
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
};
