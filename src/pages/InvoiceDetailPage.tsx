import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoices } from '../contexts/InvoiceContext';
import { StatusBadge } from '../components/StatusBadge';
import { DeleteModal } from '../components/DeleteModal';
import { InvoiceForm } from '../components/InvoiceForm';
import { formatDate, formatCurrency } from '../utils/invoice';
import { InvoiceFormData, InvoiceStatus } from '../types/invoice';

export const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInvoiceById, deleteInvoice, markAsPaid, updateInvoiceById } = useInvoices();

  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const invoice = getInvoiceById(id!);

  if (!invoice) {
    return (
      <div className="md:ml-[103px] flex items-center justify-center min-h-screen">
        <p className="text-[var(--text-secondary)]">Invoice not found.</p>
      </div>
    );
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    navigate('/');
  };

  const handleSaveEdit = (data: InvoiceFormData, _status: InvoiceStatus) => {
    updateInvoiceById(invoice.id, data);
    setShowEdit(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Edit form overlay */}
      {showEdit && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:left-[103px]"
            onClick={() => setShowEdit(false)}
            aria-hidden="true"
          />
          <div
            className="fixed top-0 left-0 md:left-[103px] bottom-0 z-50 flex flex-col overflow-hidden"
            style={{
              width: 'min(616px, 100vw)',
              backgroundColor: 'var(--form-bg)',
              borderRadius: '0 20px 20px 0',
            }}
          >
            <InvoiceForm
              invoice={invoice}
              onSave={handleSaveEdit}
              onDiscard={() => setShowEdit(false)}
              isEdit
            />
          </div>
        </>
      )}

      {/* Delete modal */}
      {showDelete && (
        <DeleteModal
          invoiceId={invoice.id}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 md:ml-[103px] pt-[72px] md:pt-0">
        <div className="max-w-[780px] mx-auto px-6 md:px-12 py-[36px] md:py-[65px]">

          {/* Go back */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-6 group mb-8 md:mb-[31px] cursor-pointer"
            aria-label="Go back to invoices list"
          >
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M6 1L2 5l4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[12px] font-bold tracking-[-0.25px] text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors">
              Go back
            </span>
          </button>

          {/* Status bar */}
          <div className="bg-[var(--bg-card)] rounded-lg px-6 md:px-8 py-5 md:py-[22px] flex items-center justify-between mb-4 md:mb-6">
            <div className="flex items-center gap-4 md:gap-5">
              <span className="text-[12px] text-[var(--text-secondary)] font-medium">Status</span>
              <StatusBadge status={invoice.status} />
            </div>

            {/* Desktop action buttons */}
            <div className="hidden md:flex items-center gap-2">
              {invoice.status !== 'paid' && (
                <button
                  onClick={() => setShowEdit(true)}
                  className="btn btn-edit cursor-pointer"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => setShowDelete(true)}
                className="btn btn-danger cursor-pointer"
              >
                Delete
              </button>
              {invoice.status === 'pending' && (
                <button
                  onClick={() => markAsPaid(invoice.id)}
                  className="btn btn-primary cursor-pointer"
                >
                  Mark as Paid
                </button>
              )}
              {invoice.status === 'draft' && (
                <button
                  onClick={() => markAsPaid(invoice.id)}
                  className="btn btn-primary cursor-pointer"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>

          {/* Invoice detail card */}
          <div className="bg-[var(--bg-card)] rounded-lg p-6 md:p-12 mb-[56px] md:mb-0">
            {/* Top section */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 md:mb-[21px]">
              <div className="mb-8 md:mb-0">
                <p className="text-[15px] font-bold tracking-[-0.31px] text-[var(--text-primary)] mb-1">
                  <span className="text-[var(--text-secondary)]">#</span>{invoice.id}
                </p>
                <p className="text-[12px] text-[var(--text-secondary)] font-medium">
                  {invoice.description}
                </p>
              </div>
              <address className="not-italic text-[12px] text-[var(--text-secondary)] leading-[18px] md:text-right font-medium">
                {invoice.senderAddress.street}<br/>
                {invoice.senderAddress.city}<br/>
                {invoice.senderAddress.postCode}<br/>
                {invoice.senderAddress.country}
              </address>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 mb-10 md:mb-[48px]">
              {/* Invoice Date + Payment Due */}
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-3">Invoice Date</p>
                  <p className="text-[15px] font-bold tracking-[-0.31px] text-[var(--text-primary)]">
                    {formatDate(invoice.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-3">Payment Due</p>
                  <p className="text-[15px] font-bold tracking-[-0.31px] text-[var(--text-primary)]">
                    {formatDate(invoice.paymentDue)}
                  </p>
                </div>
              </div>

              {/* Bill To */}
              <div>
                <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-3">Bill To</p>
                <p className="text-[15px] font-bold tracking-[-0.31px] text-[var(--text-primary)] mb-2">
                  {invoice.clientName}
                </p>
                <address className="not-italic text-[12px] text-[var(--text-secondary)] leading-[18px] font-medium">
                  {invoice.clientAddress.street}<br/>
                  {invoice.clientAddress.city}<br/>
                  {invoice.clientAddress.postCode}<br/>
                  {invoice.clientAddress.country}
                </address>
              </div>

              {/* Sent To */}
              <div className="col-span-2 md:col-span-1">
                <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-3">Sent to</p>
                <p className="text-[15px] font-bold tracking-[-0.31px] text-[var(--text-primary)]">
                  {invoice.clientEmail}
                </p>
              </div>
            </div>

            {/* Items table */}
            <div className="rounded-lg overflow-hidden">
              {/* Header (desktop only) */}
              <div className="hidden md:grid bg-[var(--bg-input)] px-8 pt-8 pb-7 rounded-t-lg"
                   style={{ gridTemplateColumns: '1fr 64px 128px 96px' }}>
                <span className="text-[12px] text-[var(--text-secondary)] font-medium">Item Name</span>
                <span className="text-[12px] text-[var(--text-secondary)] font-medium text-center">QTY.</span>
                <span className="text-[12px] text-[var(--text-secondary)] font-medium text-right">Price</span>
                <span className="text-[12px] text-[var(--text-secondary)] font-medium text-right">Total</span>
              </div>

              {/* Items */}
              <div className="bg-[var(--bg-input)] px-6 md:px-8 pb-8">
                {invoice.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex md:grid items-center justify-between py-4 first:pt-6 md:first:pt-0"
                    style={{ gridTemplateColumns: '1fr 64px 128px 96px' }}
                  >
                    {/* Mobile */}
                    <div className="md:hidden">
                      <p className="text-[12px] font-bold tracking-[-0.25px] text-[var(--text-primary)] mb-2">
                        {item.name}
                      </p>
                      <p className="text-[12px] font-bold text-[var(--text-secondary)]">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                    <p className="md:hidden text-[12px] font-bold tracking-[-0.25px] text-[var(--text-primary)]">
                      {formatCurrency(item.total)}
                    </p>

                    {/* Desktop */}
                    <p className="hidden md:block text-[12px] font-bold tracking-[-0.25px] text-[var(--text-primary)]">
                      {item.name}
                    </p>
                    <p className="hidden md:block text-[12px] font-bold text-[var(--text-secondary)] text-center">
                      {item.quantity}
                    </p>
                    <p className="hidden md:block text-[12px] font-bold text-[var(--text-secondary)] text-right">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="hidden md:block text-[12px] font-bold tracking-[-0.25px] text-[var(--text-primary)] text-right">
                      {formatCurrency(item.total)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div
                className="flex items-center justify-between px-6 md:px-8 py-6 md:py-8 rounded-b-lg"
                style={{ backgroundColor: 'var(--bg-total)' }}
              >
                <span className="text-[12px] font-medium text-[var(--text-total)]">
                  <span className="md:hidden">Grand Total</span>
                  <span className="hidden md:inline">Amount Due</span>
                </span>
                <span className="text-[20px] md:text-[24px] font-bold tracking-[-0.5px] text-white">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile bottom action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--bg-card)] px-6 py-5 flex items-center gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
        {invoice.status !== 'paid' && (
          <button
            onClick={() => setShowEdit(true)}
            className="btn btn-edit flex-1 cursor-pointer"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => setShowDelete(true)}
          className="btn btn-danger flex-1 cursor-pointer"
        >
          Delete
        </button>
        {(invoice.status === 'pending' || invoice.status === 'draft') && (
          <button
            onClick={() => markAsPaid(invoice.id)}
            className="btn btn-primary flex-1 cursor-pointer"
          >
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
};
