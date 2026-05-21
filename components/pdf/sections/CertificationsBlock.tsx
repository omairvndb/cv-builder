import { View, Text } from "@react-pdf/renderer";
import type { Section as SectionData, CertificationsData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import Section from "../shared/Section";

export default function CertificationsBlock({ section }: { section: SectionData }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <Section title={section.title} sidebar>
      {visibleItems.map((item) => {
        const data = item.data as CertificationsData;
        const subtitle = [data.issuer, data.date].filter(Boolean).join(", ");
        return (
          <View key={item.id}>
            <Text style={styles.certName}>{data.name ?? ""}</Text>
            {subtitle && <Text style={styles.certSubtitle}>{subtitle}</Text>}
          </View>
        );
      })}
    </Section>
  );
}
