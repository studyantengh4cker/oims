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
  countHeader: {
    fontSize: 12,
    marginBottom: 10,
  },
  incompleteTable: {
    marginTop: 20,
    width: "100%",
    marginBottom: 10,
    display: "flex",
    flexDirection: "column",
  },
  incompleteTableRow: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
  },
});

// EventSummaryReport Component
const EventSummaryReport = ({ events }: { events: any[] }) => {
  // Count events that don't have an evaluation report or post-activity requirements
  const incompleteEventsCount = events.filter(
    (event) => !event.hasEvaluationReport || !event.hasPostActivityRequirements
  ).length;

  // Filter events with incomplete requirements
  const incompleteEvents = events.filter(
    (event) => !event.hasEvaluationReport || !event.hasPostActivityRequirements
  );

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>School Event Summary Report</Text>
          <Text>Summary of events and borrowed equipment</Text>

          {/* Count of Incomplete Events */}
          <Text style={styles.countHeader}>
            Number of events with incomplete requirements (missing Evaluation or
            Post-Activity Requirements): {incompleteEventsCount}
          </Text>
        </View>

        {/* Event Details Table Section */}
        <View style={styles.section}>
          {events.map((event) => (
            <View key={event.id} style={styles.table}>
              {/* Event Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Event Type
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Event Summary
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Location
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Start Time
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  End Time
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{event.eventType}</Text>
                <Text style={styles.tableCell}>{event.summary}</Text>
                <Text style={styles.tableCell}>{event.location || "N/A"}</Text>
                <Text style={styles.tableCell}>
                  {new Date(event.start).toLocaleString()}
                </Text>
                <Text style={styles.tableCell}>
                  {new Date(event.end).toLocaleString()}
                </Text>
              </View>

              {/* Borrowed Equipment Header */}
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Equipment Name
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Brand
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Quantity Requested
                </Text>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Status
                </Text>
              </View>

              {/* Borrowed Equipment Rows */}
              {event.EquipmentRequest.map((request: { equipments: any[] }) =>
                request.equipments.map((reqEquip) => (
                  <View style={styles.tableRow} key={reqEquip.id}>
                    <Text style={styles.tableCell}>
                      {reqEquip.equipment.name}
                    </Text>
                    <Text style={styles.tableCell}>
                      {reqEquip.equipment.brand}
                    </Text>
                    <Text style={styles.tableCell}>{reqEquip.quantity}</Text>
                    <Text style={styles.tableCell}>{reqEquip.status}</Text>
                  </View>
                ))
              )}
            </View>
          ))}
        </View>

        {incompleteEvents.length > 0 && (
          <View style={styles.incompleteTable}>
            <Text style={[styles.tableHeader, { textAlign: "center" }]}>
              Events with Incomplete Requirements
            </Text>
            {incompleteEvents.map(
              (event) =>
                // Only display events that are missing requirements
                (!event.hasEvaluationReport ||
                  !event.hasPostActivityRequirements) && (
                  <View style={styles.incompleteTableRow} key={event.id}>
                    <Text style={styles.tableCell}>{event.summary}</Text>
                    <Text style={styles.tableCell}>
                      {!event.hasEvaluationReport
                        ? "Missing Evaluation Report"
                        : ""}
                      {!event.hasPostActivityRequirements
                        ? "Missing Post Activity Requirements"
                        : ""}
                    </Text>
                  </View>
                )
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>&copy; 2024 School Event Management</Text>
        </View>
      </Page>
    </Document>
  );
};

export default EventSummaryReport;
