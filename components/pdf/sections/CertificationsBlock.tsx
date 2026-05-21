import { View, Text } from "@react-pdf/renderer";
import type { Section, CertificationsData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import SectionTitle from "../shared/SectionTitle";

export default function CertificationsBlock({ section }: { section: Section }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <View>
      <SectionTitle title={section.title} sidebar />
      {visibleItems.map((item) => {
        const data = item.data as CertificationsData;
        const subtitle = [data.issuer, data.date].filter(Boolean).join(", ");
        return (
          <View key={item.id} style={styles.certEntry}>
            <Text style={styles.certName}>{data.name ?? ""}</Text>
            {subtitle && <Text style={styles.certSubtitle}>{subtitle}</Text>}
          </View>
        );
      })}
    </View>
  );
}
