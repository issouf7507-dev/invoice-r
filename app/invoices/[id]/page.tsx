"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InvoiceDetail } from "@/components/InvoiceDetail";

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

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
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
      <main className="min-h-screen p-8">
        <div className="flex justify-center items-center">
          <p>Chargement...</p>
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
