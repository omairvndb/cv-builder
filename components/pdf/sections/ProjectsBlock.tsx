import { View, Text, Link } from "@react-pdf/renderer";
import type { Section, ProjectsData } from "@/lib/schemas";
import { hasContent } from "@/lib/cv-helpers";
import { styles } from "../styles";
import { ensureProtocol, stripProtocol } from "@/lib/utils";
import SectionTitle from "../shared/SectionTitle";
import Entry from "../shared/Entry";
import Description from "../shared/Description";
import Bullets from "../shared/Bullets";

export default function ProjectsBlock({ section, first }: { section: Section; first: boolean }) {
  const visibleItems = section.items.filter((item) =>
    hasContent(item.data as Record<string, unknown>)
  );

  return (
    <View>
      <SectionTitle title={section.title} first={first} />
      {visibleItems.map((item) => {
        const data = item.data as ProjectsData;
        return (
          <Entry
            key={item.id}
            title={data.title ?? ""}
            right={
              data.link ? (
                <Link src={ensureProtocol(data.link)} style={styles.entryDate}>
                  {stripProtocol(data.link)}
                </Link>
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
  );
}
