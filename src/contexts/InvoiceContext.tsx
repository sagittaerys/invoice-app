import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Invoice, InvoiceFormData, InvoiceStatus, FilterStatus } from '../types/invoice';
import { createInvoice, updateInvoice } from '../utils/invoice';
import { sampleInvoices } from '../data/sampleInvoices';

interface InvoiceContextType {
  invoices: Invoice[];
  filter: FilterStatus;
  setFilter: (f: FilterStatus) => void;
  filteredInvoices: Invoice[];
  addInvoice: (data: InvoiceFormData, status: InvoiceStatus) => Invoice;
  updateInvoiceById: (id: string, data: InvoiceFormData) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const STORAGE_KEY = 'invoice-app-data';

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Invoice[];
    } catch {}
    return sampleInvoices;
  });

  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices]);

  const filteredInvoices =
    filter === 'all' ? invoices : invoices.filter((inv) => inv.status === filter);

  const addInvoice = (data: InvoiceFormData, status: InvoiceStatus): Invoice => {
    const invoice = createInvoice(data, status);
    setInvoices((prev) => [invoice, ...prev]);
    return invoice;
  };

  const updateInvoiceById = (id: string, data: InvoiceFormData) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? updateInvoice(inv, data) : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  const markAsPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: 'paid' } : inv))
    );
  };

  const getInvoiceById = (id: string) => invoices.find((inv) => inv.id === id);

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        filter,
        setFilter,
        filteredInvoices,
        addInvoice,
        updateInvoiceById,
        deleteInvoice,
        markAsPaid,
        getInvoiceById,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = (): InvoiceContextType => {
  const ctx = useContext(InvoiceContext);
  if (!ctx) throw new Error('useInvoices must be used within InvoiceProvider');
  return ctx;
};
