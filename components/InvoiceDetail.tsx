"use client";

import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Invoice } from "@/types/invoice";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "./pdf/facture";

interface InvoiceDetailProps {
  invoice: Invoice;
}

export function InvoiceDetail({ invoice }: InvoiceDetailProps) {
  const router = useRouter();
  const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);

  const formatNumber = (num: number) => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
      try {
        const response = await fetch(`/api/invoices/${invoice.id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete invoice");
        }

        router.push("/invoices");
        router.refresh();
      } catch (error) {
        console.error("Error deleting invoice:", error);
        alert("Erreur lors de la suppression de la facture");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Détails de la Facture</h1>
        <div className="flex gap-2">
          <PDFDownloadLink
            document={<MyDocument invoice={invoice} />}
            fileName={`facture-${invoice.id}.pdf`}
            className="bg-transparent border  text-base font-bold py-1 px-4 rounded"
          >
            {({ blob, url, loading, error }) =>
              loading ? "Génération du PDF..." : "Télécharger la facture"
            }
          </PDFDownloadLink>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
          <Button variant="outline" onClick={() => router.push("/invoices")}>
            Retour
          </Button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm print:shadow-none dark:text-gray-400">
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2 ">
              Informations du Client
            </h2>
            <p className="font-medium">{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
            <p>{invoice.clientPhone}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold mb-2">
              Détails de la Facture
            </h2>
            <p>Numéro: #{invoice.id}</p>
            <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p>
              Statut: {invoice.isPaid ? "Soldée" : "En attente de paiement"}
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-gray-400">Description</TableHead>
              <TableHead className="dark:text-gray-400">Unité</TableHead>
              <TableHead className="text-right dark:text-gray-400">
                Quantité
              </TableHead>
              <TableHead className="text-right dark:text-gray-400">
                Poids
              </TableHead>
              <TableHead className="text-right dark:text-gray-400">
                Prix unitaire
              </TableHead>
              <TableHead className="text-right dark:text-gray-400">
                Montant
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item) => (
              <TableRow key={item.id} className="hover:text-black">
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.weight}</TableCell>
                <TableCell className="text-right">
                  {/* {item.unitPrice.toFixed(2)} */}
                  {formatNumber(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right">
                  {/* {item.amount.toFixed(2)} */}
                  {formatNumber(item.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-right font-bold text-black"
              >
                Total
              </TableCell>
              <TableCell className="text-right font-bold text-black">
                {/* {invoice.totalAmount.toFixed(2)} */}
                {formatNumber(invoice.totalAmount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-right font-bold text-black"
              >
                Montant payé
              </TableCell>
              <TableCell className="text-right font-bold text-black">
                {/* {invoice.paidAmount.toFixed(2)} */}
                {formatNumber(invoice.paidAmount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-right font-bold text-black"
              >
                Reste à payer
              </TableCell>
              <TableCell className="text-right font-bold text-black">
                {/* {invoice.remainingAmount.toFixed(2)} */}
                {formatNumber(invoice.remainingAmount)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {invoice.payments && invoice.payments.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">
              Historique des paiements
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-500 print:hidden">
          <p>
            Cette facture a été générée le {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none;
          }
          .print\\:shadow-none {
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
