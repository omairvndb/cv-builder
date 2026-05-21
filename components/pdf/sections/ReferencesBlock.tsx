import { View, Text } from "@react-pdf/renderer";
import type { Section, ReferencesData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { PDF_ICONS } from "@/lib/pdf-icons";
import { MUTED, styles } from "../styles";
import { PdfIcon } from "../shared/PdfIcon";
import SectionTitle from "../shared/SectionTitle";

export default function ReferencesBlock({ section }: { section: Section }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <View>
      <SectionTitle title={section.title} sidebar />
      {visibleItems.map((item) => {
        const data = item.data as ReferencesData;
        const subtitle = [data.role, data.company].filter(Boolean).join(", ");
        return (
          <View key={item.id} style={styles.refEntry}>
            {data.name && <Text style={styles.refName}>{data.name}</Text>}
            {subtitle && <Text style={styles.refSubtitle}>{subtitle}</Text>}
            {data.email && (
              <View style={styles.refContactRow}>
                <PdfIcon d={PDF_ICONS.envelope} size={7} color={MUTED} />
                <Text style={styles.refContact}>{data.email}</Text>
              </View>
            )}
            {data.phone && (
              <View style={styles.refContactRow}>
                <PdfIcon d={PDF_ICONS.phone} size={7} color={MUTED} />
                <Text style={styles.refContact}>{data.phone}</Text>
              </View>
            )}
            {data.quote && <Text style={styles.refQuote}>&ldquo;{data.quote}&rdquo;</Text>}
          </View>
        );
      })}
    </View>
  );
}
