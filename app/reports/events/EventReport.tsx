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

// EventSummaryReport Component
const EventSummaryReport = ({
  events,
  filters,
}: {
  events: any[];
  filters: {
    status: string;
    eventType: string;
    college: string;
    fromDate: string;
    toDate: string;
  };
}) => {
  // Count events based on status (complete/incomplete)
  const completeCount = events.filter(
    (event) =>
      event.hasEvaluationReport === true &&
      event.hasPostActivityRequirements === true
  ).length;

  const incompleteCount = events.filter(
    (event) =>
      event.hasEvaluationReport === false ||
      event.hasPostActivityRequirements === false
  ).length;

  const totalCount = events.length;

  // Determine displayed text based on filters
  const eventTypeText =
    filters.college === "All"
      ? "Events from All Colleges"
      : `Events from ${
          departments.find((dept) => dept.colorId === filters.college)?.name
        }`;

  // Determine the logo to display based on the selected college
  const collegeLogo =
    filters.college === "All"
      ? "/logo.png"
      : departments.find((dept) => dept.colorId === filters.college)?.logo ||
        "/logo.png";

  // Determine if the second page with missing requirements should be shown
  const shouldRenderIncompletePage =
    filters.status === "All" || filters.status === "Incomplete";

  return (
    <Document>
      {/* First Page */}
      <Page style={styles.page}>
        <View style={styles.header}>
          <Image src={collegeLogo} style={styles.logo} />
          <Text style={styles.title}>Event Summary Report</Text>
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

        <Text style={styles.text}>Event Type: {filters.eventType}</Text>
        <Text style={styles.text}>{eventTypeText}</Text>

        <Text style={styles.sectionTitle}>Numerical Data</Text>
        <Text style={styles.text}>Total Events: {totalCount}</Text>
        <Text style={styles.text}>Complete Events: {completeCount}</Text>
        <Text style={styles.text}>Incomplete Events: {incompleteCount}</Text>
      </Page>

      {/* Second Page - Incomplete Events */}
      {shouldRenderIncompletePage && (
        <Page style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Incomplete Events Report</Text>
          </View>

          <Text style={styles.sectionTitle}>
            Events with Incomplete Requirements
          </Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 2 }]}>
                Event Organizer
              </Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>Event Summary</Text>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                Missing Requirements
              </Text>
            </View>

            {/* Table Rows for Incomplete Events */}
            {events
              .filter(
                (event) =>
                  event.status === "Incomplete" ||
                  !event.hasEvaluationReport ||
                  !event.hasPostActivityRequirements
              )
              .map((event) => {
                const missingRequirements = [
                  !event.hasEvaluationReport ? "Missing Evaluation Report" : "",
                  !event.hasPostActivityRequirements
                    ? "Missing Post Activity Requirements"
                    : "",
                ]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <View style={styles.tableRow} key={event.id}>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {
                        departments.find(
                          (dept) => dept.colorId === event.colorId
                        )?.shortname
                      }
                    </Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>
                      {event.summary}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1.5 }]}>
                      {missingRequirements || "None"}
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

export default EventSummaryReport;
