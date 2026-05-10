"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CVSchema, type CV } from "@/lib/schemas";
import { mapCV } from "./_helpers";

// saveCV accepts in-progress CVs where personal fields may still be empty.
// CVSchema keeps min(1) on name for form validation; this schema relaxes it for persistence.
const SaveCVSchema = CVSchema.extend({ name: z.string() });

export async function saveCV(cv: CV): Promise<CV> {
  const parsed = SaveCVSchema.parse(cv);

  const saved = await prisma.$transaction(async (tx) => {
    // Upsert the CV row — capture the actual DB id (may differ from client id on first save)
    const { id: dbCvId } = await tx.cV.upsert({
      where: { presetId: parsed.presetId },
      create: {
        id: parsed.id,
        presetId: parsed.presetId,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        location: parsed.location,
        title: parsed.title,
        linkedin: parsed.linkedin,
        github: parsed.github,
        website: parsed.website,
        driverLicense: parsed.driverLicense,
        dateOfBirth: parsed.dateOfBirth,
        summary: parsed.summary,
      },
      update: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        location: parsed.location,
        title: parsed.title,
        linkedin: parsed.linkedin,
        github: parsed.github,
        website: parsed.website,
        driverLicense: parsed.driverLicense,
        dateOfBirth: parsed.dateOfBirth,
        summary: parsed.summary,
      },
      select: { id: true },
    });

    // Replace all sections (cascade deletes items)
    await tx.section.deleteMany({ where: { cvId: dbCvId } });

    await tx.section.createMany({
      data: parsed.sections.map((s) => ({
        id: s.id,
        cvId: dbCvId,
        type: s.type,
        title: s.title,
        order: s.order,
        visible: s.visible,
      })),
    });

    const allItems = parsed.sections.flatMap((s) =>
      s.items.map((i) => ({ id: i.id, sectionId: s.id, order: i.order, data: i.data }))
    );
    if (allItems.length > 0) {
      await tx.sectionItem.createMany({ data: allItems });
    }

    return tx.cV.findUniqueOrThrow({
      where: { id: dbCvId },
      include: {
        sections: {
          include: { items: { orderBy: { order: "asc" } } },
          orderBy: { order: "asc" },
        },
      },
    });
  });

  return mapCV(saved);
}
