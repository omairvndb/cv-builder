import { View, Text } from "@react-pdf/renderer";
import type { Section, ExperienceData } from "@/lib/schemas";
import { styles } from "../styles";
import SectionTitle from "../shared/SectionTitle";
import Entry from "../shared/Entry";
import Description from "../shared/Description";

export default function ExperienceBlock({ section, first }: { section: Section; first: boolean }) {
  return (
    <View>
      <SectionTitle title={section.title} first={first} />
      {section.items.map((item) => {
        const data = item.data as ExperienceData;
        return (
          <Entry
            key={item.id}
            title={data.role}
            subtitle={data.location ? `${data.company} – ${data.location}` : data.company}
            right={
              <Text style={styles.entryDate}>
                {data.startDate} – {data.endDate}
              </Text>
            }
          >
            <Description text={data.description} />
          </Entry>
        );
      })}
    </View>
  );
}
