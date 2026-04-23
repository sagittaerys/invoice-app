export type InvoiceStatus = 'draft' | 'pending' | 'paid';

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
}

export interface InvoiceFormData {
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  createdAt: string;
}

export type FilterStatus = 'all' | InvoiceStatus;
