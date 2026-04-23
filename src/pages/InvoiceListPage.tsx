import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoices } from '../contexts/InvoiceContext';
import { StatusBadge } from '../components/StatusBadge';
import { FilterDropdown } from '../components/FilterDropdown';
import { InvoiceForm } from '../components/InvoiceForm';
import { formatDate, formatCurrency } from '../utils/invoice';
import { InvoiceFormData, InvoiceStatus } from '../types/invoice';

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center flex-1 text-center px-6 py-20">
    {/* Illustration */}
    <svg width="242" height="200" viewBox="0 0 242 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-10">
      <ellipse cx="121" cy="185" rx="80" ry="15" fill="#7C5DFA" fillOpacity="0.07"/>
      {/* envelope */}
      <rect x="46" y="80" width="150" height="100" rx="8" fill="#7C5DFA" fillOpacity="0.15"/>
      <path d="M46 88L121 138L196 88" stroke="#7C5DFA" strokeWidth="2" strokeOpacity="0.4"/>
      {/* floating letters */}
      <rect x="10" y="60" width="28" height="22" rx="4" fill="#DFE3FA" transform="rotate(-15 10 60)"/>
      <rect x="200" y="55" width="28" height="22" rx="4" fill="#DFE3FA" transform="rotate(12 200 55)"/>
      <rect x="30" y="100" width="22" height="18" rx="3" fill="#9277FF" fillOpacity="0.5" transform="rotate(-8 30 100)"/>
      <rect x="185" y="105" width="22" height="18" rx="3" fill="#9277FF" fillOpacity="0.5" transform="rotate(10 185 105)"/>
      {/* person */}
      <circle cx="121" cy="55" r="22" fill="#7C5DFA"/>
      <ellipse cx="121" cy="52" rx="8" ry="10" fill="white" fillOpacity="0.9"/>
      <path d="M103 68c0-9.9 8.06-18 18-18s18 8.1 18 18" fill="#7C5DFA"/>
      {/* megaphone */}
      <path d="M136 44l12-8v24l-12-8v-8z" fill="white" fillOpacity="0.8"/>
      <rect x="128" y="46" width="8" height="12" rx="2" fill="white"/>
      <path d="M148 50h6M148 54h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>

    <h2 className="text-[20px] font-bold tracking-[-0.63px] text-[var(--text-primary)] mb-4">
      There is nothing here
    </h2>
    <p className="text-[var(--text-secondary)] text-[12px] leading-[22px] max-w-[220px]">
      Create an invoice by clicking the{' '}
      <strong className="text-[var(--text-primary)]">New Invoice</strong> button and get started
    </p>
  </div>
);

