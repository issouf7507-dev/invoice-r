import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./pdf/facture";
import { Invoice } from "@/types/invoice";

interface PrintButtonProps {
  invoice: Invoice;
}

const PrintButton = ({ invoice }: PrintButtonProps) => {
  return (
    <PDFDownloadLink
      document={<MyDocument invoice={invoice} />}
      fileName={`facture-${invoice.id}.pdf`}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {({ blob, url, loading, error }) =>
        loading ? "Génération du PDF..." : "Télécharger la facture"
      }
    </PDFDownloadLink>
  );
};

export default PrintButton;
