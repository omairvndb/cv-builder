import { View, Text } from "@react-pdf/renderer";
import type { Section, SkillsData } from "@/lib/schemas";
import { styles } from "../styles";
import SectionTitle from "../SectionTitle";

export default function SkillsBlock({ section }: { section: Section }) {
  return (
    <View>
      <SectionTitle title={section.title} sidebar />
      {section.items.map((item) => {
        const data = item.data as SkillsData;
        return (
          <View key={item.id}>
            <Text style={styles.skillCat}>{data.category}</Text>
            <Text style={styles.skillVal}>{data.items.join(", ")}</Text>
          </View>
        );
      })}
    </View>
  );
}
