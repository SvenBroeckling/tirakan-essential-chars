"use client";

import {
  Badge,
  Button,
  Container,
  Group,
  NumberInput,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";
import { attributes, deriveValues } from "@/lib/rulebook";

type CharacterView = {
  hash: string;
  name: string;
  birthDate: string | null;
  century: number;
  campaign: string | null;
  playerName: string | null;
  concept: string;
  ancestry: string;
  ancestryCustom: boolean;
  path: string;
  pathCustom: boolean;
  bond: string;
  bondCustom: boolean;
  oathOrDebt: string | null;
  mark: string;
  attributes: Record<string, number>;
  skills: Array<{ name: string; rank: number }>;
  equipment: {
    primaryWeapon: string;
    secondaryWeapon: string;
    armor: string;
    items: string[];
  };
  supernatural: {
    focus: string;
    regenerationRitual: string;
    aspects: string[];
    spells: string[];
  };
  conditions: Record<string, number>;
  notes: string | null;
  woundThreshold: number;
  burdenThreshold: number;
  initiative: number;
  faithLevel: number;
  magicLevel: number;
  omenMax: number;
  invocationValue: number;
  favorLimit: number;
  arkanaMax: number;
  favorMax: number;
};

export function CharacterDetail({ character }: { character: CharacterView }) {
  const [draft, setDraft] = useState(character);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const derived = deriveValues({
    attributes: draft.attributes as never,
    century: draft.century,
    skills: draft.skills,
  });

  const save = async () => {
    setSaving(true);
    const response = await fetch(`/api/characters/${draft.hash}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const updated = await response.json();
    setSaving(false);
    if (response.ok) {
      setDraft(JSON.parse(JSON.stringify(updated)));
      setEditing(null);
    }
  };

  const copyHash = async () => {
    await navigator.clipboard.writeText(draft.hash);
  };

  return (
    <main className="book-page">
      <Container size="lg">
        <Stack gap="lg">
          <Group className="page-header" justify="space-between" align="start">
            <Stack gap={2}>
              <Text className="page-kicker">
                Charakterbogen
              </Text>
              <Title className="display-font page-title">{draft.name}</Title>
              <Group gap="xs">
                <Badge color="red" variant="light">
                  Hash {draft.hash}
                </Badge>
                <Button variant="subtle" size="compact-sm" onClick={copyHash}>
                  kopieren
                </Button>
              </Group>
            </Stack>
            <Group>
              <Button component={Link} href="/characters/new" variant="default">
                Neu
              </Button>
              <Button color="red.9" loading={saving} onClick={save}>
                Änderungen speichern
              </Button>
            </Group>
          </Group>

          <Paper className="book-panel" p="lg">
            <SectionTitle title="Identität" onEdit={() => setEditing("identity")} />
            {editing === "identity" ? (
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TextInput label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.currentTarget.value })} />
                <TextInput
                  label="Geburtsdatum"
                  value={draft.birthDate ?? ""}
                  onChange={(e) => setDraft({ ...draft, birthDate: e.currentTarget.value })}
                />
                <NumberInput
                  label="Jahrhundert"
                  min={1}
                  max={10}
                  value={draft.century}
                  onChange={(value) => setDraft({ ...draft, century: Number(value) || 1 })}
                />
                <TextInput
                  label="Kampagne"
                  value={draft.campaign ?? ""}
                  onChange={(e) => setDraft({ ...draft, campaign: e.currentTarget.value })}
                />
                <Textarea
                  label="Konzeptsatz"
                  value={draft.concept}
                  onChange={(e) => setDraft({ ...draft, concept: e.currentTarget.value })}
                />
                <Textarea
                  label="Schuld oder Eid"
                  value={draft.oathOrDebt ?? ""}
                  onChange={(e) => setDraft({ ...draft, oathOrDebt: e.currentTarget.value })}
                />
              </SimpleGrid>
            ) : (
              <SimpleGrid cols={{ base: 1, md: 3 }}>
                <Read label="Konzept" value={draft.concept} />
                <Read label="Geburtsdatum" value={draft.birthDate ?? "-"} />
                <Read label="Jahrhundert" value={String(draft.century)} />
                <Read label="Kampagne" value={draft.campaign ?? "-"} />
                <Read label="Spieler/in" value={draft.playerName ?? "-"} />
                <Read label="Schuld oder Eid" value={draft.oathOrDebt ?? "-"} />
              </SimpleGrid>
            )}
          </Paper>

          <SimpleGrid cols={{ base: 1, md: 3 }}>
            <Paper className="book-panel" p="lg">
              <SectionTitle title="Prägungen" onEdit={() => setEditing("marks")} />
              {editing === "marks" ? (
                <Stack>
                  <TextInput label="Abstammung" value={draft.ancestry} onChange={(e) => setDraft({ ...draft, ancestry: e.currentTarget.value, ancestryCustom: true })} />
                  <TextInput label="Weg" value={draft.path} onChange={(e) => setDraft({ ...draft, path: e.currentTarget.value, pathCustom: true })} />
                  <TextInput label="Bindung" value={draft.bond} onChange={(e) => setDraft({ ...draft, bond: e.currentTarget.value, bondCustom: true })} />
                  <TextInput label="Mal" value={draft.mark} onChange={(e) => setDraft({ ...draft, mark: e.currentTarget.value })} />
                </Stack>
              ) : (
                <Stack>
                  <Read label="Abstammung" value={draft.ancestry} custom={draft.ancestryCustom} />
                  <Read label="Weg" value={draft.path} custom={draft.pathCustom} />
                  <Read label="Bindung" value={draft.bond} custom={draft.bondCustom} />
                  <Read label="Mal" value={draft.mark} />
                </Stack>
              )}
            </Paper>

            <Paper className="book-panel" p="lg">
              <SectionTitle title="Zustand" onEdit={() => setEditing("conditions")} />
              {editing === "conditions" ? (
                <SimpleGrid cols={2}>
                  {Object.entries(draft.conditions).map(([key, value]) => (
                    <NumberInput
                      key={key}
                      label={key}
                      value={value}
                      onChange={(next) =>
                        setDraft({ ...draft, conditions: { ...draft.conditions, [key]: Number(next) || 0 } })
                      }
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid cols={2}>
                  <Read label="Wunden" value={`${draft.conditions.wounds ?? 0} / ${derived.woundThreshold}`} />
                  <Read label="Bürde" value={`${draft.conditions.burden ?? 0} / ${derived.burdenThreshold}`} />
                  <Read label="Omen" value={`${draft.conditions.omen ?? derived.omenMax} / ${derived.omenMax}`} />
                  <Read label="Arkana" value={`${draft.conditions.arkana ?? derived.arkanaMax} / ${derived.arkanaMax}`} />
                  <Read label="Gunst" value={`${draft.conditions.favor ?? derived.favorMax} / ${derived.favorMax}`} />
                  <Read label="Verderbnis" value={String(draft.conditions.corruption ?? 0)} />
                </SimpleGrid>
              )}
            </Paper>

            <Paper className="book-panel" p="lg">
              <SectionTitle title="Abgeleitet" onEdit={() => setEditing(null)} />
              <SimpleGrid cols={2}>
                <Read label="Initiative" value={String(derived.initiative)} />
                <Read label="Glaube" value={String(derived.faithLevel)} />
                <Read label="Magie" value={String(derived.magicLevel)} />
                <Read label="Anrufung" value={String(derived.invocationValue)} />
                <Read label="Gunstgrenze" value={String(derived.favorLimit)} />
              </SimpleGrid>
            </Paper>
          </SimpleGrid>

          <Paper className="book-panel" p="lg">
            <SectionTitle title="Attribute" onEdit={() => setEditing("attributes")} />
            <SimpleGrid cols={{ base: 2, sm: 4 }}>
              {attributes.map((attribute) =>
                editing === "attributes" ? (
                  <NumberInput
                    key={attribute}
                    label={attribute}
                    min={0}
                    max={3}
                    value={draft.attributes[attribute] ?? 0}
                    onChange={(value) =>
                      setDraft({ ...draft, attributes: { ...draft.attributes, [attribute]: Number(value) || 0 } })
                    }
                  />
                ) : (
                  <Read key={attribute} label={attribute} value={String(draft.attributes[attribute] ?? 0)} />
                ),
              )}
            </SimpleGrid>
          </Paper>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Paper className="book-panel" p="lg">
              <SectionTitle title="Fertigkeiten" onEdit={() => setEditing("skills")} />
              <Stack>
                {draft.skills.map((skill, index) =>
                  editing === "skills" ? (
                    <Group key={index} grow align="end">
                      <TextInput
                        label="Name"
                        value={skill.name}
                        onChange={(e) => {
                          const skills = [...draft.skills];
                          skills[index] = { ...skill, name: e.currentTarget.value };
                          setDraft({ ...draft, skills });
                        }}
                      />
                      <NumberInput
                        label="Rang"
                        min={0}
                        max={4}
                        value={skill.rank}
                        onChange={(value) => {
                          const skills = [...draft.skills];
                          skills[index] = { ...skill, rank: Number(value) || 0 };
                          setDraft({ ...draft, skills });
                        }}
                      />
                    </Group>
                  ) : (
                    <Group key={index} justify="space-between">
                      <Text>{skill.name || "-"}</Text>
                      <Badge variant="light">Rang {skill.rank}</Badge>
                    </Group>
                  ),
                )}
              </Stack>
            </Paper>

            <Paper className="book-panel" p="lg">
              <SectionTitle title="Ausrüstung" onEdit={() => setEditing("equipment")} />
              {editing === "equipment" ? (
                <Stack>
                  <TextInput
                    label="Primärwaffe"
                    value={draft.equipment.primaryWeapon}
                    onChange={(e) => setDraft({ ...draft, equipment: { ...draft.equipment, primaryWeapon: e.currentTarget.value } })}
                  />
                  <TextInput
                    label="Zweitwaffe"
                    value={draft.equipment.secondaryWeapon}
                    onChange={(e) => setDraft({ ...draft, equipment: { ...draft.equipment, secondaryWeapon: e.currentTarget.value } })}
                  />
                  <TextInput
                    label="Rüstung"
                    value={draft.equipment.armor}
                    onChange={(e) => setDraft({ ...draft, equipment: { ...draft.equipment, armor: e.currentTarget.value } })}
                  />
                  <Textarea
                    label="Gegenstände"
                    value={draft.equipment.items.join("\n")}
                    onChange={(e) => setDraft({ ...draft, equipment: { ...draft.equipment, items: e.currentTarget.value.split("\n") } })}
                  />
                </Stack>
              ) : (
                <Stack>
                  <Read label="Primärwaffe" value={draft.equipment.primaryWeapon || "-"} />
                  <Read label="Zweitwaffe" value={draft.equipment.secondaryWeapon || "-"} />
                  <Read label="Rüstung" value={draft.equipment.armor || "-"} />
                  <Read label="Gegenstände" value={draft.equipment.items.filter(Boolean).join(", ") || "-"} />
                </Stack>
              )}
            </Paper>
          </SimpleGrid>

          <Paper className="book-panel" p="lg">
            <SectionTitle title="Magie und Glaube" onEdit={() => setEditing("supernatural")} />
            {editing === "supernatural" ? (
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TextInput
                  label="Fokus"
                  value={draft.supernatural.focus}
                  onChange={(e) => setDraft({ ...draft, supernatural: { ...draft.supernatural, focus: e.currentTarget.value } })}
                />
                <TextInput
                  label="Regenerationsritual"
                  value={draft.supernatural.regenerationRitual}
                  onChange={(e) => setDraft({ ...draft, supernatural: { ...draft.supernatural, regenerationRitual: e.currentTarget.value } })}
                />
                <Textarea
                  label="Aspekte"
                  value={draft.supernatural.aspects.join("\n")}
                  onChange={(e) => setDraft({ ...draft, supernatural: { ...draft.supernatural, aspects: e.currentTarget.value.split("\n") } })}
                />
                <Textarea
                  label="Zauber"
                  value={draft.supernatural.spells.join("\n")}
                  onChange={(e) => setDraft({ ...draft, supernatural: { ...draft.supernatural, spells: e.currentTarget.value.split("\n") } })}
                />
              </SimpleGrid>
            ) : (
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Read label="Fokus" value={draft.supernatural.focus || "-"} />
                <Read label="Regenerationsritual" value={draft.supernatural.regenerationRitual || "-"} />
                <Read label="Aspekte" value={draft.supernatural.aspects.filter(Boolean).join(", ") || "-"} />
                <Read label="Zauber" value={draft.supernatural.spells.filter(Boolean).join(", ") || "-"} />
              </SimpleGrid>
            )}
          </Paper>
        </Stack>
      </Container>
    </main>
  );
}

function SectionTitle({ title, onEdit }: { title: string; onEdit: () => void }) {
  return (
    <Group className="sheet-section-header" justify="space-between" mb="md">
      <Title order={2} size="h3" className="display-font">
        {title}
      </Title>
      <button className="tiny-edit" type="button" onClick={onEdit}>
        bearbeiten
      </button>
    </Group>
  );
}

function Read({ label, value, custom }: { label: string; value: string; custom?: boolean }) {
  return (
    <Stack gap={2}>
      <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
        {label}
      </Text>
      <Text>{value}</Text>
      {custom && (
        <Badge color="red" variant="light" w="fit-content">
          frei
        </Badge>
      )}
    </Stack>
  );
}
