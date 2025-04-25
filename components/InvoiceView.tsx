"use client";

import { Button } from "./ui/button";
import { Invoice } from "@/types/invoice";

interface InvoiceViewProps {
  invoice: Invoice;
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Facture</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="font-semibold mb-2">Client</h2>
            <p>{invoice.clientName}</p>
            <p>{invoice.clientAddress}</p>
            <p>{invoice.clientPhone}</p>
          </div>
          <div className="text-right">
            <p>Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
            <p>Statut: {invoice.isPaid ? "Payée" : "En attente de paiement"}</p>
          </div>
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-left">Unité</th>
            <th className="border p-2 text-right">Quantité</th>
            <th className="border p-2 text-right">Prix unitaire</th>
            <th className="border p-2 text-right">Montant</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2">{item.unit}</td>
              <td className="border p-2 text-right">{item.quantity}</td>
              <td className="border p-2 text-right">
                {item.unitPrice.toFixed(2)}
              </td>
              <td className="border p-2 text-right">
                {item.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className="border p-2 text-right font-bold">
              Total
            </td>
            <td className="border p-2 text-right font-bold">
              {invoice.totalAmount.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border p-2 text-right font-bold">
              Montant payé
            </td>
            <td className="border p-2 text-right font-bold">
              {invoice.paidAmount.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td colSpan={4} className="border p-2 text-right font-bold">
              Reste à payer
            </td>
            <td className="border p-2 text-right font-bold">
              {invoice.remainingAmount.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      {invoice.payments.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Historique des paiements
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-right">Montant</th>
              </tr>
            </thead>
            <tbody>
              {invoice.payments.map((payment, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2 text-right">
                    {payment.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8">
        <Button onClick={handlePrint}>Imprimer la facture</Button>
      </div>
    </div>
  );
}
