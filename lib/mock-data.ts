import type { CV, Preset } from "@/lib/schemas";

export const mockCV: CV = {
  id: "cv-1",
  presetId: "preset-1",
  name: "Omair Vandenbroucke",
  title: "Student Programmeren",
  email: "o.vandenbroucke@outlook.com",
  phone: "+32 473 50 38 00",
  location: "2890 Puurs-Sint-Amands",
  linkedin: "https://www.linkedin.com/in/omairvandenbroucke",
  github: "https://github.com/omairvndb",
  driverLicense: "B",
  dateOfBirth: "26 juni 2002",
  sections: [
    {
      id: "section-edu",
      cvId: "cv-1",
      type: "EDUCATION",
      title: "Opleidingen",
      order: 0,
      visible: true,
      items: [
        {
          id: "edu-1",
          sectionId: "section-edu",
          order: 0,
          data: {
            degree: "Graduaat Programmeren",
            institution: "Thomas More Hogeschool",
            location: "Antwerpen",
            startDate: "2024",
            endDate: "2026 (verwacht)",
          },
        },
        {
          id: "edu-2",
          sectionId: "section-edu",
          order: 1,
          data: {
            degree: "Bachelor Industriële Wetenschappen",
            institution: "Vrije Universiteit Brussel",
            location: "Brussel",
            startDate: "2021",
            endDate: "2023",
            description: "Niet afgerond",
            bullets: [
              "Succesvol behaalde vakken: Informatica, Basiswiskunde, Toegepaste analyse",
              "Programmeerervaring opgedaan in C",
            ],
          },
        },
        {
          id: "edu-3",
          sectionId: "section-edu",
          order: 2,
          data: {
            degree: "Economie-Wiskunde",
            institution: "Atheneum Willebroek",
            location: "Willebroek",
            startDate: "2016",
            endDate: "2020",
            description: "Secundair diploma behaald",
          },
        },
      ],
    },
    {
      id: "section-exp",
      cvId: "cv-1",
      type: "EXPERIENCE",
      title: "Werkervaring",
      order: 1,
      visible: true,
      items: [
        {
          id: "exp-1",
          sectionId: "section-exp",
          order: 0,
          data: {
            role: "Software Developer (Stage)",
            company: "Brightest",
            location: "Kontich",
            startDate: "November 2025",
            endDate: "Juni 2026",
            description:
              "Interface gebouwd die automatisch Playwright selectors en Page Object Model (POM) klassen genereert uit geselecteerde webpagina-elementen, waardoor testautomatisatie sneller en toegankelijker wordt",
            techStack: ["Electron", "React", "TypeScript", "Playwright"],
          },
        },
        {
          id: "exp-2",
          sectionId: "section-exp",
          order: 1,
          data: {
            role: "Klantendienstmedewerker (Studentenjob)",
            company: "Landmeters- en Studiebureau Van Opstal",
            location: "Puurs",
            startDate: "Juli 2024",
            endDate: "September 2024",
            description:
              "Gegevens verzameld en verwerkt voor taxatieverslagen en plaatsbeschrijvingen\n\nUitvoeren van diverse administratieve taken met oog voor detail en nauwkeurigheid",
          },
        },
        {
          id: "exp-3",
          sectionId: "section-exp",
          order: 2,
          data: {
            role: "Medewerker Compliance (Studentenjob)",
            company: "Nu Skin",
            location: "Brussel",
            startDate: "Juli 2022",
            endDate: "Augustus 2022",
            description:
              "Duidelijke en gestructureerde rapporten opgesteld over productveiligheid\n\nData geordend en geanalyseerd via Excel",
          },
        },
      ],
    },
    {
      id: "section-skills",
      cvId: "cv-1",
      type: "SKILLS",
      title: "Technische Vaardigheden",
      order: 2,
      visible: true,
      items: [
        {
          id: "skills-1",
          sectionId: "section-skills",
          order: 0,
          data: {
            category: "Programmeertalen & Frameworks",
            items: [
              "Java",
              "JavaScript",
              "TypeScript",
              "HTML",
              "CSS",
              "Spring Boot",
              "React",
              "Next.js",
            ],
          },
        },
        {
          id: "skills-2",
          sectionId: "section-skills",
          order: 1,
          data: {
            category: "Databases",
            items: ["PostgreSQL (SQL)", "MongoDB (NoSQL)"],
          },
        },
        {
          id: "skills-3",
          sectionId: "section-skills",
          order: 2,
          data: {
            category: "Development Tools",
            items: ["Git", "Docker", "Kubernetes (basis)"],
          },
        },
        {
          id: "skills-4",
          sectionId: "section-skills",
          order: 3,
          data: {
            category: "Aanvullende vaardigheden",
            items: ["REST API's", "Agile/Scrum", "Test-driven development (basis)"],
          },
        },
      ],
    },
    {
      id: "section-projects",
      cvId: "cv-1",
      type: "PROJECTS",
      title: "Projecten",
      order: 3,
      visible: true,
      items: [
        {
          id: "project-1",
          sectionId: "section-projects",
          order: 0,
          data: {
            title: "NextSet",
            description: "Full-stack fitness app om workouts te loggen en voortgang bij te houden",
            bullets: [
              "Type-safe client-server communicatie via ORPC",
              "PostgreSQL database met Drizzle ORM (Neon serverless)",
              "Authenticatie met email/wachtwoord en Google OAuth (better-auth)",
              "Deployment via Vercel",
            ],
            techStack: [
              "Next.js",
              "TypeScript",
              "PostgreSQL",
              "Drizzle ORM",
              "TanStack Query",
              "Vitest",
            ],
            link: "nextset-by-omair.vercel.app",
          },
        },
      ],
    },
    {
      id: "section-languages",
      cvId: "cv-1",
      type: "CUSTOM",
      title: "Talenkennis",
      order: 4,
      visible: true,
      items: [
        {
          id: "lang-1",
          sectionId: "section-languages",
          order: 0,
          data: {
            content: "Nederlands: moedertaal\nEngels: moedertaal\nFrans: basiskennis",
          },
        },
      ],
    },
  ],
};

export const mockPreset: Preset = {
  id: "preset-1",
  name: "Algemeen",
  isDefault: true,
  createdAt: new Date("2025-01-01"),
  updatedAt: new Date("2025-01-01"),
  cv: mockCV,
};

export const mockPresets: Preset[] = [mockPreset];
