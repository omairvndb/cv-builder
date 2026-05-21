import { View, Text } from "@react-pdf/renderer";
import type { Section, SkillsData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import SectionTitle from "../shared/SectionTitle";

export default function SkillsBlock({ section }: { section: Section }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <View>
      <SectionTitle title={section.title} sidebar />
      <View style={styles.sectionWrapper}>
        {visibleItems.map((item) => {
          const data = item.data as SkillsData;
          return (
            <View key={item.id}>
              <Text style={styles.skillCat}>{data.category ?? ""}</Text>
              <Text style={styles.skillVal}>{(data.items ?? []).join(", ")}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
