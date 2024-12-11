import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { departments } from "@/lib/globals";

// Define professional styles for the report
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#333",
  },
  header: {
    textAlign: "center",
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bdc3c7",
    paddingBottom: 5,
    color: "#2c3e50",
  },
  text: {
    marginBottom: 10,
    fontSize: 10,
    color: "#34495e",
  },
  table: {
    marginTop: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#bdc3c7",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#800000",
    color: "#ecf0f1",
    padding: 10,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    color: "#7f8c8d",
  },
});

// EquipmentReport Component
export const EquipmentReport = ({
  borrowHistory,
  equipments,
  filters,
}: {
  borrowHistory: any[];
  equipments: any[];
  filters: {
    status: string;
    college: string;
    fromDate: string;
    toDate: string;
  };
}) => {
  // Determine the logo to display based on filters (if any)
  const collegeLogo =
    filters.college === "All"
      ? "/logo.png"
      : departments.find((dept) => dept.colorId === filters.college)?.logo ||
        "/logo.png";

  return (
    <Document>
      {/* First Page */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image src={collegeLogo} style={styles.logo} />
          <Text style={styles.title}>Equipment Borrow History Report</Text>
          <Text style={styles.subtitle}>
            {filters.fromDate && filters.toDate ? (
              <>
                from {filters.fromDate} to {filters.toDate}
              </>
            ) : (
              <>from {new Date().getFullYear()}</>
            )}
          </Text>
        </View>

        {/* Filter display */}
        <Text style={styles.text}>Status: {filters.status}</Text>
        <Text style={styles.text}>
          Date Range: {filters.fromDate} to {filters.toDate}
        </Text>

        <Text style={styles.sectionTitle}>Borrow History</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Equipment</Text>
            <Text style={[styles.tableCell, { flex: 1.5 }]}>Requestor</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Quantity</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Status</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Event</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Date Requested</Text>
          </View>

          {/* Table Rows for Borrow History */}
          {borrowHistory.map((entry) => (
            <View style={styles.tableRow} key={entry.id}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {entry.equipment.name}
              </Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                {entry.request.requestor}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {entry.quantity}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {entry.status}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {entry.request.event.summary}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {new Date(entry.request.dateRequested).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </Page>

      {/* Second Page for Remaining Equipment */}
      <Page style={styles.page}>
        <Text style={styles.title}>Remaining Equipment List</Text>
        <View style={styles.table}>
          {/* Table Header for Equipments */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, { flex: 2 }]}>Equipment</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Brand</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Price</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Quantity</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Date Bought</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Date Added</Text>
          </View>

          {/* Table Rows for Equipment */}
          {equipments.map((equipment) => (
            <View style={styles.tableRow} key={equipment.id}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {equipment.name}
              </Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {equipment.brand}
              </Text>
              <Text
                style={[styles.tableCell, { flex: 1 }]}
              >{`PHP${equipment.price.toLocaleString()}`}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>
                {equipment.quantity}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {new Date(equipment.dateBought).toLocaleDateString()}
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                {new Date(equipment.dateAdded).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
