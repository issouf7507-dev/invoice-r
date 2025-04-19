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
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Gestionnaire de Factures
      </h1>

      <div className="max-w-4xl mx-auto">
        <InvoiceForm onSubmitAction={handleCreateInvoice} />
        <div className="mt-4">
          {/* <Button variant="outline" onClick={() => setIsCreating(false)}>
            Annuler
          </Button> */}
        </div>
      </div>
    </main>
  );
}
