import { View, Text } from "@react-pdf/renderer";
import type { Section, LanguagesData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import SectionTitle from "../shared/SectionTitle";

export default function LanguagesBlock({ section }: { section: Section }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <View>
      <SectionTitle title={section.title} sidebar />
      {visibleItems.map((item) => {
        const data = item.data as LanguagesData;
        return (
          <View key={item.id} style={styles.langRow}>
            <Text style={styles.langName}>{data.language ?? ""}</Text>
            <Text style={styles.langProf}>{data.proficiency ?? ""}</Text>
          </View>
        );
      })}
    </View>
  );
}
