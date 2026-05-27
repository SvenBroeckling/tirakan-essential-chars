"use client";

import {
  ActionIcon,
  Button,
  Container,
  Group,
  Modal,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ancestries,
  attributes,
  bonds,
  CharacterPayload,
  centuryLevels,
  deriveValues,
  initialAttributes,
  paths,
  wizardSteps,
} from "@/lib/rulebook";

type ChoiceField = "ancestry" | "path" | "bond";

const emptyPayload: CharacterPayload = {
  name: "",
  birthDate: "",
  century: 1,
  campaign: "",
  playerName: "",
  concept: "",
  ancestry: ancestries[0],
  ancestryCustom: false,
  path: paths[0],
  pathCustom: false,
  bond: bonds[0],
  bondCustom: false,
  oathOrDebt: "",
  attributes: initialAttributes(),
  skills: [
    { name: "", rank: 3 },
    { name: "", rank: 2 },
    { name: "", rank: 2 },
    { name: "", rank: 2 },
    { name: "", rank: 1 },
    { name: "", rank: 1 },
    { name: "", rank: 1 },
    { name: "", rank: 1 },
    { name: "", rank: 1 },
  ],
  equipment: {
    primaryWeapon: "",
    secondaryWeapon: "",
    armor: "",
    items: ["", "", ""],
  },
  supernatural: {
    focus: "",
    regenerationRitual: "",
    aspects: ["", ""],
    spells: ["", "", "", "", ""],
  },
  notes: "",
};

function setNested<T>(value: T, update: Partial<T>): T {
  return { ...value, ...update };
}

