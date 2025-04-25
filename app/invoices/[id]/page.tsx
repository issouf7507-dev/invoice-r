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
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="flex justify-center items-center flex-col">
          <p>Chargement...</p>
          <Loader2 />
        </div>
      </main>
    );
  }

  if (!invoice) {
    return (
      <main className="min-h-screen p-8">
        <div className="flex justify-center items-center">
          <p>Facture non trouvée</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <InvoiceDetail invoice={invoice} />
    </main>
  );
}
