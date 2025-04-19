"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InvoiceList } from "@/components/InvoiceList";

interface InvoiceItem {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: number;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  items: InvoiceItem[];
  createdAt: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    router.push(`/invoices/${invoice.id}`);
  };

  return (
    <main className="min-h-screen p-8">
      <InvoiceList
        invoices={invoices}
        onSelectInvoiceAction={handleSelectInvoice}
      />
    </main>
  );
}
