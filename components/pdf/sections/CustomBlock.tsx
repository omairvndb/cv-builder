import { View, Text } from "@react-pdf/renderer";
import type { Section, CustomData } from "@/lib/schemas";
import { styles } from "../styles";
import SectionTitle from "../shared/SectionTitle";

export default function CustomBlock({ section }: { section: Section }) {
  return (
    <View>
      <SectionTitle title={section.title} sidebar />
      {section.items.map((item) => {
        const data = item.data as CustomData;
        return (
          <Text key={item.id} style={styles.customContent}>
            {data.content}
          </Text>
        );
      })}
    </View>
  );
}
