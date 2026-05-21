import { View, Text } from "@react-pdf/renderer";
import type { Section as SectionData, SkillsData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import Section from "../shared/Section";

export default function SkillsBlock({ section }: { section: SectionData }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <Section title={section.title} sidebar>
      {visibleItems.map((item) => {
        const data = item.data as SkillsData;
        return (
          <View key={item.id}>
            <Text style={styles.skillCat}>{data.category ?? ""}</Text>
            <Text style={styles.skillVal}>{(data.items ?? []).join(", ")}</Text>
          </View>
        );
      })}
    </Section>
  );
}