export const InvoiceListPage = () => {
  const navigate = useNavigate();
  const { filteredInvoices, filter, setFilter, addInvoice, invoices } = useInvoices();
  const [showForm, setShowForm] = useState(false);

  const handleSave = (data: InvoiceFormData, status: InvoiceStatus) => {
    addInvoice(data, status);
    setShowForm(false);
  };

  const subtitle = () => {
    const total = filteredInvoices.length;
    if (total === 0) return 'No invoices';
    if (filter === 'all') return `There are ${total} total invoice${total !== 1 ? 's' : ''}`;
    return `There are ${total} ${filter} invoice${total !== 1 ? 's' : ''}`;
  };

  return (
    <div className="flex min-h-screen">
      {/* Slide-in Form Overlay */}
      {showForm && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:left-[103px]"
            onClick={() => setShowForm(false)}
            aria-hidden="true"
          />
          {/* Form panel */}
          <div
            className="fixed top-0 left-0 md:left-[103px] bottom-0 z-50 flex flex-col overflow-hidden"
            style={{
              width: 'min(616px, 100vw)',
              backgroundColor: 'var(--form-bg)',
              borderRadius: '0 20px 20px 0',
            }}
          >
            <InvoiceForm
              onSave={handleSave}
              onDiscard={() => setShowForm(false)}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col md:ml-[103px]">
        <div className="flex-1 flex flex-col max-w-[780px] mx-auto w-full px-6 md:px-12 pt-[104px] md:pt-[72px] lg:pt-[80px]">

          {/* Header */}
          <div className="flex items-center justify-between mt-[36px] md:mt-[65px] mb-8 md:mb-[65px]">
            <div>
              <h1 className="text-[24px] md:text-[36px] font-bold tracking-[-1px] text-[var(--text-primary)] leading-none">
                Invoices
              </h1>
              <p className="text-[var(--text-secondary)] text-[12px] font-medium mt-1 md:mt-2">
                {subtitle()}
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-10">
              <FilterDropdown current={filter} onChange={setFilter} />

              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary flex items-center gap-2 md:gap-4 h-[44px] md:h-[48px] px-4 md:px-6 cursor-pointer"
                aria-label="Create new invoice"
              >
                <span className="flex items-center justify-center w-8 h-8 bg-white rounded-full flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M6.313 0v4.688H11v1.624H6.313V11H4.688V6.312H0V4.688h4.688V0z" fill="#7C5DFA"/>
                  </svg>
                </span>
                <span className="hidden sm:inline">New Invoice</span>
                <span className="sm:hidden">New</span>
              </button>
            </div>
          </div>

          {/* Invoice list */}
          {filteredInvoices.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="flex flex-col gap-4 pb-10" role="list" aria-label="Invoice list">
              {filteredInvoices.map((invoice) => (
                <li key={invoice.id}>
                  <button
                    onClick={() => navigate(`/invoice/${invoice.id}`)}
                    className="w-full text-left group"
                    aria-label={`View invoice ${invoice.id} from ${invoice.clientName}`}
                  >
                    {/* Desktop layout */}
                    <div
                      className="hidden md:grid items-center bg-[var(--bg-card)] rounded-lg px-8 py-5 border border-transparent hover:border-[#7C5DFA] transition-all duration-150 cursor-pointer"
                      style={{ gridTemplateColumns: '103px 1fr 1fr 1fr 140px 16px' }}
                    >
                      <span className="font-bold text-[12px] tracking-[-0.25px] text-[var(--text-primary)]">
                        <span className="text-[#7E88C3]">#</span>{invoice.id}
                      </span>
                      <span className="text-[12px] text-[var(--text-secondary)] font-medium">
                        Due {formatDate(invoice.paymentDue)}
                      </span>
                      <span className="text-[12px] text-[var(--text-secondary)] font-medium">
                        {invoice.clientName}
                      </span>
                      <span className="text-[15px] font-bold tracking-[-0.31px] text-[var(--text-primary)]">
                        {formatCurrency(invoice.total)}
                      </span>
                      <StatusBadge status={invoice.status} />
                      <svg width="7" height="10" viewBox="0 0 7 10" fill="none" className="ml-auto">
                        <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {/* Mobile layout */}
                    <div className="md:hidden bg-[var(--bg-card)] rounded-lg p-6 border border-transparent hover:border-[#7C5DFA] transition-all duration-150 cursor-pointer">
                      <div className="flex items-center justify-between mb-6">
                        <span className="font-bold text-[12px] tracking-[-0.25px] text-[var(--text-primary)]">
                          <span className="text-[#7E88C3]">#</span>{invoice.id}
                        </span>
                        <span className="text-[12px] text-[var(--text-secondary)] font-medium">
                          {invoice.clientName}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[12px] text-[var(--text-secondary)] font-medium mb-2">
                            Due {formatDate(invoice.paymentDue)}
                          </p>
                          <p className="text-[16px] font-bold tracking-[-0.8px] text-[var(--text-primary)]">
                            {formatCurrency(invoice.total)}
                          </p>
                        </div>
                        <StatusBadge status={invoice.status} />
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};
