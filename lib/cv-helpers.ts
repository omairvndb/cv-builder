import type { CV, Section, SectionItemData } from "@/lib/schemas";

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
  return updateSection(cv, sectionId, (s) => ({
    ...s,
    items: [...s.items, { id: crypto.randomUUID(), sectionId, order: s.items.length, data }],
  }));
}

export function removeSectionItem(cv: CV, sectionId: string, itemId: string): CV {
  return updateSection(cv, sectionId, (s) => ({
    ...s,
    items: s.items.filter((i) => i.id !== itemId),
  }));
}
