"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { Invoice } from "@/types/invoice";
import { InvoicePDF } from "./InvoicePDF";
import { pdf } from "@react-pdf/renderer";
import { useState } from "react";

interface PDFButtonProps {
  invoices: Invoice[];
  startDate?: Date;
  endDate?: Date;
}

export function PDFButton({ invoices, startDate, endDate }: PDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const generatePDF = async () => {
    try {
      setLoading(true);
      const blob = await pdf(
        <InvoicePDF
          invoices={invoices}
          startDate={startDate}
          endDate={endDate}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `factures-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={generatePDF} disabled={loading}>
      <Printer className="mr-2 h-4 w-4" />
      {loading ? "Génération..." : "Imprimer PDF"}
    </Button>
  );
}
