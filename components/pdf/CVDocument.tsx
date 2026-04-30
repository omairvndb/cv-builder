import { Document, Page, View, Text } from "@react-pdf/renderer";
import type { CV } from "@/lib/schemas";
import { styles } from "./styles";
import SectionTitle from "./SectionTitle";
import PersonalInfoBlock from "./sections/PersonalInfoBlock";
import SkillsBlock from "./sections/SkillsBlock";
import CustomBlock from "./sections/CustomBlock";
import EducationBlock from "./sections/EducationBlock";
import ExperienceBlock from "./sections/ExperienceBlock";
import ProjectsBlock from "./sections/ProjectsBlock";

export default function CVDocument({ cv }: { cv: CV }) {
  const sidebarSections = cv.sections
    .filter((s) => s.visible && (s.type === "SKILLS" || s.type === "CUSTOM"))
    .sort((a, b) => a.order - b.order);

  const mainSections = cv.sections
    .filter(
      (s) =>
        s.visible && (s.type === "EDUCATION" || s.type === "EXPERIENCE" || s.type === "PROJECTS")
    )
    .sort((a, b) => a.order - b.order);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar content */}
        <View style={styles.sidebar}>
          <PersonalInfoBlock cv={cv} />
          {sidebarSections.map((section) => {
            if (section.type === "SKILLS")
              return <SkillsBlock key={section.id} section={section} />;
            if (section.type === "CUSTOM")
              return <CustomBlock key={section.id} section={section} />;
            return null;
          })}
        </View>

        {/* Main content */}
        <View style={styles.main}>
          {/* Name and job title header */}
          <View style={styles.nameHeader}>
            <Text style={styles.nameText}>{cv.name.toUpperCase()}</Text>
            {cv.title && <Text style={styles.jobTitleText}>{cv.title}</Text>}
          </View>

          <View style={styles.content}>
            {/* Summary/profile section */}
            {cv.summary && (
              <View>
                <SectionTitle title="Profiel" first />
                <Text style={styles.bodyText}>{cv.summary}</Text>
              </View>
            )}

            {/* Main sections: education, experience, projects */}
            {mainSections.map((section, idx) => {
              const first = idx === 0 && !cv.summary;
              if (section.type === "EDUCATION")
                return <EducationBlock key={section.id} section={section} first={first} />;
              if (section.type === "EXPERIENCE")
                return <ExperienceBlock key={section.id} section={section} first={first} />;
              if (section.type === "PROJECTS")
                return <ProjectsBlock key={section.id} section={section} first={first} />;
              return null;
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
