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
    fromDate: string;
    toDate: string;
  };
}) => {
  // Calculate counts
  const completeCount = admissionData.filter(
    (ad) => ad.status === "Complete"
  ).length;
  const incompleteCount = admissionData.filter(
    (ad) => ad.status === "Incomplete"
  ).length;
  const totalCount = admissionData.length;

  // Determine displayed text based on filters
  const admissionTypeText =
    filters.college === "All"
      ? "Admissions from All Colleges"
      : `Admissions from ${filters.college}`;

  const shouldRenderIncompletePage =
    filters.status === "All" || filters.status === "Incomplete";

  // Determine the logo to display based on the selected college
  const collegeLogo =
    filters.college === "All"
      ? "/logo.png"
      : departments.find((dept) => dept.name === filters.college)?.logo ||
        "/logo.png";

  return (
    <Document>
      {/* First Page */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image src={collegeLogo} style={styles.logo} />
          <Text style={styles.title}>Admission Summary Report</Text>
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

        <Text style={styles.text}>Admission Type: {filters.admissionType}</Text>
        <Text style={styles.text}>{admissionTypeText}</Text>

        <Text style={styles.sectionTitle}>Numerical Data</Text>
        <Text style={styles.text}>Total Admissions: {totalCount}</Text>
        <Text style={styles.text}>Complete Admissions: {completeCount}</Text>
        <Text style={styles.text}>
          Incomplete Admissions: {incompleteCount}
        </Text>
      </Page>

      {/* Second Page */}
      {shouldRenderIncompletePage && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Incomplete Admissions Report</Text>
          </View>

          <Text style={styles.sectionTitle}>
            Students with Incomplete Requirements
          </Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>Name</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>Course</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Missing Requirements
              </Text>
            </View>

            {/* Table Rows */}
            {admissionData
              .filter((admission) => admission.status === "Incomplete")
              .map((admission) => {
                const missingRequirements = admission.requirements
                  .filter((req: any) => !req.isSubmitted)
                  .map((req: any) => req.name)
                  .join(", ");

                return (
                  <View style={styles.tableRow} key={admission.id}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {admission.student.firstName}{" "}
                      {admission.student.middleName}{" "}
                      {admission.student.lastName}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                      {admission.student.course}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {missingRequirements}
                    </Text>
                  </View>
                );
              })}
          </View>
        </Page>
      )}
    </Document>
  );
};

export default AdmissionSummaryReport;
