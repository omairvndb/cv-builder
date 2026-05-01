import { View, Text, Link } from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas";
import { styles } from "../styles";
import { stripProtocol } from "@/lib/utils";
import SectionTitle from "../shared/SectionTitle";

export default function PersonalInfoBlock({ cv }: { cv: CV }) {
  return (
    <View>
      <SectionTitle title="Persoonlijke Info" sidebar first />
      <Text style={styles.sbText}>{cv.email}</Text>
      {cv.phone && <Text style={styles.sbText}>{cv.phone}</Text>}
      {cv.location && <Text style={styles.sbText}>{cv.location}</Text>}
      {cv.linkedin && (
        <Link src={cv.linkedin} style={styles.sbLink}>
          {stripProtocol(cv.linkedin)}
        </Link>
      )}
      {cv.github && (
        <Link src={cv.github} style={styles.sbLink}>
          {stripProtocol(cv.github)}
        </Link>
      )}
      {cv.website && (
        <Link src={cv.website} style={styles.sbLink}>
          {stripProtocol(cv.website)}
        </Link>
      )}
      {cv.driverLicense && <Text style={styles.sbText}>Rijbewijs: {cv.driverLicense}</Text>}
      {cv.dateOfBirth && <Text style={styles.sbText}>{cv.dateOfBirth}</Text>}
    </View>
  );
}
