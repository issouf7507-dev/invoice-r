"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Invoice } from "@/types/invoice";

export default function PayInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const { id } = use(params);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch invoice");
      }
      const data = await response.json();
      setInvoice(data);
      setAmount(data.remainingAmount);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/invoices/${id}/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      router.push(`/invoices/${id}`);
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Paiement de la facture</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Détails de la facture</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium">Client:</p>
            <p>{invoice.clientName}</p>
          </div>
          <div>
            <p className="font-medium">Montant total:</p>
            <p>{invoice.totalAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Déjà payé:</p>
            <p>{invoice.paidAmount.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Reste à payer:</p>
            <p>{invoice.remainingAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="amount">Montant à payer</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0"
            max={invoice.remainingAmount}
            step="0.01"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Montant maximum: {invoice.remainingAmount.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Traitement..." : "Confirmer le paiement"}
          </Button>
        </div>
      </form>
    </div>
  );
}
