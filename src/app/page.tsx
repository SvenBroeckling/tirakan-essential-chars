import { Button, Container, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { HashLookup } from "@/components/HashLookup";

const releaseUrl = "https://github.com/SvenBroeckling/tirakan-essential/releases/latest";
const downloads = [
  {
    title: "Regelbuch",
    file: "tirakans-reiche-essential.pdf",
    href: "https://github.com/SvenBroeckling/tirakan-essential/releases/latest/download/tirakans-reiche-essential.pdf",
  },
  {
    title: "Charakterbogen",
    file: "sheet.pdf",
    href: "https://github.com/SvenBroeckling/tirakan-essential/releases/latest/download/sheet.pdf",
  },
  {
    title: "NSC Bogen",
    file: "npc_sheet.pdf",
    href: "https://github.com/SvenBroeckling/tirakan-essential/releases/latest/download/npc_sheet.pdf",
  },
];

export default function Home() {
  return (
    <main>
      <section className="chapter-hero">
        <Container size="lg" py={{ base: 36, sm: 64 }}>
          <Stack gap="xl" className="hero-copy">
            <Stack gap="sm">
              <Title order={1} className="display-font hero-title">
                Tirakan Essential
              </Title>
              <Text className="hero-subtitle">
                Charakterbögen für dunkle Wege, alte Schulden und Namen, die man besser nur mit Hash weitergibt.
              </Text>
            </Stack>

            <Stack gap="md" className="hero-actions">
              <Group>
                <Button component={Link} href="/characters/new" color="red.9" size="md">
                  Charakter erstellen
                </Button>
              </Group>
              <HashLookup />
              <Stack gap="xs" className="release-downloads">
                <Group justify="space-between" gap="xs">
                  <Text className="download-kicker">Downloads</Text>
                </Group>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xs">
                  {downloads.map((download) => (
                    <a key={download.file} className="download-link" href={download.href}>
                      <Text fw={700}>{download.title}</Text>
                    </a>
                  ))}
                </SimpleGrid>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </section>
    </main>
  );
}
