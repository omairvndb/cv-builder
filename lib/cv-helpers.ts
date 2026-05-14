import type { CV, Section, SectionItem, SectionItemData, SectionType } from "@/lib/schemas";

export type SectionLayout = "sidebar" | "main";

export function getSectionLayout(type: SectionType): SectionLayout {
  return type === "SKILLS" || type === "LANGUAGES" ? "sidebar" : "main";
}

export function sortByOrder<T extends { order: number }>(xs: T[]): T[] {
  return [...xs].sort((a, b) => a.order - b.order);
}

export function normalizeSectionItems(items: Section["items"]): Section["items"] {
  return sortByOrder(items).map((item, idx) => ({ ...item, order: idx }));
}

export function reorderSections(cv: CV, orderedIds: string[]): CV {
  const currentOrders = orderedIds
    .map((id) => cv.sections.find((s) => s.id === id)!.order)
    .sort((a, b) => a - b);
  const newOrderById = new Map(orderedIds.map((id, idx) => [id, currentOrders[idx]]));
  return {
    ...cv,
    sections: cv.sections.map((s) =>
      newOrderById.has(s.id) ? { ...s, order: newOrderById.get(s.id)! } : s
    ),
  };
}

export function getSectionOrderSignature(cv: CV): string {
  return cv.sections.map((s) => `${s.id}@${s.order}`).join(",");
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

export function createBlankCV(presetId: string): CV {
  const cvId = crypto.randomUUID();
  return {
    id: cvId,
    presetId,
    name: "",
    email: "",
    phone: "",
    location: "",
    sections: [
      {
        id: crypto.randomUUID(),
        cvId,
        type: "EDUCATION",
        title: "Education",
        order: 0,
        visible: true,
        items: [],
      },
      {
        id: crypto.randomUUID(),
        cvId,
        type: "EXPERIENCE",
        title: "Work Experience",
        order: 1,
        visible: true,
        items: [],
      },
      {
        id: crypto.randomUUID(),
        cvId,
        type: "SKILLS",
        title: "Skills",
        order: 2,
        visible: true,
        items: [],
      },
      {
        id: crypto.randomUUID(),
        cvId,
        type: "PROJECTS",
        title: "Projects",
        order: 3,
        visible: true,
        items: [],
      },
      {
        id: crypto.randomUUID(),
        cvId,
        type: "LANGUAGES",
        title: "Languages",
        order: 4,
        visible: true,
        items: [],
      },
    ],
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
