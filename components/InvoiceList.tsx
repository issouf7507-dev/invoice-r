"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/invoice";
import { Search } from "lucide-react";

interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoiceAction: (invoice: Invoice) => void;
}

export function InvoiceList({
  invoices,
  onSelectInvoiceAction,
}: InvoiceListProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  console.log(invoices);

  const filteredInvoices = invoices
    .filter(
      (invoice) =>
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientAddress
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.clientPhone.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.clientName.localeCompare(b.clientName)
          : b.clientName.localeCompare(a.clientName);
      } else {
        const totalA = a.items.reduce((sum, item) => sum + item.amount, 0);
        const totalB = b.items.reduce((sum, item) => sum + item.amount, 0);
        return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
      }
    });

  const toggleSort = (field: "date" | "name" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatNumber = (num: number) => {
    return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Historique des factures</h2>
          <p className="text-sm text-muted-foreground">
            {filteredInvoices.length} facture
            {filteredInvoices.length > 1 ? "s" : ""} au total
          </p>
        </div>

        <Button onClick={() => router.push("/invoices/new")}>
          Nouvelle facture
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, adresse ou téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("date")}
              >
                Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("name")}
              >
                Client {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Poids</TableHead>
              <TableHead
                className="text-right cursor-pointer"
                onClick={() => toggleSort("amount")}
              >
                Total {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-right">Payé</TableHead>
              <TableHead className="text-right">Reste</TableHead>
              <TableHead className="text-right">Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-12 text-center text-muted-foreground"
                >
                  Aucune facture ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="font-medium">
                  {invoice.clientName}
                </TableCell>
                <TableCell>{invoice.clientPhone}</TableCell>
                <TableCell>
                  {invoice.items
                    .reduce((sum, item) => sum + item.weight, 0)
                    .toFixed(2)}{" "}
                  kg
                </TableCell>
                <TableCell className="text-right">
                  {/* {invoice.totalAmount.toFixed(2)} */}
                  {formatNumber(invoice.totalAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {/* {invoice.paidAmount.toFixed(2)} */}
                  {formatNumber(invoice.paidAmount)}
                </TableCell>
                <TableCell className="text-right">
                  {/* {invoice.remainingAmount.toFixed(2)} */}
                  {formatNumber(invoice.remainingAmount)}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      invoice.isPaid
                        ? "bg-success/15 text-success"
                        : "bg-warning/20 text-warning-foreground dark:bg-warning/15 dark:text-warning"
                    }`}
                  >
                    {invoice.isPaid ? "Soldée" : "En attente"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectInvoiceAction(invoice)}
                    >
                      Voir
                    </Button>
                    {!invoice.isPaid && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          router.push(`/invoices/${invoice.id}/pay`)
                        }
                      >
                        Payer
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