export function CharacterWizard() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [saving, setSaving] = useState(false);
  const [payload, setPayload] = useState<CharacterPayload>(emptyPayload);
  const [customField, setCustomField] = useState<ChoiceField>("ancestry");
  const [customValue, setCustomValue] = useState("");
  const [opened, modal] = useDisclosure(false);
  const derived = useMemo(() => deriveValues(payload), [payload]);
  const levels = centuryLevels[payload.century];

  const setField = <K extends keyof CharacterPayload>(key: K, value: CharacterPayload[K]) => {
    setPayload((current) => ({ ...current, [key]: value }));
  };

  const goToStep = (step: number) => {
    if (step <= maxReached) {
      setActive(step);
    }
  };

  const nextStep = () => {
    setActive((step) => {
      const next = Math.min(step + 1, wizardSteps.length - 1);
      setMaxReached((reached) => Math.max(reached, next));
      return next;
    });
  };

  const openCustom = (field: ChoiceField) => {
    setCustomField(field);
    setCustomValue("");
    modal.open();
  };

  const applyCustom = () => {
    if (!customValue.trim()) return;
    setPayload((current) => ({
      ...current,
      [customField]: customValue.trim(),
      [`${customField}Custom`]: true,
    }));
    modal.close();
  };

  const save = async () => {
    setSaving(true);
    const response = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    setSaving(false);

    if (response.ok) {
      router.push(`/characters/${result.hash}`);
    }
  };

  return (
    <main className="book-page">
      <Container size="lg">
        <Stack gap="lg">
          <Group className="page-header" justify="space-between" align="end">
            <div>
              <Text className="page-kicker">
                Tirakans Reiche
              </Text>
              <Title className="display-font page-title">Charakter erstellen</Title>
            </div>
            <Button variant="default" onClick={() => router.push("/")}>
              Zurück
            </Button>
          </Group>

          <Paper className="book-panel wizard-progress" p="md">
            <Stack align="center" gap="xs">
              <Text className="page-kicker" size="xs">
                Schritt {active + 1} von {wizardSteps.length}
              </Text>
              <Title order={2} className="display-font wizard-step-title">
                {wizardSteps[active]}
              </Title>
              <Group gap={8} mt={4} className="step-dots" justify="center">
              {wizardSteps.map((step, index) => (
                <button
                  key={step}
                  type="button"
                  className="step-dot"
                  data-active={index === active}
                  data-reached={index <= maxReached}
                  onClick={() => goToStep(index)}
                  aria-label={`Zu Schritt ${index + 1}: ${step}`}
                  title={`${index + 1}. ${step}`}
                >
                  {index + 1}
                </button>
              ))}
              </Group>
            </Stack>
          </Paper>

          <Paper className="book-panel" p="xl">
            <Group className="sheet-section-header" justify="space-between" mb="md">
              <Title order={2} size="h3" className="display-font">
                Schritt {active + 1}: {wizardSteps[active]}
              </Title>
            </Group>

            {active === 0 && (
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TextInput label="Name" value={payload.name} onChange={(e) => setField("name", e.currentTarget.value)} />
                <TextInput
                  label="Spieler/in"
                  value={payload.playerName}
                  onChange={(e) => setField("playerName", e.currentTarget.value)}
                />
                <TextInput
                  label="Kampagne"
                  value={payload.campaign}
                  onChange={(e) => setField("campaign", e.currentTarget.value)}
                />
                <Textarea
                    label="Konzeptsatz"
                    autosize
                    minRows={1}
                    value={payload.concept}
                    onChange={(e) => setField("concept", e.currentTarget.value)}
                />
                <TextInput
                  label="Geburtsdatum"
                  value={payload.birthDate}
                  onChange={(e) => setField("birthDate", e.currentTarget.value)}
                />
                <Stack gap={4}>
                  <Select
                    label="Jahrhundert"
                    data={Array.from({ length: 10 }, (_, index) => String(index + 1))}
                    value={String(payload.century)}
                    onChange={(value) => setField("century", Number(value) || 1)}
                  />
                  <Text size="sm" c="dimmed">
                    Niveaus: Glaube {levels.faith}, Magie {levels.magic}
                  </Text>
                </Stack>
              </SimpleGrid>
            )}

            {active === 1 && (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                {attributes.map((attribute) => (
                  <NumberInput
                    key={attribute}
                    label={attribute}
                    min={0}
                    max={3}
                    value={payload.attributes[attribute]}
                    onChange={(value) =>
                      setField("attributes", { ...payload.attributes, [attribute]: Number(value) || 0 })
                    }
                  />
                ))}
              </SimpleGrid>
            )}

            {active === 2 && (
              <Stack>
                <Text size="sm" c="dimmed">
                  Verteile eine Fertigkeit auf Rang 3, drei auf Rang 2 und fünf auf Rang 1.
                </Text>
                {payload.skills.map((skill, index) => (
                  <Group key={index} grow align="end">
                    <TextInput
                      label={`Fertigkeit ${index + 1}`}
                      value={skill.name}
                      onChange={(event) => {
                        const skills = [...payload.skills];
                        skills[index] = { ...skill, name: event.currentTarget.value };
                        setField("skills", skills);
                      }}
                    />
                    <NumberInput
                      label="Rang"
                      min={0}
                      max={4}
                      value={skill.rank}
                      onChange={(value) => {
                        const skills = [...payload.skills];
                        skills[index] = { ...skill, rank: Number(value) || 0 };
                        setField("skills", skills);
                      }}
                    />
                  </Group>
                ))}
              </Stack>
            )}

            {active === 3 && (
              <SimpleGrid cols={{ base: 1, md: 3 }}>
                <ChoiceSelect
                  label="Abstammung"
                  value={payload.ancestry}
                  data={ancestries}
                  custom={payload.ancestryCustom}
                  onChange={(value) => setPayload((current) => ({ ...current, ancestry: value, ancestryCustom: false }))}
                  onCustom={() => openCustom("ancestry")}
                />
                <ChoiceSelect
                  label="Weg"
                  value={payload.path}
                  data={paths}
                  custom={payload.pathCustom}
                  onChange={(value) => setPayload((current) => ({ ...current, path: value, pathCustom: false }))}
                  onCustom={() => openCustom("path")}
                />
                <ChoiceSelect
                  label="Bindung"
                  value={payload.bond}
                  data={bonds}
                  custom={payload.bondCustom}
                  onChange={(value) => setPayload((current) => ({ ...current, bond: value, bondCustom: false }))}
                  onCustom={() => openCustom("bond")}
                />
              </SimpleGrid>
            )}

            {active === 4 && (
              <Textarea
                label="Schuld oder Eid"
                autosize
                minRows={5}
                value={payload.oathOrDebt}
                onChange={(e) => setField("oathOrDebt", e.currentTarget.value)}
              />
            )}

            {active === 5 && (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }}>
                {Object.entries(derived).map(([key, value]) => (
                  <Paper key={key} className="stat-card" withBorder p="md" radius={6}>
                    <Text size="sm" c="dimmed">
                      {key}
                    </Text>
                    <Text fz="xl" fw={700}>
                      {value}
                    </Text>
                  </Paper>
                ))}
              </SimpleGrid>
            )}

            {active === 6 && (
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TextInput
                  label="Primärwaffe"
                  value={payload.equipment.primaryWeapon}
                  onChange={(e) =>
                    setField("equipment", setNested(payload.equipment, { primaryWeapon: e.currentTarget.value }))
                  }
                />
                <TextInput
                  label="Zweitwaffe"
                  value={payload.equipment.secondaryWeapon}
                  onChange={(e) =>
                    setField("equipment", setNested(payload.equipment, { secondaryWeapon: e.currentTarget.value }))
                  }
                />
                <TextInput
                  label="Rüstung"
                  value={payload.equipment.armor}
                  onChange={(e) => setField("equipment", setNested(payload.equipment, { armor: e.currentTarget.value }))}
                />
                {payload.equipment.items.map((item, index) => (
                  <TextInput
                    key={index}
                    label={`Gebrauchsgegenstand ${index + 1}`}
                    value={item}
                    onChange={(e) => {
                      const items = [...payload.equipment.items];
                      items[index] = e.currentTarget.value;
                      setField("equipment", setNested(payload.equipment, { items }));
                    }}
                  />
                ))}
              </SimpleGrid>
            )}

            {active === 7 && (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                <Paper className="stat-card" withBorder p="md" radius={6}>
                  <Text>Wunden 0 / {derived.woundThreshold}</Text>
                </Paper>
                <Paper className="stat-card" withBorder p="md" radius={6}>
                  <Text>Bürde 0 / {derived.burdenThreshold}</Text>
                </Paper>
                <Paper className="stat-card" withBorder p="md" radius={6}>
                  <Text>Omen {derived.omenMax}</Text>
                </Paper>
                <Paper className="stat-card" withBorder p="md" radius={6}>
                  <Text>Arkana {derived.arkanaMax}</Text>
                </Paper>
                <Paper className="stat-card" withBorder p="md" radius={6}>
                  <Text>Gunst {derived.favorMax}</Text>
                </Paper>
                <Paper className="stat-card" withBorder p="md" radius={6}>
                  <Text>Verderbnis 0, Mal keins</Text>
                </Paper>
              </SimpleGrid>
            )}

            {active === 8 && (
              <Stack>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <TextInput
                    label="Fokus"
                    value={payload.supernatural.focus}
                    onChange={(e) =>
                      setField("supernatural", setNested(payload.supernatural, { focus: e.currentTarget.value }))
                    }
                  />
                  <TextInput
                    label="Regenerationsritual"
                    value={payload.supernatural.regenerationRitual}
                    onChange={(e) =>
                      setField("supernatural", setNested(payload.supernatural, { regenerationRitual: e.currentTarget.value }))
                    }
                  />
                  {payload.supernatural.aspects.map((aspect, index) => (
                    <TextInput
                      key={index}
                      label={`Aspekt ${index + 1}`}
                      value={aspect}
                      onChange={(e) => {
                        const aspects = [...payload.supernatural.aspects];
                        aspects[index] = e.currentTarget.value;
                        setField("supernatural", setNested(payload.supernatural, { aspects }));
                      }}
                    />
                  ))}
                </SimpleGrid>
                <Textarea
                  label="Zauber und Rituale"
                  value={payload.supernatural.spells.join("\n")}
                  onChange={(e) =>
                    setField("supernatural", setNested(payload.supernatural, { spells: e.currentTarget.value.split("\n") }))
                  }
                />
              </Stack>
            )}
          </Paper>

          <Group justify="space-between">
            <Button variant="default" disabled={active === 0} onClick={() => setActive((step) => step - 1)}>
              Zurück
            </Button>
            {active < wizardSteps.length - 1 ? (
              <Button color="red.9" onClick={nextStep}>
                Weiter
              </Button>
            ) : (
              <Button color="red.9" loading={saving} onClick={save}>
                Speichern
              </Button>
            )}
          </Group>
        </Stack>
      </Container>

      <Modal opened={opened} onClose={modal.close} title="Eigene Prägung">
        <Stack>
          <TextInput label="Eigener Wert" value={customValue} onChange={(e) => setCustomValue(e.currentTarget.value)} />
          <Button color="red.9" onClick={applyCustom}>
            Übernehmen
          </Button>
        </Stack>
      </Modal>
    </main>
  );
}

function ChoiceSelect({
  label,
  value,
  data,
  custom,
  onChange,
  onCustom,
}: {
  label: string;
  value: string;
  data: string[];
  custom: boolean;
  onChange: (value: string) => void;
  onCustom: () => void;
}) {
  return (
    <Group align="end" gap="xs" wrap="nowrap">
      <Select
        label={label}
        data={custom ? [value, ...data] : data}
        value={value}
        searchable
        onChange={(next) => next && onChange(next)}
        style={{ flex: 1 }}
      />
      <ActionIcon aria-label={`${label} selbst eingeben`} variant="default" size={36} onClick={onCustom}>
        +
      </ActionIcon>
    </Group>
  );
}
