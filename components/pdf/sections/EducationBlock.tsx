import { View, Text } from "@react-pdf/renderer";
import type { Section, EducationData } from "@/lib/schemas";
import { styles } from "../styles";
import SectionTitle from "../SectionTitle";
import Entry from "../Entry";
import Description from "../Description";

export default function EducationBlock({ section, first }: { section: Section; first: boolean }) {
  return (
    <View>
      <SectionTitle title={section.title} first={first} />

      {section.items.map((item) => {
        const data = item.data as EducationData;
        return (
          <Entry
            key={item.id}
            title={data.degree}
            subtitle={data.institution}
            right={
              <Text style={styles.entryDate}>
                {data.startDate} – {data.endDate}
              </Text>
            }
          >
            {data.description && <Description text={data.description} />}
          </Entry>
        );
      })}
    </View>
  );
}
