import { View, Text } from "@react-pdf/renderer";
import type { Section, ExperienceData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import SectionTitle from "../shared/SectionTitle";
import Entry from "../shared/Entry";
import Description from "../shared/Description";
import Bullets from "../shared/Bullets";

export default function ExperienceBlock({ section, first }: { section: Section; first: boolean }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <View>
      <SectionTitle title={section.title} first={first} />
      <View style={styles.sectionWrapper}>
        {visibleItems.map((item) => {
          const data = item.data as ExperienceData;
          return (
            <Entry
              key={item.id}
              title={data.role ?? ""}
              subtitle={
                data.location ? `${data.company ?? ""} – ${data.location}` : (data.company ?? "")
              }
              right={
                data.startDate || data.endDate ? (
                  <Text style={styles.entryDate}>
                    {data.startDate ?? ""} – {data.endDate ?? ""}
                  </Text>
                ) : undefined
              }
            >
              {data.description && <Description text={data.description} />}
              <Bullets bullets={data.bullets ?? []} />
              {(data.techStack?.length ?? 0) > 0 && (
                <Text style={styles.techText}>Technologieën: {data.techStack?.join(", ")}</Text>
              )}
            </Entry>
          );
        })}
      </View>
    </View>
  );
}
