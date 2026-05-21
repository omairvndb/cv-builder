import { Text } from "@react-pdf/renderer";
import type { Section as SectionData, ExperienceData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import Section from "../shared/Section";
import Entry from "../shared/Entry";
import Description from "../shared/Description";
import Bullets from "../shared/Bullets";

export default function ExperienceBlock({
  section,
  first,
}: {
  section: SectionData;
  first: boolean;
}) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <Section title={section.title} first={first}>
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
    </Section>
  );
}
