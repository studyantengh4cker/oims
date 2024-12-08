import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Create professional styles for the document
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
  filterSummary: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ecf0f1",
    borderRadius: 5,
    textAlign: "left",
    fontSize: 10,
    fontStyle: "italic",
    color: "#34495e",
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
    marginTop: 40,
    textAlign: "center",
    fontSize: 10,
    color: "#7f8c8d",
  },
});

// AdmissionSummaryReport Component
const AdmissionSummaryReport = ({
  admissionData,
  filters,
}: {
  admissionData: any[];
  filters: {
    status: string;
    admissionType: string;
    college: string;
    program: string;
  };
}) => {
  // Format filter settings
  const formattedFilters = {
    status: filters.status === "All" ? "all statuses" : filters.status,
    admissionType:
      filters.admissionType === "All"
        ? "all admission types"
        : filters.admissionType,
    college: filters.college === "All" ? "all colleges" : filters.college,
    program: filters.program === "All" ? "all programs" : filters.program,
  };

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Admission Summary Report</Text>
          <Text style={styles.subtitle}>Academic Year 2024</Text>
        </View>

        {/* Filter Summary */}
        <View style={styles.filterSummary}>
          <Text>
            This report includes admissions {formattedFilters.status},
            {formattedFilters.admissionType}, {formattedFilters.college}, and{" "}
            {formattedFilters.program}.
          </Text>
        </View>

        {/* Table Section */}
        <View>
          <Text style={styles.sectionTitle}>Detailed Admissions</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 1 }]}>Student ID</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Course</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Type</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Status</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Date</Text>
            </View>

            {/* Table Rows */}
            {admissionData.map((admission) => (
              <View style={styles.tableRow} key={admission.id}>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {admission.studentId}
                </Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>
                  {admission.student.firstName} {admission.student.middleName}{" "}
                  {admission.student.lastName}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {admission.student.course}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {admission.admissionType}
                </Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>
                  {admission.status}
                </Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>
                  {new Date(admission.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>&copy; 2024 Admission Office. All rights reserved.</Text>
        </View>
      </Page>
    </Document>
  );
};

export default AdmissionSummaryReport;
