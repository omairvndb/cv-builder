import type { CV, Preset, SectionItemData } from "@/lib/schemas";
import type {
  CV as PrismaCV,
  Preset as PrismaPreset,
  Section as PrismaSection,
  SectionItem as PrismaSectionItem,
} from "@/lib/generated/prisma/client";

type SectionWithItems = PrismaSection & { items: PrismaSectionItem[] };
type CVWithSections = PrismaCV & { sections: SectionWithItems[] };
type PresetWithCV = PrismaPreset & { cv: CVWithSections | null };

export function mapCV(db: CVWithSections): CV {
  return {
    id: db.id,
    presetId: db.presetId,
    name: db.name,
    email: db.email,
    phone: db.phone,
    location: db.location,
    title: db.title ?? undefined,
    linkedin: db.linkedin ?? undefined,
    github: db.github ?? undefined,
    website: db.website ?? undefined,
    driverLicense: db.driverLicense ?? undefined,
    dateOfBirth: db.dateOfBirth ?? undefined,
    summary: db.summary ?? undefined,
    sections: db.sections.map((s) => ({
      id: s.id,
      cvId: s.cvId,
      type: s.type,
      title: s.title,
      order: s.order,
      visible: s.visible,
      items: s.items.map((i) => ({
        id: i.id,
        sectionId: i.sectionId,
        order: i.order,
        data: i.data as SectionItemData,
      })),
    })),
  };
}

export function mapPreset(db: PresetWithCV): Preset {
  return {
    id: db.id,
    name: db.name,
    isDefault: db.isDefault,
    createdAt: db.createdAt,
    updatedAt: db.updatedAt,
    cv: db.cv ? mapCV(db.cv) : undefined,
  };
}

/** Full Prisma include for a preset with its nested CV data. */
export const presetInclude = {
  cv: {
    include: {
      sections: {
        include: { items: { orderBy: { order: "asc" as const } } },
        orderBy: { order: "asc" as const },
      },
    },
  },
} as const;
