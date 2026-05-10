"use server";

import { prisma } from "@/lib/prisma";
import { createBlankCV, duplicateCV } from "@/lib/cv-helpers";
import type { Preset } from "@/lib/schemas";
import { mapCV, mapPreset, presetInclude } from "./_helpers";

export async function getPresets(): Promise<Preset[]> {
  const rows = await prisma.preset.findMany({
    include: presetInclude,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(mapPreset);
}

export async function createPreset(name: string): Promise<Preset> {
  const preset = await prisma.$transaction(async (tx) => {
    const newPreset = await tx.preset.create({ data: { name } });
    const blank = createBlankCV(newPreset.id);
    await tx.cV.create({
      data: {
        id: blank.id,
        presetId: newPreset.id,
        name: blank.name,
        email: blank.email,
        phone: blank.phone,
        location: blank.location,
        sections: {
          create: blank.sections.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            order: s.order,
            visible: s.visible,
          })),
        },
      },
    });
    return tx.preset.findUniqueOrThrow({
      where: { id: newPreset.id },
      include: presetInclude,
    });
  });
  return mapPreset(preset);
}

export async function duplicatePreset(fromPresetId: string, name: string): Promise<Preset> {
  const source = await prisma.preset.findUniqueOrThrow({
    where: { id: fromPresetId },
    include: presetInclude,
  });

  if (!source.cv) {
    throw new Error("Source preset has no CV to duplicate");
  }

  const sourceCV = mapCV(source.cv);

  const preset = await prisma.$transaction(async (tx) => {
    const newPreset = await tx.preset.create({ data: { name } });
    const copy = duplicateCV(sourceCV, newPreset.id);

    await tx.cV.create({
      data: {
        id: copy.id,
        presetId: newPreset.id,
        name: copy.name,
        email: copy.email,
        phone: copy.phone,
        location: copy.location,
        title: copy.title,
        linkedin: copy.linkedin,
        github: copy.github,
        website: copy.website,
        driverLicense: copy.driverLicense,
        dateOfBirth: copy.dateOfBirth,
        summary: copy.summary,
        sections: {
          create: copy.sections.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            order: s.order,
            visible: s.visible,
            items: {
              create: s.items.map((i) => ({
                id: i.id,
                order: i.order,
                data: i.data,
              })),
            },
          })),
        },
      },
    });

    return tx.preset.findUniqueOrThrow({
      where: { id: newPreset.id },
      include: presetInclude,
    });
  });

  return mapPreset(preset);
}

export async function updatePreset(
  presetId: string,
  data: { name?: string; isDefault?: boolean }
): Promise<Preset> {
  const preset = await prisma.$transaction(async (tx) => {
    if (data.isDefault === true) {
      await tx.preset.updateMany({ data: { isDefault: false } });
    }
    const updated = await tx.preset.update({
      where: { id: presetId },
      data: { name: data.name, isDefault: data.isDefault },
      include: presetInclude,
    });
    return updated;
  });
  return mapPreset(preset);
}

export async function deletePreset(presetId: string): Promise<void> {
  await prisma.preset.delete({ where: { id: presetId } });
}
