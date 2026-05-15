"use server";

import { prisma } from "@/lib/prisma";
import { type CV } from "@/lib/schemas";
import { mapCV } from "./_helpers";

const toNullable = (value?: string) => value ?? null;

export async function saveCV(cv: CV): Promise<CV> {
  const personalData = {
    name: toNullable(cv.name),
    email: toNullable(cv.email),
    phone: toNullable(cv.phone),
    location: toNullable(cv.location),
    title: toNullable(cv.title),
    linkedin: toNullable(cv.linkedin),
    github: toNullable(cv.github),
    website: toNullable(cv.website),
    driverLicense: toNullable(cv.driverLicense),
    dateOfBirth: toNullable(cv.dateOfBirth),
    summary: toNullable(cv.summary),
  };

  const saved = await prisma.$transaction(async (tx) => {
    const { id: dbCvId } = await tx.cV.upsert({
      where: { presetId: cv.presetId },
      create: { id: cv.id, presetId: cv.presetId, ...personalData },
      update: personalData,
      select: { id: true },
    });

    await tx.section.deleteMany({ where: { cvId: dbCvId } });

    await tx.section.createMany({
      data: cv.sections.map((s) => ({
        id: s.id,
        cvId: dbCvId,
        type: s.type,
        title: s.title,
        order: s.order,
        visible: s.visible,
      })),
    });

    const allItems = cv.sections.flatMap((s) =>
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
