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

export interface Invoice {
  id: number;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  items: InvoiceItem[];
  createdAt: string;
}
