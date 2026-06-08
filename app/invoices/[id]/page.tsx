"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { InvoiceDetail } from "@/components/InvoiceDetail";
import { Loader2 } from "lucide-react";
import { Invoice } from "@/types/invoice";

interface InvoiceItem {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  weight: number;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = use(params);

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
    } catch (error) {
      console.error("Error fetching invoice:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
          <p>Chargement...</p>
        </div>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="flex flex-1 items-center justify-center p-8">
        <p className="text-muted-foreground">Facture non trouvée</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <InvoiceDetail invoice={invoice} />
    </main>
  );
}
