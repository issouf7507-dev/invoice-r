"use client";

import { Button } from "./ui/button";

interface InvoiceItem {
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceViewProps {
  invoice: {
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    items: InvoiceItem[];
  };
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  const handlePrint = () => {
    window.print();
  };

  const total = invoice.items.reduce((sum, item) => sum + item.amount, 0);

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
            <p>Date: {new Date().toLocaleDateString()}</p>
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
              {total.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>

      <div className="mt-8">
        <Button onClick={handlePrint}>Imprimer la facture</Button>
      </div>
    </div>
  );
}
