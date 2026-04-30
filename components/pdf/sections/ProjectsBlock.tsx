import { View, Text, Link } from "@react-pdf/renderer";
import type { Section, ProjectsData } from "@/lib/schemas";
import { styles } from "../styles";
import { stripProtocol } from "@/lib/utils";
import SectionTitle from "../SectionTitle";
import Entry from "../Entry";
import Description from "../Description";

export default function ProjectsBlock({ section, first }: { section: Section; first: boolean }) {
  return (
    <View>
      <SectionTitle title={section.title} first={first} />
      {section.items.map((item) => {
        const data = item.data as ProjectsData;
        return (
          <Entry
            key={item.id}
            title={data.title}
            right={
              data.link ? (
                <Link
                  src={data.link.startsWith("http") ? data.link : `https://${data.link}`}
                  style={styles.entryDate}
                >
                  {stripProtocol(data.link)}
                </Link>
              ) : undefined
            }
          >
            <Description text={data.description} />
            {data.techStack.length > 0 && (
              <Text style={styles.techText}>Technologieën: {data.techStack.join(", ")}</Text>
            )}
          </Entry>
        );
      })}
    </View>
  );
}
