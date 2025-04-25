import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  try {
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        items: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Supprimer d'abord les items associés
    await prisma.invoiceItem.deleteMany({
      where: {
        invoiceId: parseInt(params.id),
      },
    });

    // Puis supprimer la facture
    await prisma.invoice.delete({
      where: {
        id: parseInt(params.id),
      },
    });

    return NextResponse.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting invoice" },
      { status: 500 }
    );
  }
}
