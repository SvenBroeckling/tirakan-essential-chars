"use client";

import { Button, Center, Container, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";

export function AppFooter({ version }: { version: string }) {
  const [opened, setOpened] = useState(false);

  return (
    <footer className="app-footer">
      <Container size="lg" py="md">
        <Center>
          <Text size="xs" c="gray.6">
            Tirakan Essential Chars v{version} ·{" "}
            <Button className="footer-contact" variant="subtle" size="compact-xs" onClick={() => setOpened(true)}>
              Kontakt
            </Button>
          </Text>
        </Center>
      </Container>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Kontakt" centered>
        <Stack gap={2}>
          <Text>Sven Bröckling</Text>
          <Text>Dullwalsweg 18</Text>
          <Text>33161 Hövelhof</Text>
          <Text component="a" href="mailto:sven@tirakan.de">
            sven@tirakan.de
          </Text>
        </Stack>
      </Modal>
    </footer>
  );
}
