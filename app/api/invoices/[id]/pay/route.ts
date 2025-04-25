import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { amount } = body;

    // Récupérer la facture actuelle
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(params.id) },
      include: { payments: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Vérifier que le montant est valide
    if (amount <= 0 || amount > invoice.remainingAmount) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    // Mettre à jour la facture et créer le paiement
    const updatedInvoice = await prisma.invoice.update({
      where: { id: parseInt(params.id) },
      data: {
        paidAmount: invoice.paidAmount + amount,
        remainingAmount: invoice.remainingAmount - amount,
        isPaid: invoice.remainingAmount - amount <= 0,
        payments: {
          create: {
            amount: amount,
          },
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return NextResponse.json(updatedInvoice);
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { error: "Error processing payment" },
      { status: 500 }
    );
  }
}
