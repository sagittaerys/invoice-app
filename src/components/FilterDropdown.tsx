import { useState, useRef, useEffect } from 'react';
import { FilterStatus } from '../types/invoice';

interface FilterProps {
  current: FilterStatus;
  onChange: (f: FilterStatus) => void;
}

const statuses: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
];

export const FilterDropdown = ({ current, onChange }: FilterProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const label = current === 'all' ? 'Filter by status' : `Filter by status`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex items-center gap-3 font-bold text-[12px] leading-[15px] tracking-[-0.25px] text-[var(--text-primary)] hover:text-[#7C5DFA] transition-colors cursor-pointer"
      >
        <span className="hidden sm:inline">{label}</span>
        <span className="sm:hidden">Filter</span>
        <svg
          width="11"
          height="7"
          viewBox="0 0 11 7"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5.5 5.5L10 1" stroke="#7C5DFA" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Filter invoices by status"
          className="absolute top-full mt-6 left-1/2 -translate-x-1/2 bg-[var(--dropdown-bg)] rounded-lg shadow-[0_10px_20px_rgba(72,84,159,0.25)] p-6 min-w-[192px] flex flex-col gap-4 z-50"
        >
          {statuses.map(({ value, label }) => (
            <label
              key={value}
              className="flex items-center gap-4 cursor-pointer group"
              role="option"
              aria-selected={current === value}
            >
              <input
                type="checkbox"
                checked={current === value}
                onChange={() => {
                  onChange(value);
                  setOpen(false);
                }}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center transition-colors ${
                  current === value
                    ? 'bg-[#7C5DFA] border-[#7C5DFA]'
                    : 'border-[var(--checkbox-border)] bg-[var(--checkbox-bg)] group-hover:border-[#7C5DFA]'
                }`}
                aria-hidden="true"
              >
                {current === value && (
                  <svg width="10" height="8" viewBox="0 0 10 8">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="font-bold text-[12px] leading-[15px] tracking-[-0.25px] text-[var(--text-primary)]">
                {label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
