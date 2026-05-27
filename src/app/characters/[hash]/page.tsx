import { notFound } from "next/navigation";
import { CharacterDetail } from "@/components/CharacterDetail";
import { prisma } from "@/lib/prisma";

export default async function CharacterPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const character = await prisma.character.findUnique({ where: { hash } });

  if (!character) {
    notFound();
  }

  return <CharacterDetail character={JSON.parse(JSON.stringify(character))} />;
}
