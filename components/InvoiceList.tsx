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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

interface InvoiceListProps {
  invoices: Invoice[];
  onSelectInvoiceAction: (invoice: Invoice) => void;
}

export function InvoiceList({
  invoices,
  onSelectInvoiceAction,
}: InvoiceListProps) {
  const { setTheme } = useTheme();
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Historique des Factures</h2>

        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/invoices/new")}>
            Nouvelle Facture
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Rechercher par nom, adresse ou téléphone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="rounded-md border">
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
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
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
