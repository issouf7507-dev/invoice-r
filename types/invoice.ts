export interface InvoiceItem {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  /** Poids en kilogrammes (nombre à virgule flottante) */
  weight: number;
}

export interface Payment {
  id: number;
  amount: number;
  paymentDate: string;
  invoiceId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: number;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  isPaid: boolean;
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}
