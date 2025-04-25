import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, clientAddress, clientPhone, items } = body;

    const invoice = await prisma.invoice.create({
      data: {
        clientName,
        clientAddress,
        clientPhone,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            weight: item.weight
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating invoice" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching invoices" },
      { status: 500 }
    );
  }
}
