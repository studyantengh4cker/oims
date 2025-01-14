import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    lineHeight: 1.5,
  },
  top: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "2px",
    borderBottomColor: "red",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    fontSize: 12,
  },
  title: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center", // Added text alignment
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
  cocDean,
  selectedPurpose,
  controlNumber,
}: {
  studentName: string;
  osasDean: string;
  cocDean: string | null;
  selectedPurpose: string;
  controlNumber: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with Logo and Text */}
        <View style={styles.top}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image style={styles.logo} src="/logo.png" />
            <View>
              <Text style={styles.headerText}>St. Peter&apos;s College</Text>
              <Text style={styles.headerText}>Sabayle St., Iligan City</Text>
            </View>
          </View>
          <View>
            <Text>OFFICE OF STUDENT AFFAIRS & SERVICES</Text>
            <Text>E-mail: spcosa@spc.edu.ph</Text>
            <Text>Facebook: www.facebook.com/SPCIOSA</Text>
          </View>
        </View>

        {/* Content of the Certificate */}
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
        {cocDean && (
          <View style={styles.text}>
            <Text>{cocDean.toUpperCase()}</Text>
            <Text>Dean, College of Criminology</Text>
          </View>
        )}
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
