import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";
import { HashLookup } from "@/components/HashLookup";

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
            </Stack>
          </Stack>
        </Container>
      </section>
    </main>
  );
}
