import { sortByOrder } from "@/lib/cv-helpers";
import type { CV } from "@/lib/schemas";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import LanguagesBlock from "./sections/LanguagesBlock";
import EducationBlock from "./sections/EducationBlock";
import ExperienceBlock from "./sections/ExperienceBlock";
import PersonalInfoBlock from "./sections/PersonalInfoBlock";
import ProjectsBlock from "./sections/ProjectsBlock";
import SkillsBlock from "./sections/SkillsBlock";
import SectionTitle from "./shared/SectionTitle";
import { styles } from "./styles";

export default function CVDocument({ cv }: { cv: CV }) {
  const sidebarSections = sortByOrder(
    cv.sections.filter((s) => s.visible && (s.type === "SKILLS" || s.type === "LANGUAGES"))
  );

  const mainSections = sortByOrder(
    cv.sections.filter(
      (s) =>
        s.visible && (s.type === "EDUCATION" || s.type === "EXPERIENCE" || s.type === "PROJECTS")
    )
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar background (repeats on every overflow page) */}
        <View fixed style={styles.sidebarBackground} />

        {/* Sidebar content */}
        <View style={styles.sidebarContent}>
          <PersonalInfoBlock cv={cv} />
          {sidebarSections.map((section) => {
            if (section.type === "SKILLS")
              return <SkillsBlock key={section.id} section={section} />;
            if (section.type === "LANGUAGES")
              return <LanguagesBlock key={section.id} section={section} />;
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
