"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { Invoice } from "@/types/invoice";
import { getRandomIntUniquePerDay } from "@/utils/usedNumbersPerDay";
import { Trash } from "lucide-react";

interface InvoiceFormProps {
  onSubmitAction: (invoice: Invoice) => void;
}

export function InvoiceForm({ onSubmitAction }: InvoiceFormProps) {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [items, setItems] = useState<Invoice["items"]>([
    {
      id: getRandomIntUniquePerDay(1, 100),
      description: "",
      unit: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: getRandomIntUniquePerDay(1, 100),
        description: "",
        unit: "",
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (id: number) => {
    const a = items.filter((items) => {
      return items.id != id;
    });
    setItems(a);
  };

  const updateItem = (
    index: number,
    field: keyof Invoice["items"][0],
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    if (field === "quantity" || field === "unitPrice") {
      newItems[index].amount =
        Number(newItems[index].quantity) * Number(newItems[index].unitPrice);
    }

    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          clientAddress,
          clientPhone,
          items,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create invoice");
      }

      const invoice = await response.json();
      onSubmitAction(invoice);
      router.refresh();
      router.push("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("Error creating invoice. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4 grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="clientName" className="mb-1">
            Nom du client
          </Label>
          <Input
            id="clientName"
            value={clientName}
            placeholder="Nom du client"
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientAddress" className="mb-1">
            Adresse
          </Label>
          <Input
            id="clientAddress"
            value={clientAddress}
            placeholder="Adresse"
            onChange={(e) => setClientAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="clientPhone" className="mb-1">
            Téléphone
          </Label>
          <Input
            id="clientPhone"
            value={clientPhone}
            placeholder="Téléphone"
            onChange={(e) => setClientPhone(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Line de la factures</h3>

        <div className="border p-3 rounded-lg">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-6 gap-4 items-center">
              <div>
                <Label className="mb-1">Description</Label>
                <Input
                  value={item.description}
                  placeholder="Description"
                  onChange={(e) =>
                    updateItem(index, "description", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label className="mb-1">Unité</Label>
                <select
                  value={item.unit}
                  onChange={(e) => updateItem(index, "unit", e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Sélectionner une unité</option>
                  <option value="XOF">XOF (FCFA)</option>
                  <option value="€">€ (Euro)</option>
                  <option value="$">$ (Dollar)</option>
                  <option value="¥">¥ (Yen)</option>
                </select>
              </div>
              <div>
                <Label className="mb-1">Quantité</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", Number(e.target.value))
                  }
                  required
                />
              </div>
              <div>
                <Label className="mb-1">Prix unitaire</Label>
                <Input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    updateItem(index, "unitPrice", Number(e.target.value))
                  }
                  required
                />
              </div>
              <div>
                <Label className="mb-1">Montant</Label>
                <Input type="number" value={item.amount} readOnly />
              </div>

              {items.length > 1 && (
                <Button type="button" onClick={() => removeItem(item.id)}>
                  <Trash />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <Button type="button" onClick={addItem}>
            Ajouter un article
          </Button>

          <Button type="submit">Créer la facture</Button>
        </div>
      </div>
    </form>
  );
}
