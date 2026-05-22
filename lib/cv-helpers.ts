import type { CV, Section, SectionItem, SectionItemData, SectionType } from "@/lib/schemas";

export type SectionLayout = "sidebar" | "main";

const SIDEBAR_TYPES: ReadonlySet<SectionType> = new Set([
  "SKILLS",
  "LANGUAGES",
  "CERTIFICATIONS",
  "REFERENCES",
]);

export function getSectionLayout(type: SectionType): SectionLayout {
  return SIDEBAR_TYPES.has(type) ? "sidebar" : "main";
}

export function sortByOrder<T extends { order: number }>(xs: T[]): T[] {
  return [...xs].sort((a, b) => a.order - b.order);
}

export function normalizeSectionItems(items: Section["items"]): Section["items"] {
  return sortByOrder(items).map((item, idx) => ({ ...item, order: idx }));
}

function reorderByIds<T extends { id: string; order: number }>(xs: T[], orderedIds: string[]): T[] {
  return xs.map((x) => {
    const newOrder = orderedIds.indexOf(x.id);
    return newOrder === -1 ? x : { ...x, order: newOrder };
  });
}

export function reorderSections(cv: CV, orderedIds: string[]): CV {
  return { ...cv, sections: reorderByIds(cv.sections, orderedIds) };
}

export function reorderSectionItems(cv: CV, sectionId: string, orderedIds: string[]): CV {
  return updateSection(cv, sectionId, (s) => ({ ...s, items: reorderByIds(s.items, orderedIds) }));
}

export function getOrderSignature(cv: CV): string {
  return cv.sections
    .map((s) => `${s.id}@${s.order}[${s.items.map((i) => `${i.id}@${i.order}`).join(",")}]`)
    .join(",");
}

export function updateSection(cv: CV, sectionId: string, updater: (s: Section) => Section): CV {
  return { ...cv, sections: cv.sections.map((s) => (s.id === sectionId ? updater(s) : s)) };
}

export function updateSectionItem(
  cv: CV,
  sectionId: string,
  itemId: string,
  data: SectionItemData
): CV {
  return updateSection(cv, sectionId, (s) => ({
    ...s,
    items: s.items.map((i) => (i.id === itemId ? { ...i, data } : i)),
  }));
}

export function addSectionItem(cv: CV, sectionId: string, data: SectionItemData): CV {
  return updateSection(cv, sectionId, (s) => {
    const normalized = normalizeSectionItems(s.items);
    return {
      ...s,
      items: [
        ...normalized,
        { id: crypto.randomUUID(), sectionId, order: normalized.length, data },
      ],
    };
  });
}

export function addSectionItems(cv: CV, sectionId: string, datas: SectionItemData[]): CV {
  if (datas.length === 0) return cv;
  return updateSection(cv, sectionId, (s) => {
    const normalized = normalizeSectionItems(s.items);
    const appended = datas.map((data, idx) => ({
      id: crypto.randomUUID(),
      sectionId,
      order: normalized.length + idx,
      data,
    }));
    return { ...s, items: [...normalized, ...appended] };
  });
}

export function removeSectionItem(cv: CV, sectionId: string, itemId: string): CV {
  return updateSection(cv, sectionId, (s) => {
    const remaining = s.items.filter((i) => i.id !== itemId);
    return { ...s, items: normalizeSectionItems(remaining) };
  });
}

export function isItemDirty(item: SectionItem, savedSection: Section | null): boolean {
  const savedItem = savedSection?.items.find((i) => i.id === item.id);
  return JSON.stringify(item) !== JSON.stringify(savedItem);
}

export function hasContent(data: Record<string, unknown>): boolean {
  return Object.values(data).some((v) => (Array.isArray(v) ? v.length > 0 : Boolean(v)));
}

const BLANK_SECTIONS: { type: SectionType; title: string }[] = [
  { type: "EDUCATION", title: "Education" },
  { type: "EXPERIENCE", title: "Work Experience" },
  { type: "SKILLS", title: "Skills" },
  { type: "PROJECTS", title: "Projects" },
  { type: "LANGUAGES", title: "Languages" },
  { type: "CERTIFICATIONS", title: "Certifications" },
  { type: "REFERENCES", title: "References" },
];

export function createBlankCV(presetId: string): CV {
  const cvId = crypto.randomUUID();
  return {
    id: cvId,
    presetId,
    name: "",
    email: "",
    phone: "",
    location: "",
    sections: BLANK_SECTIONS.map((s, order) => ({
      id: crypto.randomUUID(),
      cvId,
      order,
      visible: true,
      items: [],
      ...s,
    })),
  };
}

export function duplicateCV(cv: CV, newPresetId: string): CV {
  const newCvId = crypto.randomUUID();
  return {
    ...cv,
    id: newCvId,
    presetId: newPresetId,
    sections: cv.sections.map((section) => {
      const newSectionId = crypto.randomUUID();
      return {
        ...section,
        id: newSectionId,
        cvId: newCvId,
        items: section.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
          sectionId: newSectionId,
        })),
      };
    }),
  };
}
