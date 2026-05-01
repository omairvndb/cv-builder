import { View, Text, Link } from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas";
import { styles } from "../styles";
import { stripProtocol } from "@/lib/utils";
import SectionTitle from "../shared/SectionTitle";
import { PdfIcon } from "../shared/PdfIcon";
import { PDF_ICONS } from "../../../lib/pdfIcons";

export default function PersonalInfoBlock({ cv }: { cv: CV }) {
  return (
    <View>
      <SectionTitle title="Persoonlijke Info" sidebar first />

      <View style={styles.sbRow}>
        <PdfIcon d={PDF_ICONS.envelope} />
        <Text style={styles.sbText}>{cv.email}</Text>
      </View>

      {cv.phone && (
        <View style={styles.sbRow}>
          <PdfIcon d={PDF_ICONS.phone} />
          <Text style={styles.sbText}>{cv.phone}</Text>
        </View>
      )}

      {cv.location && (
        <View style={styles.sbRow}>
          <PdfIcon d={PDF_ICONS.mapPin} />
          <Text style={styles.sbText}>{cv.location}</Text>
        </View>
      )}

      {cv.linkedin && (
        <View style={styles.sbRow}>
          <PdfIcon d={PDF_ICONS.linkedin} />
          <Link src={cv.linkedin} style={styles.sbLink}>
            {stripProtocol(cv.linkedin)}
          </Link>
        </View>
      )}

      {cv.github && (
        <View style={styles.sbRow}>
          <PdfIcon d={PDF_ICONS.github} />
          <Link src={cv.github} style={styles.sbLink}>
            {stripProtocol(cv.github)}
          </Link>
        </View>
      )}

      {cv.website && (
        <View style={styles.sbRow}>
          <PdfIcon d={PDF_ICONS.globe} />
          <Link src={cv.website} style={styles.sbLink}>
            {stripProtocol(cv.website)}
          </Link>
        </View>
      )}

      {cv.driverLicense && (
        <View style={styles.sbRow}>
          <PdfIcon d={PDF_ICONS.car} />
          <Text style={styles.sbText}>Rijbewijs: {cv.driverLicense}</Text>
        </View>
      )}

      {cv.dateOfBirth && (
        <View style={styles.sbRow}>
          <PdfIcon d={PDF_ICONS.calendar} />
          <Text style={styles.sbText}>{cv.dateOfBirth}</Text>
        </View>
      )}
    </View>
  );
}
