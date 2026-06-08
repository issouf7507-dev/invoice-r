"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InvoiceList } from "@/components/InvoiceList";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Invoice } from "@/types/invoice";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, RotateCcw, Printer } from "lucide-react";
import * as XLSX from "xlsx";

import { PDFButton } from "@/components/pdf/PDFButton";

interface InvoiceItem {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  weight: number;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    filterInvoices();
  }, [invoices, startDate, endDate]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    if (startDate) {
      filtered = filtered.filter(
        (invoice) => new Date(invoice.createdAt) >= startDate
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (invoice) => new Date(invoice.createdAt) <= endDate
      );
    }

    // console.log(filtered);

    setFilteredInvoices(filtered);
  };

  const filterInvoicesReset = () => {
    let filtered = [...invoices];

    setFilteredInvoices(filtered);
    setIsOpen(false);
  };

  const handleSelectInvoice = (invoice: Invoice) => {
    router.push(`/invoices/${invoice.id}`);
  };

  const exportToExcel = () => {
    const data = filteredInvoices.map((invoice) => ({
      ID: invoice.id,
      Client: invoice.clientName,
      Adresse: invoice.clientAddress,
      Téléphone: invoice.clientPhone,
      "Date de création": new Date(invoice.createdAt).toLocaleDateString(),
      Total: invoice.items.reduce((sum, item) => sum + item.amount, 0),
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Factures");

    XLSX.writeFile(
      wb,
      `factures-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const hasDateFilter = Boolean(startDate || endDate);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(hasDateFilter && "border-primary text-primary")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {hasDateFilter
                ? `${startDate ? format(startDate, "PPP", { locale: fr }) : "…"} – ${
                    endDate ? format(endDate, "PPP", { locale: fr }) : "…"
                  }`
                : "Filtrer par date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-4" align="start">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date de début</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Date de fin</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "PPP", { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button
                variant="ghost"
                onClick={filterInvoicesReset}
                aria-label="Réinitialiser les dates"
              >
                <RotateCcw className="size-4" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex gap-3">
          <PDFButton
            invoices={filteredInvoices}
            startDate={startDate}
            endDate={endDate}
          />
          <Button variant="outline" onClick={exportToExcel}>
            Exporter en Excel
          </Button>
        </div>
      </div>
      <InvoiceList
        invoices={filteredInvoices}
        onSelectInvoiceAction={handleSelectInvoice}
      />
    </main>
  );
}
