import type { CV, Preset, Section, SectionItemData } from "@/lib/schemas";

export function sortByOrder<T extends { order: number }>(xs: T[]): T[] {
  return [...xs].sort((a, b) => a.order - b.order);
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

export function createBlankCV(presetId: string): CV {
  return {
    id: crypto.randomUUID(),
    presetId,
    name: "",
    email: "",
    phone: "",
    location: "",
    sections: [],
  };
}

export function duplicateCV(cv: CV, newPresetId: string): CV {
  return {
    ...cv,
    id: crypto.randomUUID(),
    presetId: newPresetId,
    sections: cv.sections.map((section) => {
      const newSectionId = crypto.randomUUID();
      return {
        ...section,
        id: newSectionId,
        cvId: newPresetId,
        items: section.items.map((item) => ({
          ...item,
          id: crypto.randomUUID(),
          sectionId: newSectionId,
        })),
      };
    }),
  };
}

type CreatePresetArgs = {
  name: string;
  isDefault?: boolean;
  fromCV?: CV;
};

export function createPreset({ name, isDefault = false, fromCV }: CreatePresetArgs): Preset {
  const id = crypto.randomUUID();
  const now = new Date();
  const cv = fromCV ? duplicateCV(fromCV, id) : createBlankCV(id);
  return {
    id,
    name,
    isDefault,
    createdAt: now,
    updatedAt: now,
    cv,
  };
}
