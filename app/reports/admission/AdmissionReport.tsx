import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create styles for the document
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 20,
  },
  table: {
    width: "100%",
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 8,
    fontSize: 10,
  },
  footer: {
    textAlign: "center",
    fontSize: 10,
    color: "#888",
    marginTop: 30,
  },
  summary: {
    textAlign: "center",
    marginBottom: 10,
    fontSize: 12,
  },
});

// AdmissionSummaryReport Component
const AdmissionSummaryReport = ({
  admissionData,
}: {
  admissionData: any[];
}) => {
  // Count the number of 'Complete' and 'Incomplete' admissions
  const statusCounts = admissionData.reduce(
    (acc, admission) => {
      if (admission.status === "Complete") {
        acc.complete += 1;
      } else if (admission.status === "Incomplete") {
        acc.incomplete += 1;
      }
      return acc;
    },
    { complete: 0, incomplete: 0 }
  );

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Admission Summary Report</Text>
          <Text>Summary of student admissions for the 2024 academic year</Text>
        </View>

        {/* Summary Section */}
        <View style={styles.summary}>
          <Text>Complete Admissions: {statusCounts.complete}</Text>
          <Text>Incomplete Admissions: {statusCounts.incomplete}</Text>
        </View>

        {/* Table Section */}
        <View style={styles.section}>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCell}>Student ID</Text>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>Course</Text>
              <Text style={styles.tableCell}>Admission Type</Text>
              <Text style={styles.tableCell}>Status</Text>
              <Text style={styles.tableCell}>Admission Date</Text>
            </View>

            {/* Table Rows */}
            {admissionData.map((admission) => (
              <View style={styles.tableRow} key={admission.id}>
                <Text style={styles.tableCell}>{admission.studentId}</Text>
                <Text style={styles.tableCell}>
                  {admission.student.firstName} {admission.student.middleName}{" "}
                  {admission.student.lastName}
                </Text>
                <Text style={styles.tableCell}>{admission.student.course}</Text>
                <Text style={styles.tableCell}>{admission.admissionType}</Text>
                <Text style={styles.tableCell}>{admission.status}</Text>
                <Text style={styles.tableCell}>
                  {new Date(admission.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>&copy; 2024 Admission Office</Text>
        </View>
      </Page>
    </Document>
  );
};

export default AdmissionSummaryReport;
