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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Détails de la facture</h1>
          <p className="text-sm text-muted-foreground">
            Facture #{invoice.id} ·{" "}
            {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PDFDownloadLink
            document={<MyDocument invoice={invoice} />}
            fileName={`facture-${invoice.id}.pdf`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {({ loading }) =>
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

      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
          invoice.isPaid
            ? "bg-success/15 text-success"
            : "bg-warning/20 text-warning-foreground dark:bg-warning/15 dark:text-warning"
        }`}
      >
        {invoice.isPaid ? "Soldée" : "En attente de paiement"}
      </span>

      <div className="rounded-xl border bg-card p-8 text-card-foreground shadow-sm print:shadow-none">
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Informations du client
            </h2>
            <p className="font-medium">{invoice.clientName}</p>
            <p className="text-muted-foreground">{invoice.clientAddress}</p>
            <p className="text-muted-foreground">{invoice.clientPhone}</p>
          </div>
          <div className="sm:text-right">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Détails de la facture
            </h2>
            <p className="text-muted-foreground">Numéro: #{invoice.id}</p>
            <p className="text-muted-foreground">
              Date: {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead className="text-right">Quantité</TableHead>
              <TableHead className="text-right">Poids</TableHead>
              <TableHead className="text-right">Prix unitaire</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.weight}</TableCell>
                <TableCell className="text-right">
                  {formatNumber(item.unitPrice)}
                </TableCell>
                <TableCell className="text-right">
                  {formatNumber(item.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-right font-semibold">
                Total
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatNumber(invoice.totalAmount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} className="text-right font-semibold">
                Montant payé
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatNumber(invoice.paidAmount)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={5} className="text-right font-semibold">
                Reste à payer
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatNumber(invoice.remainingAmount)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {invoice.payments && invoice.payments.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
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

        <div className="mt-8 text-center text-sm text-muted-foreground print:hidden">
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
