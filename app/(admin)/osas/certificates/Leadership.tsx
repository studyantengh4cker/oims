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
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
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
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
    fontWeight: "bold",
    textDecoration: "underline",
  },
  section: {
    marginVertical: 10,
  },
  title: {
    marginVertical: 5,
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
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
  footer: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 20,
  },
});

interface LeadershipCertificateProps {
  studentName: string;
  position: string;
  organization: string;
  schoolYear: string;
  deanName: string;
  issueDate: string;
}

export default function LeadershipCertificate({
  studentName,
  position,
  organization,
  schoolYear,
  deanName,
  issueDate,
}: LeadershipCertificateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
              <Text>St. Peter&apos;s College</Text>

              <Text>Sabayle St., Iligan City</Text>
            </View>
          </View>
          <View>
            <Text>OFFICE OF STUDENT AFFAIRS & SERVICES</Text>
            <Text>E-mail: spcosa@spc.edu.ph</Text>
            <Text>Facebook: www.facebook.com/SPCIOSA</Text>
          </View>
        </View>
        <View style={styles.header}>
          <Text>CERTIFICATION</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>{issueDate}</Text>
          <Text style={styles.text}>TO WHOM IT MAY CONCERN:</Text>
        </View>
        <View>
          <Text style={styles.text}>This is to certify that</Text>
          <Text style={styles.title}>{studentName.toUpperCase()}</Text>
          <Text style={styles.text}>has actively served as</Text>
          <Text style={styles.title}>{position.toUpperCase()}</Text>
          <Text style={styles.text}>
            in {organization} during the academic year {schoolYear}.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>
            This certification is issued upon the request of the above-named
            student for whatever legal purposes it may serve him/her best.
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.text}>{deanName}</Text>
          <Text style={styles.text}>Dean of Student Affairs and Services</Text>
        </View>
        <Text style={styles.note}>NOT VALID WITHOUT THE SCHOOL SEAL</Text>
        <Text style={styles.footer}>
          This certificate is valid within five months after its issuance date.
        </Text>
      </Page>
    </Document>
  );
}
