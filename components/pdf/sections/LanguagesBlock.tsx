import { View, Text } from "@react-pdf/renderer";
import type { Section, LanguagesData } from "@/lib/schemas";
import { styles } from "../styles";
import SectionTitle from "../shared/SectionTitle";

export default function LanguagesBlock({ section }: { section: Section }) {
  return (
    <View>
      <SectionTitle title={section.title} sidebar />
      {section.items.map((item) => {
        const data = item.data as LanguagesData;
        return (
          <View key={item.id} style={styles.langRow}>
            <Text style={styles.langName}>{data.language}</Text>
            <Text style={styles.langProf}>{data.proficiency}</Text>
          </View>
        );
      })}
    </View>
  );
}
