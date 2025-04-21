import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import myam from "../../public/logoroyalcargopng.png";
import { Invoice } from "@/types/invoice";

interface FactureProps {
  invoice: Invoice;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
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
  invoiceTitle: {
    fontSize: 24,
    color: "#4338ca",
  },
  invoiceDate: {
    fontSize: 12,
    color: "#1f2937",
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  addressBlock: {
    fontSize: 10,
    color: "#4b5563",
  },
  addressTitle: {
    fontSize: 10,
    color: "#1f2937",
    marginBottom: 8,
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
  description: {
    width: "40%",
  },
  unitPrice: {
    width: "20%",
    textAlign: "right",
  },
  quantity: {
    width: "20%",
    textAlign: "right",
  },
  amount: {
    width: "20%",
    textAlign: "right",
  },
  summaryContainer: {
    marginLeft: "60%",
    marginTop: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    fontSize: 10,
  },
  summaryTitle: {
    color: "#4b5563",
  },
  totalContainer: {
    backgroundColor: "#4338ca",
    padding: 8,
    marginTop: 8,
  },
  totalText: {
    color: "#ffffff",
    fontSize: 12,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 20,
  },
  footerSection: {
    width: "30%",
    fontSize: 9,
    color: "#4b5563",
  },
  footerTitle: {
    color: "#4338ca",
    marginBottom: 8,
    fontSize: 10,
    fontWeight: "bold",
  },
});

// Create Document Component
const MyDocument = ({ invoice }: FactureProps) => {
  const subtotal = invoice.items.reduce((sum, item) => sum + item.amount, 0);
  const tva = subtotal * 0.2;
  const discount = subtotal * 0.05;
  const total = subtotal + tva - discount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <View>
            <Image style={styles.logo} src={myam.src} />
            <Text style={styles.addressBlock}>
              Abidajan, Côte d'Ivoire{"\n"}Tél: 0086 186 2097 5453 - 0086 188
              0207 2454{"\n"}Tél: 00225 05 64 91 92 16
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceDate}>
              {new Date(invoice.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <View>
            <Text style={styles.addressTitle}>Adresse du bureau</Text>
            <Text style={styles.addressBlock}>
              Abidjan: Grand Marche Marcory
            </Text>
          </View>
          <View>
            {/* <Text style={styles.addressTitle}>À :</Text> */}
            <Text style={styles.addressBlock}>
              Client: {invoice.clientName}
              {"\n"}
              Adresse: {invoice.clientAddress}
              {"\n"}
              Tél: {invoice.clientPhone}
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.unitPrice}>Prix unitaire</Text>
            <Text style={styles.quantity}>Qté</Text>
            <Text style={styles.amount}>Total</Text>
          </View>
          {invoice.items.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.unitPrice}>
                {item.unitPrice.toFixed(2)} {item.unit}
              </Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <Text style={styles.amount}>
                {item.amount.toFixed(2)} {item.unit}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTitle}>SOUS-TOTAL</Text>
            <Text>
              {subtotal.toFixed(2)} {invoice.items[0]?.unit}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTitle}>TVA 20%</Text>
            <Text>0</Text>
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              TOTAL : {subtotal.toFixed(2)} {invoice.items[0]?.unit}
            </Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            width: "100%",
            height: 1,
            borderWidth: 0.5,
            borderColor: "#000",
          }}
        ></View>

        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Questions?</Text>
              <Text>
                Email: contact@royalcargo.com{"\n"}Tél: +00225 05 64 91 92 16
              </Text>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Info de paiement</Text>
              <Text>IBAN: FR76 XXXX XXXX{"\n"}BIC: XXXXXXXX</Text>
            </View>
            <View style={styles.footerSection}>
              <Text style={styles.footerTitle}>Conditions</Text>
              <Text>
                Paiement dû sous 30 jours{"\n"}Merci pour votre confiance
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MyDocument;
