"use client";

import { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceView } from "@/components/InvoiceView";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/invoice";

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleCreateInvoice = (invoice: Invoice) => {
    setInvoices([invoice, ...invoices]);
    setSelectedInvoice(invoice);
    setIsCreating(false);
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Nouvelle facture</h1>
        <p className="text-sm text-muted-foreground">
          Renseignez les informations du client et les articles à facturer.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
        <InvoiceForm onSubmitAction={handleCreateInvoice} />
      </div>
    </main>
  );
}
