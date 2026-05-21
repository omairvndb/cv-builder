import { Text } from "@react-pdf/renderer";
import type { Section as SectionData, EducationData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import Section from "../shared/Section";
import Entry from "../shared/Entry";
import Description from "../shared/Description";
import Bullets from "../shared/Bullets";

export default function EducationBlock({
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
        const data = item.data as EducationData;
        return (
          <Entry
            key={item.id}
            title={data.degree ?? ""}
            subtitle={
              data.location
                ? `${data.institution ?? ""} – ${data.location}`
                : (data.institution ?? "")
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
          </Entry>
        );
      })}
    </Section>
  );
}
