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

      {!isCreating && !selectedInvoice && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Factures</h2>
            <Button onClick={() => setIsCreating(true)}>
              Créer une nouvelle facture
            </Button>
          </div>

          <div className="grid gap-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedInvoice(invoice)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{invoice.clientName}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Total:{" "}
                      {invoice.items
                        .reduce((sum, item) => sum + item.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCreating && (
        <div className="max-w-4xl mx-auto">
          <InvoiceForm onSubmitAction={handleCreateInvoice} />
          <div className="mt-4">
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      {selectedInvoice && (
        <div>
          <InvoiceView invoice={selectedInvoice} />
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedInvoice(null);
                setIsCreating(false);
              }}
            >
              Retour à la liste
            </Button>
          </div>
        </div>
      )}
    </main>
  );
}
