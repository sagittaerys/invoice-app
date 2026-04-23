import { useEffect, useRef } from 'react';

interface DeleteModalProps {
  invoiceId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal = ({ invoiceId, onConfirm, onCancel }: DeleteModalProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        ref={modalRef}
        className="bg-[var(--modal-bg)] rounded-lg p-8 max-w-[480px] w-full shadow-2xl"
      >
        <h2 id="delete-modal-title" className="text-[24px] font-bold tracking-[-0.5px] text-[var(--text-primary)] mb-3">
          Confirm Deletion
        </h2>
        <p className="text-[var(--text-secondary)] text-[12px] leading-[22px] mb-8">
          Are you sure you want to delete invoice #{invoiceId}? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="btn btn-secondary cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
