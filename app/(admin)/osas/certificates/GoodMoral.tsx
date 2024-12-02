import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
  text: {
    textAlign: "center",
    marginVertical: 5,
  },
  note: {
    fontSize: 10,
    textAlign: "center",
    marginVertical: 15,
  },
  controlNumber: {
    fontSize: 10,
    marginTop: 20,
    textAlign: "center",
  },
  footer: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
  },
});

export default function GoodMoral({
  studentName,
  osasDean,
  selectedPurpose,
  controlNumber,
}: {
  studentName: string;
  osasDean: string;
  selectedPurpose: string;
  controlNumber: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>NOVEMBER 29, 2023</Text>
          <Text>TO WHOM IT MAY CONCERN:</Text>
        </View>
        <View>
          <Text style={styles.text}>
            This is to certify that based on the school record filed in this
            office
          </Text>
          <Text style={styles.title}>{studentName.toUpperCase()}</Text>
          <Text style={styles.text}>
            has not violated any of our school rules and regulations and is of
            good moral character.
          </Text>
        </View>
        <View style={styles.text}>
          <Text>
            This certification is issued upon the request of the above-named
            student for the purpose of:
          </Text>
          <Text style={styles.title}>{selectedPurpose}</Text>
        </View>
        <View style={styles.text}>
          <Text>{osasDean.toUpperCase()}</Text>
          <Text>Dean of Student Affairs and Services</Text>
        </View>
        <Text style={styles.note}>NOT VALID WITHOUT THE SCHOOL SEAL</Text>
        <Text style={styles.controlNumber}>
          Control Number: DSA FORM M-{controlNumber}
        </Text>
        <Text style={styles.footer}>
          This certificate is valid within five months after its issuance date.
        </Text>
      </Page>
    </Document>
  );
}
