import { createHmac, timingSafeEqual } from "crypto";
import { unlink } from "fs/promises";
import { Badge, Button, Container, Group, Paper, PasswordInput, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin | Tirakan Charaktere",
};

const adminCookieName = "tirakan_admin";

function adminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function adminToken(password: string) {
  return `v1.${createHmac("sha256", password).update("tirakan-admin").digest("hex")}`;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

async function isAuthenticated() {
  const password = adminPassword();

  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;

  return Boolean(token && safeEqual(token, adminToken(password)));
}

async function login(formData: FormData) {
  "use server";

  const password = adminPassword();
  const submittedPassword = String(formData.get("password") ?? "");

  if (!password || !safeEqual(submittedPassword, password)) {
    redirect("/admin?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(adminCookieName, adminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}

async function logout() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(adminCookieName);
  redirect("/admin");
}

async function deleteCharacter(formData: FormData) {
  "use server";

  if (!(await isAuthenticated())) {
    redirect("/admin");
  }

  const hash = String(formData.get("hash") ?? "");

  if (!hash) {
    redirect("/admin");
  }

  const character = await prisma.character.findUnique({
    where: { hash },
    select: { portraitStoragePath: true },
  });

  if (character) {
    await prisma.character.delete({ where: { hash } });

    if (character.portraitStoragePath) {
      await unlink(character.portraitStoragePath).catch(() => undefined);
    }
  }

  redirect("/admin");
}

type AdminPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { error } = await searchParams;
  const passwordConfigured = Boolean(adminPassword());
  const authenticated = await isAuthenticated();

  if (!passwordConfigured || !authenticated) {
    return (
      <main className="book-page">
        <Container size="xs">
          <Stack gap="lg">
            <Stack gap={2} className="page-header">
              <Text className="page-kicker">Verwaltung</Text>
              <Title className="display-font page-title">Admin</Title>
            </Stack>

            <Paper className="book-panel" p="lg">
              <Stack>
                <Title order={2} className="display-font">
                  Zugang
                </Title>
                {!passwordConfigured ? (
                  <Text c="red.9">ADMIN_PASSWORD ist nicht gesetzt.</Text>
                ) : (
                  <form action={login}>
                    <Stack>
                      <PasswordInput name="password" label="Passwort" autoComplete="current-password" required />
                      {error && <Text c="red.9">Das Passwort ist falsch.</Text>}
                      <Group justify="end">
                        <Button color="red.9" type="submit">
                          Anmelden
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </main>
    );
  }

  const characters = await prisma.character.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      hash: true,
      name: true,
      concept: true,
      portraitMimeType: true,
      portraitUpdatedAt: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  return (
    <main className="book-page">
      <Container size="lg">
        <Stack gap="lg">
          <Group className="page-header" justify="space-between" align="start">
            <Stack gap={2}>
              <Text className="page-kicker">Verwaltung</Text>
              <Title className="display-font page-title">Admin</Title>
              <Badge color="red" variant="light" w="fit-content">
                {characters.length} Charaktere
              </Badge>
            </Stack>
            <form action={logout}>
              <Button type="submit" variant="subtle" color="gray">
                Abmelden
              </Button>
            </form>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {characters.map((character) => {
              const portraitUrl = character.portraitMimeType
                ? `/api/characters/${character.hash}/portrait?v=${encodeURIComponent(
                    character.portraitUpdatedAt?.toISOString() ?? character.updatedAt.toISOString(),
                  )}`
                : null;

              return (
                <Paper key={character.hash} className="book-panel admin-character-card" p="md">
                  <Group align="stretch" wrap="nowrap">
                    <Link
                      className="admin-character-image"
                      href={`/characters/${character.hash}`}
                      aria-label={`Charakter ${character.name} öffnen`}
                    >
                      {portraitUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={portraitUrl} alt={`Portrait von ${character.name}`} />
                      ) : (
                        <div className="portrait-silhouette" aria-label="Kein Portrait hinterlegt">
                          <span />
                        </div>
                      )}
                    </Link>
                    <Stack gap={5} className="admin-character-meta">
                      <Link href={`/characters/${character.hash}`}>
                        <Text fw={700} lineClamp={1}>
                          {character.name}
                        </Text>
                      </Link>
                      <Text size="xs" c="dimmed">
                        Hash {character.hash}
                      </Text>
                      <Text size="sm" lineClamp={2}>
                        {character.concept}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Erstellt {character.createdAt.toLocaleDateString("de-DE")}
                      </Text>
                      <form action={deleteCharacter}>
                        <input type="hidden" name="hash" value={character.hash} />
                        <Button type="submit" color="red.9" variant="subtle" size="compact-sm" px={0}>
                          Löschen
                        </Button>
                      </form>
                    </Stack>
                  </Group>
                </Paper>
              );
            })}
          </SimpleGrid>
        </Stack>
      </Container>
    </main>
  );
}
