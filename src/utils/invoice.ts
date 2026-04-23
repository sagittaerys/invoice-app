import { format, addDays, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceFormData, InvoiceStatus } from '../types/invoice';

export const generateId = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = Math.floor(Math.random() * 9000 + 1000);
  const l1 = letters[Math.floor(Math.random() * 26)];
  const l2 = letters[Math.floor(Math.random() * 26)];
  return `${l1}${l2}${nums}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateStr: string): string => {
  try {
    return format(parseISO(dateStr), 'dd MMM yyyy');
  } catch {
    return dateStr;
  }
};

export const calcPaymentDue = (createdAt: string, terms: number): string => {
  try {
    return format(addDays(parseISO(createdAt), terms), 'yyyy-MM-dd');
  } catch {
    return createdAt;
  }
};

export const calcTotal = (items: Invoice['items']): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

export const createInvoice = (formData: InvoiceFormData, status: InvoiceStatus): Invoice => {
  const items = formData.items.map((item) => ({
    ...item,
    id: item.id || uuidv4(),
    total: item.quantity * item.price,
  }));

  return {
    id: generateId(),
    createdAt: formData.createdAt || format(new Date(), 'yyyy-MM-dd'),
    paymentDue: calcPaymentDue(
      formData.createdAt || format(new Date(), 'yyyy-MM-dd'),
      formData.paymentTerms
    ),
    description: formData.description,
    paymentTerms: formData.paymentTerms,
    clientName: formData.clientName,
    clientEmail: formData.clientEmail,
    status,
    senderAddress: formData.senderAddress,
    clientAddress: formData.clientAddress,
    items,
    total: calcTotal(items),
  };
};

export const updateInvoice = (existing: Invoice, formData: InvoiceFormData): Invoice => {
  const items = formData.items.map((item) => ({
    ...item,
    id: item.id || uuidv4(),
    total: item.quantity * item.price,
  }));

  return {
    ...existing,
    createdAt: formData.createdAt,
    paymentDue: calcPaymentDue(formData.createdAt, formData.paymentTerms),
    description: formData.description,
    paymentTerms: formData.paymentTerms,
    clientName: formData.clientName,
    clientEmail: formData.clientEmail,
    senderAddress: formData.senderAddress,
    clientAddress: formData.clientAddress,
    items,
    total: calcTotal(items),
  };
};
