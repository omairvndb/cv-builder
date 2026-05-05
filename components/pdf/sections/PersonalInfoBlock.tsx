import { View, Text, Link } from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas";
import { styles } from "../styles";
import { stripProtocol } from "@/lib/utils";
import SectionTitle from "../shared/SectionTitle";
import { PdfIcon } from "../shared/PdfIcon";
import { PDF_ICONS } from "@/lib/pdf-icons";

type InfoRow = {
  icon: string;
  label: string;
  href?: string;
};

function buildRows(cv: CV): InfoRow[] {
  return [
    { icon: PDF_ICONS.envelope, label: cv.email },
    cv.phone && { icon: PDF_ICONS.phone, label: cv.phone },
    cv.location && { icon: PDF_ICONS.mapPin, label: cv.location },
    cv.linkedin && {
      icon: PDF_ICONS.linkedin,
      label: stripProtocol(cv.linkedin),
      href: cv.linkedin,
    },
    cv.github && { icon: PDF_ICONS.github, label: stripProtocol(cv.github), href: cv.github },
    cv.website && { icon: PDF_ICONS.globe, label: stripProtocol(cv.website), href: cv.website },
    cv.driverLicense && { icon: PDF_ICONS.car, label: `Rijbewijs: ${cv.driverLicense}` },
    cv.dateOfBirth && { icon: PDF_ICONS.calendar, label: cv.dateOfBirth },
  ].filter(Boolean) as InfoRow[];
}

export default function PersonalInfoBlock({ cv }: { cv: CV }) {
  return (
    <View>
      <SectionTitle title="Persoonlijke Info" sidebar first />
      {buildRows(cv).map((row, i) => (
        <View key={i} style={styles.infoRow}>
          <PdfIcon d={row.icon} />
          {row.href ? (
            <Link src={row.href} style={styles.infoText}>
              {row.label}
            </Link>
          ) : (
            <Text style={styles.infoText}>{row.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
