import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deriveValues, normalizeAttributes } from "@/lib/rulebook";

export async function PATCH(request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const body = await request.json();
  const current = await prisma.character.findUnique({ where: { hash } });

  if (!current) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const nextAttributes = normalizeAttributes((body.attributes ?? current.attributes) as Record<string, number>);
  const nextSkills = (body.skills ?? current.skills) as Array<{ name: string; rank: number }>;
  const nextCentury = Number(body.century ?? current.century);
  const derived = deriveValues({
    attributes: nextAttributes as never,
    century: nextCentury,
    skills: nextSkills,
  });

  const character = await prisma.character.update({
    where: { hash },
    data: {
      ...body,
      century: nextCentury,
      attributes: nextAttributes as Prisma.InputJsonValue,
      skills: nextSkills as Prisma.InputJsonValue,
      equipment: (body.equipment ?? current.equipment) as Prisma.InputJsonValue,
      supernatural: (body.supernatural ?? current.supernatural) as Prisma.InputJsonValue,
      conditions: (body.conditions ?? current.conditions) as Prisma.InputJsonValue,
      ...derived,
    },
  });

  return NextResponse.json(character);
}
