import { getSectionLayout, sortByOrder } from "@/lib/cv-helpers";
import type { CV } from "@/lib/schemas";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import PersonalInfoBlock from "./sections/PersonalInfoBlock";
import SectionBlock from "./sections/SectionBlock";
import Section from "./shared/Section";
import { styles } from "./styles";

export default function CVDocument({ cv }: { cv: CV }) {
  const visibleSections = cv.sections
    .filter((s) => s.visible)
    .map((s) => ({ ...s, items: sortByOrder(s.items) }));
  const sidebarSections = sortByOrder(
    visibleSections.filter((s) => getSectionLayout(s.type) === "sidebar")
  );
  const mainSections = sortByOrder(
    visibleSections.filter((s) => getSectionLayout(s.type) === "main")
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar background (repeats on every overflow page) */}
        <View fixed style={styles.sidebarBackground} />

        {/* Sidebar content */}
        <View style={styles.sidebarContent}>
          <PersonalInfoBlock cv={cv} />
          {sidebarSections.map((section) => (
            <SectionBlock key={section.id} section={section} />
          ))}
        </View>

        {/* Main content */}
        <View style={styles.main}>
          {/* Name and job title header */}
          <View style={styles.nameHeader}>
            {cv.name && <Text style={styles.nameText}>{cv.name.toUpperCase()}</Text>}
            {cv.title && <Text style={styles.jobTitleText}>{cv.title}</Text>}
          </View>

          <View style={styles.content}>
            {/* Summary/profile section */}
            {cv.summary && (
              <Section title="Profiel" first>
                <Text style={styles.bodyText}>{cv.summary}</Text>
              </Section>
            )}

            {/* Main sections: education, experience, projects */}
            {mainSections.map((section, idx) => (
              <SectionBlock key={section.id} section={section} first={idx === 0 && !cv.summary} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
