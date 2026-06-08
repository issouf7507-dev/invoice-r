"use client";

import { Button } from "@/components/ui/button";
import { FileText, ListChecks, ReceiptText, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: ReceiptText,
    title: "Créez des factures",
    description:
      "Générez des factures détaillées avec articles, quantités, poids et prix en quelques clics.",
  },
  {
    icon: Wallet,
    title: "Suivez les paiements",
    description:
      "Enregistrez les paiements reçus et gardez un œil sur les montants restants à régler.",
  },
  {
    icon: ListChecks,
    title: "Gardez une trace",
    description:
      "Recherchez, filtrez et exportez l'historique complet de vos transactions à tout moment.",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-1 flex-col">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,var(--color-accent),transparent)]"
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <FileText className="size-4 text-primary" />
            Royal Cargo · Gestion de factures
          </span>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Vos factures,{" "}
            <span className="text-primary">simples et organisées</span>
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            Créez, suivez et exportez vos factures en toute simplicité.
            Gardez le contrôle de vos paiements et de vos transactions, du
            premier devis au dernier règlement.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => router.push("/invoices")}>
              Voir mes factures
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push("/invoices/new")}
            >
              Créer une facture
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto grid max-w-5xl gap-6 px-6 py-16 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
