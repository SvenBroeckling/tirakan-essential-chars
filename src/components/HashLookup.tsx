"use client";

import { Button, Group, TextInput } from "@mantine/core";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function HashLookup() {
  const router = useRouter();
  const [hash, setHash] = useState("");

  const openCharacter = (event: FormEvent) => {
    event.preventDefault();
    const cleanHash = hash.trim();

    if (cleanHash) {
      router.push(`/characters/${encodeURIComponent(cleanHash)}`);
    }
  };

  return (
    <form onSubmit={openCharacter}>
      <Group gap="sm" align="end" wrap="nowrap" className="hash-lookup">
        <TextInput
          label="Charakter-Hash"
          placeholder="z. B. lQrexU8nQEIN"
          value={hash}
          onChange={(event) => setHash(event.currentTarget.value)}
          classNames={{ input: "hash-input" }}
        />
        <Button type="submit" color="red.9" size="md">
          Öffnen
        </Button>
      </Group>
    </form>
  );
}
