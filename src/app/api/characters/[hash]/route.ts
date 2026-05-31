import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { deriveValues, normalizeAttributes } from "@/lib/rulebook";

const publicApiHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function toPublicCharacter<T extends { id: string; portraitStoragePath?: string | null }>(character: T) {
  const { id: _id, portraitStoragePath: _portraitStoragePath, ...publicCharacter } = character;
  return publicCharacter;
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: publicApiHeaders });
}

export async function GET(_request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const character = await prisma.character.findUnique({ where: { hash } });

  if (!character) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404, headers: publicApiHeaders });
  }

  return NextResponse.json(toPublicCharacter(character), { headers: publicApiHeaders });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const body = await request.json();
  const {
    id: _id,
    hash: _hash,
    portraitStoragePath: _portraitStoragePath,
    portraitOriginalName: _portraitOriginalName,
    portraitMimeType: _portraitMimeType,
    portraitSize: _portraitSize,
    portraitUpdatedAt: _portraitUpdatedAt,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...patchBody
  } = body;
  const current = await prisma.character.findUnique({ where: { hash } });

  if (!current) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const nextAttributes = normalizeAttributes((patchBody.attributes ?? current.attributes) as Record<string, number>);
  const nextSkills = (patchBody.skills ?? current.skills) as Array<{ name: string; rank: number }>;
  const nextCentury = Number(patchBody.century ?? current.century);
  const derived = deriveValues({
    attributes: nextAttributes as never,
    century: nextCentury,
    skills: nextSkills,
  });

  const character = await prisma.character.update({
    where: { hash },
    data: {
      ...patchBody,
      century: nextCentury,
      attributes: nextAttributes as Prisma.InputJsonValue,
      skills: nextSkills as Prisma.InputJsonValue,
      equipment: (patchBody.equipment ?? current.equipment) as Prisma.InputJsonValue,
      supernatural: (patchBody.supernatural ?? current.supernatural) as Prisma.InputJsonValue,
      conditions: (patchBody.conditions ?? current.conditions) as Prisma.InputJsonValue,
      ...derived,
    },
  });

  return NextResponse.json(toPublicCharacter(character));
}
