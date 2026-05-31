import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CharacterDetail } from "@/components/CharacterDetail";
import { prisma } from "@/lib/prisma";

type CharacterPageProps = {
  params: Promise<{ hash: string }>;
};

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { hash } = await params;
  const character = await prisma.character.findUnique({
    where: { hash },
    select: { name: true },
  });

  return {
    title: character ? `${character.name} | Tirakan Charaktere` : "Charakter nicht gefunden | Tirakan Charaktere",
  };
}

export default async function CharacterPage({ params }: CharacterPageProps) {
  const { hash } = await params;
  const character = await prisma.character.findUnique({ where: { hash } });

  if (!character) {
    notFound();
  }

  const { id: _id, portraitStoragePath: _portraitStoragePath, ...publicCharacter } = character;

  return <CharacterDetail character={JSON.parse(JSON.stringify(publicCharacter))} />;
}
