import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      clientAddress,
      clientPhone,
      items,
      totalAmount,
      paidAmount,
      remainingAmount,
      isPaid,
    } = body;

    console.log("Creating invoice with data:", {
      clientName,
      clientAddress,
      clientPhone,
      totalAmount,
      paidAmount,
      remainingAmount,
      isPaid,
      itemsCount: items.length,
    });

    const invoice = await prisma.invoice.create({
      data: {
        clientName,
        clientAddress,
        clientPhone,
        totalAmount,
        paidAmount,
        remainingAmount,
        isPaid,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.amount,
            weight: item.weight,
          })),
        },
        ...(paidAmount > 0 && {
          payments: {
            create: [
              {
                amount: paidAmount,
              },
            ],
          },
        }),
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      {
        error: "Error creating invoice",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        items: true,
        payments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      {
        error: "Error fetching invoices",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
