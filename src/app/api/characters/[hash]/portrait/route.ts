import { randomUUID } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { sendPortraitUploadedMail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const maxPortraitSize = 3 * 1024 * 1024;
const portraitUploadDir = path.join(process.cwd(), "uploads", "characters");
const allowedImageTypes: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function publicPortraitFields(character: {
  portraitOriginalName: string | null;
  portraitMimeType: string | null;
  portraitSize: number | null;
  portraitUpdatedAt: Date | null;
  updatedAt: Date;
}) {
  return {
    portraitOriginalName: character.portraitOriginalName,
    portraitMimeType: character.portraitMimeType,
    portraitSize: character.portraitSize,
    portraitUpdatedAt: character.portraitUpdatedAt,
    updatedAt: character.updatedAt,
  };
}

export async function GET(_request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const character = await prisma.character.findUnique({
    where: { hash },
    select: {
      portraitStoragePath: true,
      portraitOriginalName: true,
      portraitMimeType: true,
    },
  });

  if (!character?.portraitStoragePath || !character.portraitMimeType) {
    return NextResponse.json({ error: "Kein Portrait hinterlegt." }, { status: 404 });
  }

  const file = await readFile(character.portraitStoragePath);

  return new NextResponse(file, {
    headers: {
      "Content-Type": character.portraitMimeType,
      "Content-Disposition": `inline; filename="${encodeURIComponent(character.portraitOriginalName ?? "portrait")}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function POST(request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const origin = new URL(request.url).origin;
  const character = await prisma.character.findUnique({
    where: { hash },
    select: {
      hash: true,
      name: true,
      concept: true,
      ancestry: true,
      path: true,
      bond: true,
      portraitStoragePath: true,
    },
  });

  if (!character) {
    return NextResponse.json({ error: "Nicht gefunden" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("portrait");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Portrait fehlt." }, { status: 400 });
  }

  const extension = allowedImageTypes[file.type];

  if (!extension) {
    return NextResponse.json({ error: "Nur JPEG, PNG und WebP sind erlaubt." }, { status: 400 });
  }

  if (file.size > maxPortraitSize) {
    return NextResponse.json({ error: "Das Portrait darf maximal 3 MB groß sein." }, { status: 400 });
  }

  await mkdir(portraitUploadDir, { recursive: true });

  const storagePath = path.join(portraitUploadDir, `${hash}-${randomUUID()}.${extension}`);
  const bytes = await file.arrayBuffer();
  await writeFile(storagePath, Buffer.from(bytes));

  const updated = await prisma.character.update({
    where: { hash },
    data: {
      portraitStoragePath: storagePath,
      portraitOriginalName: file.name,
      portraitMimeType: file.type,
      portraitSize: file.size,
      portraitUpdatedAt: new Date(),
    },
    select: {
      hash: true,
      name: true,
      concept: true,
      ancestry: true,
      path: true,
      bond: true,
      portraitOriginalName: true,
      portraitMimeType: true,
      portraitSize: true,
      portraitUpdatedAt: true,
      updatedAt: true,
    },
  });

  if (character.portraitStoragePath && character.portraitStoragePath !== storagePath) {
    await unlink(character.portraitStoragePath).catch(() => undefined);
  }

  await sendPortraitUploadedMail(updated, origin, {
    filename: file.name,
    path: storagePath,
    contentType: file.type,
  }).catch((error) => {
    console.error("Portrait uploaded mail could not be sent", error);
  });

  return NextResponse.json(publicPortraitFields(updated));
}
