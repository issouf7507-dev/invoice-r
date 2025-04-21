"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface InvoiceItem {
  id: number;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface Invoice {
  id: number;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  items: InvoiceItem[];
  createdAt: string;
}

interface InvoicePDFProps {
  invoices: Invoice[];
  startDate?: Date;
  endDate?: Date;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 60,
    marginBottom: 10,
  },
  businessName: {
    fontSize: 20,
    color: "#4338ca",
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    color: "#4338ca",
    textAlign: "center",
    marginBottom: 20,
  },
  dateRange: {
    fontSize: 12,
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  table: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4338ca",
    padding: 8,
    color: "#ffffff",
    fontSize: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    padding: 8,
    fontSize: 10,
  },
  id: {
    width: "10%",
    textAlign: "center",
  },
  client: {
    width: "25%",
  },
  address: {
    width: "25%",
  },
  date: {
    width: "20%",
    textAlign: "center",
  },
  total: {
    width: "20%",
    textAlign: "right",
  },
  summaryContainer: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    fontSize: 12,
  },
  totalRow: {
    backgroundColor: "#4338ca",
    padding: 8,
    marginTop: 8,
  },
  totalText: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    color: "#4b5563",
    textAlign: "center",
  },
});

export function InvoicePDF({ invoices, startDate, endDate }: InvoicePDFProps) {
  const totalAmount = invoices.reduce(
    (sum, invoice) =>
      sum + invoice.items.reduce((itemSum, item) => itemSum + item.amount, 0),
    0
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View>
            <Image style={styles.logo} src="/logoroyalcargopng.png" />
            <Text style={styles.businessName}>ROYAL CARGO</Text>
          </View>
        </View>

        <Text style={styles.title}>Liste des Factures</Text>
        {startDate && endDate && (
          <Text style={styles.dateRange}>
            Période du {startDate.toLocaleDateString()} au{" "}
            {endDate.toLocaleDateString()}
          </Text>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.id}>ID</Text>
            <Text style={styles.client}>Client</Text>
            <Text style={styles.address}>Adresse</Text>
            <Text style={styles.date}>Date</Text>
            <Text style={styles.total}>Total</Text>
          </View>
          {invoices.map((invoice) => (
            <View key={invoice.id} style={styles.tableRow}>
              <Text style={styles.id}>{invoice.id}</Text>
              <Text style={styles.client}>{invoice.clientName}</Text>
              <Text style={styles.address}>{invoice.clientAddress}</Text>
              <Text style={styles.date}>
                {new Date(invoice.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.total}>
                {invoice.items
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toFixed(2)}{" "}
                €
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>
              TOTAL GÉNÉRAL : {totalAmount.toFixed(2)} €
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          ROYAL CARGO - Abidjan, Côte d'Ivoire | Tél: 00225 05 64 91 92 16 |
          Email: contact@royalcargo.com
        </Text>
      </Page>
    </Document>
  );
}
