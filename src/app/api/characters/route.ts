import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createCharacterHash } from "@/lib/hash";
import { sendCharacterCreatedMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { CharacterPayload, deriveValues, normalizeAttributes } from "@/lib/rulebook";

export const runtime = "nodejs";

function normalizePayload(body: Partial<CharacterPayload>): CharacterPayload {
  const attributes = normalizeAttributes(body.attributes);
  const skills = Array.isArray(body.skills) ? body.skills.filter((skill) => skill.name?.trim()) : [];

  return {
    name: body.name?.trim() || "Namenlos",
    birthDate: body.birthDate?.trim(),
    century: Math.min(10, Math.max(1, Number(body.century) || 1)),
    campaign: body.campaign?.trim(),
    playerName: body.playerName?.trim(),
    concept: body.concept?.trim() || "Ein Schatten mit unerzählter Schuld",
    ancestry: body.ancestry?.trim() || "Unbekannte Abstammung",
    ancestryCustom: Boolean(body.ancestryCustom),
    path: body.path?.trim() || "Unbekannter Weg",
    pathCustom: Boolean(body.pathCustom),
    bond: body.bond?.trim() || "Unbekannte Bindung",
    bondCustom: Boolean(body.bondCustom),
    oathOrDebt: body.oathOrDebt?.trim(),
    attributes,
    skills,
    equipment: {
      primaryWeapon: body.equipment?.primaryWeapon?.trim() ?? "",
      secondaryWeapon: body.equipment?.secondaryWeapon?.trim() ?? "",
      armor: body.equipment?.armor?.trim() ?? "",
      items: body.equipment?.items?.filter(Boolean) ?? [],
      customWeapons: body.equipment?.customWeapons ?? {},
      customArmors: body.equipment?.customArmors ?? {},
    },
    supernatural: {
      focus: body.supernatural?.focus?.trim() ?? "",
      regenerationRitual: body.supernatural?.regenerationRitual?.trim() ?? "",
      aspects: body.supernatural?.aspects?.filter(Boolean) ?? [],
      spells: body.supernatural?.spells?.filter(Boolean) ?? [],
    },
    notes: body.notes?.trim(),
  };
}

export async function POST(request: Request) {
  const payload = normalizePayload(await request.json());
  const derived = deriveValues(payload);
  const origin = new URL(request.url).origin;
  let hash = createCharacterHash();

  for (let attempts = 0; attempts < 4; attempts += 1) {
    try {
      const character = await prisma.character.create({
        data: {
          ...payload,
          hash,
          attributes: payload.attributes as Prisma.InputJsonValue,
          skills: payload.skills as Prisma.InputJsonValue,
          equipment: payload.equipment as Prisma.InputJsonValue,
          supernatural: payload.supernatural as Prisma.InputJsonValue,
          conditions: {
            wounds: 0,
            burden: 0,
            omen: derived.omenMax,
            arkana: derived.arkanaMax,
            favor: derived.favorMax,
            corruption: 0,
          },
          ...derived,
        },
      });

      await sendCharacterCreatedMail(character, origin).catch((error) => {
        console.error("Character created mail could not be sent", error);
      });

      return NextResponse.json({ hash: character.hash });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        hash = createCharacterHash();
        continue;
      }

      throw error;
    }
  }

  return NextResponse.json({ error: "Hash konnte nicht erzeugt werden." }, { status: 500 });
}
