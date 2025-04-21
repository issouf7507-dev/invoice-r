"use client";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b  to-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6 ">Gestionnaire de Factures</h1>
        <p className="text-xl  mb-12 max-w-2xl mx-auto">
          Gérez vos factures de manière simple et efficace. Suivez vos
          paiements, créez des factures et gardez une trace de vos transactions.
        </p>
        <Button onClick={() => (window.location.href = "/invoices")}>
          Commencer
        </Button>
      </div>
    </main>
  );
}
