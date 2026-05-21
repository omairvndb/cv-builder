import { View, Text } from "@react-pdf/renderer";
import type { Section as SectionData, LanguagesData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import Section from "../shared/Section";

export default function LanguagesBlock({ section }: { section: SectionData }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <Section title={section.title} sidebar dense>
      {visibleItems.map((item) => {
        const data = item.data as LanguagesData;
        return (
          <View key={item.id} style={styles.langRow}>
            <Text style={styles.langName}>{data.language ?? ""}</Text>
            <Text style={styles.langProf}>{data.proficiency ?? ""}</Text>
          </View>
        );
      })}
    </Section>
  );
}
