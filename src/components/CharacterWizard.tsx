"use client";

import {
  ActionIcon,
  Autocomplete,
  Button,
  Container,
  Group,
  Modal,
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
import { AttributeRow, attributeValues } from "@/components/AttributeRows";
import { armorRules, ArmorRule, weaponRules, WeaponRule } from "@/lib/equipmentRules";
import { magicAspectRules, SpellRule, spellRules } from "@/lib/magicRules";
import { ancestryRules, bondRules, MarkRule, pathRules } from "@/lib/markRules";
import {
  ancestries,
  attributes,
  AttributeName,
  bonds,
  CharacterPayload,
  centuryLevels,
  deriveValues,
  initialAttributes,
  paths,
  wizardSteps,
} from "@/lib/rulebook";

type ChoiceField = "ancestry" | "path" | "bond" | "primaryWeapon" | "secondaryWeapon" | "armor";

const attributeTargets: Record<0 | 1 | 2 | 3, number> = {
  0: 2,
  1: 3,
  2: 2,
  3: 1,
};

const attributeTargetLabels: Record<0 | 1 | 2 | 3, string> = {
  0: "Zwei Attribute auf 0",
  1: "Drei Attribute auf 1",
  2: "Zwei Attribute auf 2",
  3: "Ein Attribut auf 3",
};

const attributeRuleOrder = [3, 2, 1, 0] as const;
const validAttributeValues = [3, 2, 2, 1, 1, 1, 0, 0] as const;

const startingSkillRanks = [1, 1, 1, 1, 1, 1, 1, 1, 1];
const validSkillRanks = [3, 2, 2, 2, 1, 1, 1, 1, 1] as const;
const skillRankValues = [1, 2, 3] as const;
const skillRuleOrder = [3, 2, 1] as const;
const skillTargetLabels: Record<1 | 2 | 3, string> = {
  1: "Alle übrigen Fertigkeiten auf Rang 1",
  2: "Drei Fertigkeiten auf Rang 2",
  3: "Eine Fertigkeit auf Rang 3",
};

const randomNames = ["Arel von Bayard", "Mara Schattenhain", "Joran Aschpfad", "Selka Rotmund"];
const randomConcepts = [
  "Ein ehemaliger Soldat, der einen alten Eid nicht loswird.",
  "Eine Kräuterkundige mit Wissen über verbotene Rituale.",
  "Ein abtrünniger Inquisitor auf der Suche nach Vergebung.",
  "Eine fahrende Händlerin mit Schulden bei den falschen Leuten.",
];
const tirakanMonths = [
  "Schneemond",
  "Festmond",
  "Frühlingsmond",
  "Hagelmond",
  "Lebensmond",
  "Sommermond",
  "Obstmond",
  "Haumond",
  "Herbstmond",
  "Weinmond",
  "Nebelmond",
  "Wintermond",
] as const;
const randomOaths = [
  "Ich schulde einem alten Lehrmeister ein Leben.",
  "Ich habe geschworen, eine verlorene Familie wiederzufinden.",
  "Ich darf den Namen eines Toten nicht vergessen.",
  "Ich habe eine Schuld gegenüber meiner letzten Gemeinschaft.",
];
const randomItems = [
  ["Seil", "Zunderkasten", "Wasserschlauch"],
  ["Laterne", "Kreide", "Decke"],
  ["Haken", "Verbände", "Trockenfleisch"],
];
const randomFoci = ["Geschwärzter Ring", "Knochenamulett", "Alte Münze"];
const randomRegenerationRituals = [
  "Stille Wache vor Morgengrauen",
  "Asche und Salz erneuern",
  "Namen der Toten murmeln",
];

function pathSkillOptions(pathName: string) {
  const skills = pathRules.find((rule) => rule.name === pathName)?.skills;
  if (!skills) return [];

  return Array.from(new Set(skills.split(",").map((skill) => skill.trim()).filter(Boolean)));
}

function startingSkillsForPath(pathName: string) {
  const options = pathSkillOptions(pathName);

  return startingSkillRanks.map((rank, index) => ({
    name: options[index] ?? "",
    rank,
  }));
}

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
  skills: startingSkillsForPath(paths[0]),
  equipment: {
    primaryWeapon: "",
    secondaryWeapon: "",
    armor: "",
    items: ["", "", ""],
    customWeapons: {},
    customArmors: {},
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

function shuffled<T>(values: readonly T[]) {
  const copy = [...values];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function randomItem<T>(values: readonly T[]) {
  return values[Math.floor(Math.random() * values.length)];
}

function validateAttributes(selected: Record<AttributeName, number>) {
  const counts = attributeValues.reduce(
    (acc, value) => ({ ...acc, [value]: attributes.filter((attribute) => selected[attribute] === value).length }),
    {} as Record<0 | 1 | 2 | 3, number>,
  );

  const valid = attributeValues.every((value) => counts[value] === attributeTargets[value]);
  return { counts, valid };
}

function validateSkills(skills: CharacterPayload["skills"]) {
  const targets: Record<1 | 2 | 3, number> = {
    1: Math.max(skills.length - 4, 0),
    2: 3,
    3: 1,
  };
  const counts = skillRankValues.reduce(
    (acc, value) => ({ ...acc, [value]: skills.filter((skill) => skill.rank === value).length }),
    {} as Record<1 | 2 | 3, number>,
  );
  const validRanks = skills.every((skill) => skillRankValues.includes(skill.rank as 1 | 2 | 3));
  const valid = validRanks && skillRankValues.every((value) => counts[value] === targets[value]);

  return { counts, targets, valid };
}

function magicSlots(gift: number) {
  return {
    aspects: gift <= 0 ? 0 : gift === 1 ? 1 : 2,
    spells: gift <= 0 ? 0 : Math.min(gift + 2, 5),
  };
}

function resizeValues(values: string[], size: number) {
  return Array.from({ length: size }, (_, index) => values[index] ?? "");
}

function normalizeMagicPayload(payload: CharacterPayload): CharacterPayload {
  const gift = payload.attributes.gift ?? 0;
  const slots = magicSlots(gift);

  return {
    ...payload,
    supernatural: {
      focus: slots.aspects > 0 ? payload.supernatural.focus : "",
      regenerationRitual: slots.aspects > 0 ? payload.supernatural.regenerationRitual : "",
      aspects: resizeValues(payload.supernatural.aspects, slots.aspects).filter(Boolean),
      spells: resizeValues(payload.supernatural.spells, slots.spells).filter(Boolean),
    },
  };
}

export function CharacterWizard() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [saving, setSaving] = useState(false);
  const [payload, setPayload] = useState<CharacterPayload>(emptyPayload);
  const [customField, setCustomField] = useState<ChoiceField>("ancestry");
  const [customValue, setCustomValue] = useState("");
  const [customWeapon, setCustomWeapon] = useState({ damage: "", range: "", grip: "", properties: "" });
  const [customArmor, setCustomArmor] = useState({ protection: "", load: "", sealing: "", properties: "" });
  const [attributeAttempted, setAttributeAttempted] = useState(false);
  const [skillAttempted, setSkillAttempted] = useState(false);
  const [opened, modal] = useDisclosure(false);
  const derived = useMemo(() => deriveValues(payload), [payload]);
  const attributeValidation = useMemo(() => validateAttributes(payload.attributes), [payload.attributes]);
  const skillValidation = useMemo(() => validateSkills(payload.skills), [payload.skills]);
  const selectedAncestryRule = useMemo(
    () => ancestryRules.find((rule) => rule.name === payload.ancestry),
    [payload.ancestry],
  );
  const selectedPathRule = useMemo(() => pathRules.find((rule) => rule.name === payload.path), [payload.path]);
  const selectedBondRule = useMemo(() => bondRules.find((rule) => rule.name === payload.bond), [payload.bond]);
  const selectedPathSkillOptions = useMemo(() => pathSkillOptions(payload.path), [payload.path]);
  const selectedPrimaryWeaponRule = useMemo(
    () =>
      weaponRules.find((rule) => rule.name === payload.equipment.primaryWeapon) ??
      payload.equipment.customWeapons?.[payload.equipment.primaryWeapon],
    [payload.equipment.customWeapons, payload.equipment.primaryWeapon],
  );
  const selectedSecondaryWeaponRule = useMemo(
    () =>
      weaponRules.find((rule) => rule.name === payload.equipment.secondaryWeapon) ??
      payload.equipment.customWeapons?.[payload.equipment.secondaryWeapon],
    [payload.equipment.customWeapons, payload.equipment.secondaryWeapon],
  );
  const selectedArmorRule = useMemo(
    () =>
      armorRules.find((rule) => rule.name === payload.equipment.armor) ??
      payload.equipment.customArmors?.[payload.equipment.armor],
    [payload.equipment.armor, payload.equipment.customArmors],
  );
  const weaponOptions = useMemo(() => weaponRules.map((rule) => rule.name), []);
  const armorOptions = useMemo(() => armorRules.map((rule) => rule.name), []);
  const aspectOptions = useMemo(() => magicAspectRules.map((rule) => rule.name), []);
  const levels = centuryLevels[payload.century];
  const gift = payload.attributes.gift ?? 0;
  const slots = magicSlots(gift);
  const finalStep = gift > 0 ? wizardSteps.length - 1 : wizardSteps.length - 2;
  const aspectValues = resizeValues(payload.supernatural.aspects, slots.aspects);
  const spellValues = resizeValues(payload.supernatural.spells, slots.spells);
  const selectedAspectRules = aspectValues
    .map((aspect) => magicAspectRules.find((rule) => rule.name === aspect))
    .filter((rule): rule is (typeof magicAspectRules)[number] => Boolean(rule));
  const selectedSpellRules = spellValues
    .map((spell) => spellRules.find((rule) => rule.name === spell))
    .filter((rule): rule is SpellRule => Boolean(rule));
  const spellOptions = useMemo(() => {
    const selectedAspects = aspectValues.filter(Boolean);
    const options = selectedAspects.length
      ? spellRules.filter((rule) => selectedAspects.includes(rule.aspect))
      : spellRules;

    return options.map((rule) => rule.name);
  }, [aspectValues]);

  const setField = <K extends keyof CharacterPayload>(key: K, value: CharacterPayload[K]) => {
    setPayload((current) => ({ ...current, [key]: value }));
  };

  const randomizeAttributes = () => {
    const values = shuffled(validAttributeValues);
    setField(
      "attributes",
      attributes.reduce(
        (next, attribute, index) => ({ ...next, [attribute]: values[index] }),
        {} as CharacterPayload["attributes"],
      ),
    );
    setAttributeAttempted(false);
  };

  const randomizeSkills = () => {
    const ranks = shuffled(validSkillRanks);
    setField(
      "skills",
      payload.skills.map((skill, index) => ({ ...skill, rank: ranks[index] ?? 1 })),
    );
    setSkillAttempted(false);
  };

  const randomizeCurrentStep = () => {
    if (active === 0) {
      const century = Math.floor(Math.random() * 10) + 1;
      const year = (century - 1) * 100 + Math.floor(Math.random() * 100) + 1;
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      setPayload((current) => ({
        ...current,
        name: randomItem(randomNames),
        concept: randomItem(randomConcepts),
        century,
        birthDate: `${day}. ${tirakanMonths[month - 1]} ${year}`,
      }));
      return;
    }

    if (active === 1) {
      randomizeAttributes();
      return;
    }

    if (active === 2) {
      const path = randomItem(paths);
      setPayload((current) => ({
        ...current,
        ancestry: randomItem(ancestries),
        ancestryCustom: false,
        path,
        pathCustom: false,
        bond: randomItem(bonds),
        bondCustom: false,
        skills: startingSkillsForPath(path),
      }));
      return;
    }

    if (active === 3) {
      randomizeSkills();
      return;
    }

    if (active === 4) {
      setField("oathOrDebt", randomItem(randomOaths));
      return;
    }

    if (active === 5) {
      setField("equipment", {
        primaryWeapon: randomItem(weaponRules).name,
        secondaryWeapon: randomItem(weaponRules).name,
        armor: randomItem(armorRules).name,
        items: randomItem(randomItems),
      });
      return;
    }

    if (active === 6) {
      const aspects = shuffled(magicAspectRules).slice(0, slots.aspects).map((rule) => rule.name);
      const spells = shuffled(spellRules.filter((rule) => aspects.includes(rule.aspect)))
        .slice(0, slots.spells)
        .map((rule) => rule.name);

      setField("supernatural", {
        focus: randomItem(randomFoci),
        regenerationRitual: randomItem(randomRegenerationRituals),
        aspects,
        spells,
      });
    }
  };

  const stepAvailable = (step: number) => step <= finalStep;

  const goToStep = (step: number) => {
    if (!stepAvailable(step)) {
      return;
    }

    if (active === 1 && step > active && !attributeValidation.valid) {
      setAttributeAttempted(true);
      return;
    }

    if (active === 3 && step > active && !skillValidation.valid) {
      setSkillAttempted(true);
      return;
    }

    if (step <= maxReached) {
      setActive(step);
    }
  };

  const nextStep = () => {
    if (active === 1 && !attributeValidation.valid) {
      setAttributeAttempted(true);
      return;
    }

    if (active === 3 && !skillValidation.valid) {
      setSkillAttempted(true);
      return;
    }

    setActive((step) => {
      const next = Math.min(step + 1, finalStep);
      setMaxReached((reached) => Math.max(reached, next));
      return next;
    });
  };

  const openCustom = (field: ChoiceField) => {
    setCustomField(field);
    setCustomValue("");
    setCustomWeapon({ damage: "", range: "", grip: "", properties: "" });
    setCustomArmor({ protection: "", load: "", sealing: "", properties: "" });
    modal.open();
  };

  const applyCustom = () => {
    if (!customValue.trim()) return;
    const nextValue = customValue.trim();
    setPayload((current) => ({
      ...current,
      [customField]: nextValue,
      [`${customField}Custom`]: true,
      ...(customField === "path" ? { skills: startingSkillsForPath(nextValue) } : {}),
      ...(customField === "primaryWeapon"
        ? {
            equipment: {
              ...current.equipment,
              primaryWeapon: nextValue,
              customWeapons: {
                ...(current.equipment.customWeapons ?? {}),
                [nextValue]: { name: nextValue, ...customWeapon },
              },
            },
          }
        : {}),
      ...(customField === "secondaryWeapon"
        ? {
            equipment: {
              ...current.equipment,
              secondaryWeapon: nextValue,
              customWeapons: {
                ...(current.equipment.customWeapons ?? {}),
                [nextValue]: { name: nextValue, ...customWeapon },
              },
            },
          }
        : {}),
      ...(customField === "armor"
        ? {
            equipment: {
              ...current.equipment,
              armor: nextValue,
              customArmors: {
                ...(current.equipment.customArmors ?? {}),
                [nextValue]: { name: nextValue, ...customArmor },
              },
            },
          }
        : {}),
    }));
    modal.close();
  };

  const save = async () => {
    setSaving(true);
    const nextPayload = normalizeMagicPayload(payload);
    const response = await fetch("/api/characters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextPayload),
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
                  data-reached={index <= maxReached && stepAvailable(index)}
                  disabled={!stepAvailable(index)}
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
            <Group className="sheet-section-header" justify="space-between" align="start" mb="md">
              <Stack gap={4}>
                <Title order={2} size="h3" className="display-font">
                  Schritt {active + 1}: {wizardSteps[active]}
                </Title>
                {active === 1 && (
                  <DistributionRules
                    rules={attributeRuleOrder.map((value) => ({
                      label: attributeTargetLabels[value],
                      valid: attributeValidation.counts[value] === attributeTargets[value],
                    }))}
                    error={
                      attributeAttempted && !attributeValidation.valid
                        ? "Wähle genau ein Attribut auf 3, zwei auf 2, drei auf 1 und zwei auf 0."
                        : undefined
                    }
                  />
                )}
                {active === 3 && (
                  <DistributionRules
                    rules={skillRuleOrder.map((value) => ({
                      label: skillTargetLabels[value],
                      valid: skillValidation.counts[value] === skillValidation.targets[value],
                    }))}
                    error={
                      skillAttempted && !skillValidation.valid
                        ? "Wähle genau eine Fertigkeit auf Rang 3, drei auf Rang 2 und alle übrigen auf Rang 1."
                        : undefined
                    }
                  />
                )}
              </Stack>
              <Button variant="default" size="compact-sm" onClick={randomizeCurrentStep}>
                Zufällig
              </Button>
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
              <Stack gap="md">
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  {attributes.map((attribute) => (
                    <AttributeRow
                      key={attribute}
                      attribute={attribute}
                      value={payload.attributes[attribute]}
                      onChange={(value) =>
                        setField("attributes", { ...payload.attributes, [attribute]: value })
                      }
                    />
                  ))}
                </SimpleGrid>
              </Stack>
            )}

            {active === 2 && (
              <Stack gap="md">
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
                    onChange={(value) =>
                      setPayload((current) => ({
                        ...current,
                        path: value,
                        pathCustom: false,
                        skills: startingSkillsForPath(value),
                      }))
                    }
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
                <SimpleGrid cols={{ base: 1, md: 3 }}>
                  <MarkRuleCard title="Abstammung" name={payload.ancestry} rule={selectedAncestryRule} />
                  <MarkRuleCard title="Weg" name={payload.path} rule={selectedPathRule} showFacet />
                  <MarkRuleCard title="Bindung" name={payload.bond} rule={selectedBondRule} />
                </SimpleGrid>
              </Stack>
            )}

            {active === 3 && (
              <Stack gap="md">
                {payload.skills.map((skill, index) => (
                  <div key={index} className="skill-row">
                    <Autocomplete
                      label={`Fertigkeit ${index + 1}`}
                      data={selectedPathSkillOptions}
                      value={skill.name}
                      onChange={(value) => {
                        const skills = [...payload.skills];
                        skills[index] = { ...skill, name: value };
                        setField("skills", skills);
                      }}
                    />
                    <SkillRankSelector
                      value={skill.rank}
                      onChange={(rank) => {
                        const skills = [...payload.skills];
                        skills[index] = { ...skill, rank };
                        setField("skills", skills);
                      }}
                    />
                  </div>
                ))}
              </Stack>
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
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Stack gap="xs">
                  <EquipmentSelect
                    label="Primärwaffe"
                    data={weaponOptions}
                    value={payload.equipment.primaryWeapon}
                    onChange={(value) =>
                      setField("equipment", setNested(payload.equipment, { primaryWeapon: value }))
                    }
                    onCustom={() => openCustom("primaryWeapon")}
                  />
                  <WeaponRuleSummary rule={selectedPrimaryWeaponRule} />
                </Stack>
                <Stack gap="xs">
                  <EquipmentSelect
                    label="Zweitwaffe"
                    data={weaponOptions}
                    value={payload.equipment.secondaryWeapon}
                    onChange={(value) =>
                      setField("equipment", setNested(payload.equipment, { secondaryWeapon: value }))
                    }
                    onCustom={() => openCustom("secondaryWeapon")}
                  />
                  <WeaponRuleSummary rule={selectedSecondaryWeaponRule} />
                </Stack>
                <Stack gap="xs">
                  <EquipmentSelect
                    label="Rüstung"
                    data={armorOptions}
                    value={payload.equipment.armor}
                    onChange={(value) => setField("equipment", setNested(payload.equipment, { armor: value }))}
                    onCustom={() => openCustom("armor")}
                  />
                  <ArmorRuleSummary rule={selectedArmorRule} />
                </Stack>
                <Stack gap="xs" className="equipment-items">
                  <Group justify="space-between" align="end">
                    <Text size="sm" fw={700} c="var(--ink)">
                      Gebrauchsgegenstände
                    </Text>
                    <Button
                      variant="default"
                      size="compact-sm"
                      onClick={() =>
                        setField("equipment", setNested(payload.equipment, { items: [...payload.equipment.items, ""] }))
                      }
                    >
                      Hinzufügen
                    </Button>
                  </Group>
                  {payload.equipment.items.map((item, index) => (
                    <Group key={index} align="end" gap="xs" wrap="nowrap">
                      <TextInput
                        label={`Gegenstand ${index + 1}`}
                        value={item}
                        onChange={(e) => {
                          const items = [...payload.equipment.items];
                          items[index] = e.currentTarget.value;
                          setField("equipment", setNested(payload.equipment, { items }));
                        }}
                        style={{ flex: 1 }}
                      />
                      <ActionIcon
                        aria-label={`Gegenstand ${index + 1} entfernen`}
                        variant="default"
                        size={36}
                        disabled={payload.equipment.items.length === 1}
                        onClick={() => {
                          const items = payload.equipment.items.filter((_, itemIndex) => itemIndex !== index);
                          setField("equipment", setNested(payload.equipment, { items }));
                        }}
                      >
                        -
                      </ActionIcon>
                    </Group>
                  ))}
                </Stack>
              </SimpleGrid>
            )}

            {active === 6 && (
              <Stack gap="md">
                <Paper className="magic-form-section" withBorder p="md" radius={6}>
                  <Stack gap="md">
                    <Text size="sm" fw={700}>
                      Praxis
                    </Text>
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
                    </SimpleGrid>
                  </Stack>
                </Paper>

                <Paper className="magic-form-section" withBorder p="md" radius={6}>
                  <Stack gap="md">
                    <Group justify="space-between" align="baseline">
                      <Text size="sm" fw={700}>
                        Aspekte
                      </Text>
                      <Text size="xs" c="dimmed" fw={700}>
                        {slots.aspects} erlaubt
                      </Text>
                    </Group>
                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                      {aspectValues.map((aspect, index) => (
                        <Select
                          key={index}
                          label={`Aspekt ${index + 1}`}
                          data={aspectOptions}
                          value={aspect || null}
                          searchable
                          onChange={(value) => {
                            const aspects = [...aspectValues];
                            aspects[index] = value ?? "";
                            const allowedSpellNames = new Set(
                              spellRules.filter((rule) => aspects.includes(rule.aspect)).map((rule) => rule.name),
                            );
                            setField(
                              "supernatural",
                              setNested(payload.supernatural, {
                                aspects,
                                spells: spellValues.map((spell) => (allowedSpellNames.has(spell) ? spell : "")),
                              }),
                            );
                          }}
                        />
                      ))}
                    </SimpleGrid>
                    {selectedAspectRules.length > 0 && (
                      <SimpleGrid cols={{ base: 1, md: 2 }}>
                        {selectedAspectRules.map((rule) => (
                          <MagicAspectRuleCard key={rule.name} rule={rule} />
                        ))}
                      </SimpleGrid>
                    )}
                  </Stack>
                </Paper>

                <Paper className="magic-form-section" withBorder p="md" radius={6}>
                  <Stack gap="md">
                    <Group justify="space-between" align="baseline">
                      <Text size="sm" fw={700}>
                        Zauber
                      </Text>
                      <Text size="xs" c="dimmed" fw={700}>
                        {slots.spells} erlaubt
                      </Text>
                    </Group>
                    <SimpleGrid cols={{ base: 1, md: 2 }}>
                      {spellValues.map((spell, index) => (
                        <Select
                          key={index}
                          label={`Zauber ${index + 1}`}
                          data={spellOptions}
                          value={spell || null}
                          searchable
                          onChange={(value) => {
                            const spells = [...spellValues];
                            spells[index] = value ?? "";
                            setField("supernatural", setNested(payload.supernatural, { spells }));
                          }}
                        />
                      ))}
                    </SimpleGrid>
                    {selectedSpellRules.length > 0 && (
                      <Stack gap="xs">
                        {selectedSpellRules.map((rule) => (
                          <SpellRuleSummary key={`${rule.aspect}-${rule.name}`} rule={rule} />
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Paper>
              </Stack>
            )}
          </Paper>

          <Group justify="space-between">
            <Button variant="default" disabled={active === 0} onClick={() => setActive((step) => step - 1)}>
              Zurück
            </Button>
            {active < finalStep ? (
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

      <Modal opened={opened} onClose={modal.close} title={equipmentCustomField(customField) ? "Eigene Ausrüstung" : "Eigene Prägung"}>
        <Stack>
          <TextInput label="Name" value={customValue} onChange={(e) => setCustomValue(e.currentTarget.value)} />
          {weaponCustomField(customField) && (
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="Schaden"
                value={customWeapon.damage}
                onChange={(e) => setCustomWeapon({ ...customWeapon, damage: e.currentTarget.value })}
              />
              <TextInput
                label="Reichweite"
                value={customWeapon.range}
                onChange={(e) => setCustomWeapon({ ...customWeapon, range: e.currentTarget.value })}
              />
              <TextInput
                label="Griff"
                value={customWeapon.grip}
                onChange={(e) => setCustomWeapon({ ...customWeapon, grip: e.currentTarget.value })}
              />
              <TextInput
                label="Eigenschaften"
                value={customWeapon.properties}
                onChange={(e) => setCustomWeapon({ ...customWeapon, properties: e.currentTarget.value })}
              />
            </SimpleGrid>
          )}
          {customField === "armor" && (
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="Schutz"
                value={customArmor.protection}
                onChange={(e) => setCustomArmor({ ...customArmor, protection: e.currentTarget.value })}
              />
              <TextInput
                label="Last"
                value={customArmor.load}
                onChange={(e) => setCustomArmor({ ...customArmor, load: e.currentTarget.value })}
              />
              <TextInput
                label="Versiegelung"
                value={customArmor.sealing}
                onChange={(e) => setCustomArmor({ ...customArmor, sealing: e.currentTarget.value })}
              />
              <TextInput
                label="Eigenschaften"
                value={customArmor.properties}
                onChange={(e) => setCustomArmor({ ...customArmor, properties: e.currentTarget.value })}
              />
            </SimpleGrid>
          )}
          <Button color="red.9" onClick={applyCustom}>
            Übernehmen
          </Button>
        </Stack>
      </Modal>
    </main>
  );
}

function weaponCustomField(field: ChoiceField) {
  return field === "primaryWeapon" || field === "secondaryWeapon";
}

function equipmentCustomField(field: ChoiceField) {
  return weaponCustomField(field) || field === "armor";
}

function MarkRuleCard({
  title,
  name,
  rule,
  showFacet,
}: {
  title: string;
  name: string;
  rule?: MarkRule;
  showFacet?: boolean;
}) {
  return (
    <Paper className="mark-rule-card" withBorder p="md" radius={6}>
      <Stack gap="xs">
        <div>
          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
            {title}
          </Text>
          <Text fw={700}>{name}</Text>
        </div>
        {rule ? (
          <>
            <RuleLine label="Vorteil" value={rule.benefit} />
            <RuleLine label="Verwundbarkeit" value={rule.vulnerability} />
            {showFacet && <RuleLine label="Wegfacette" value={rule.facet} />}
            <RuleLine label="Fertigkeiten" value={rule.skills} />
          </>
        ) : <></>}
      </Stack>
    </Paper>
  );
}

function DistributionRules({
  rules,
  error,
}: {
  rules: Array<{ label: string; valid: boolean }>;
  error?: string;
}) {
  return (
    <Stack gap={3} className="distribution-rules">
      <Group gap="xs">
        {rules.map((rule) => (
          <Text key={rule.label} size="xs" data-valid={rule.valid}>
            {rule.label}
          </Text>
        ))}
      </Group>
      {error && (
        <Text size="xs" className="distribution-error">
          {error}
        </Text>
      )}
    </Stack>
  );
}

function WeaponRuleSummary({ rule }: { rule?: WeaponRule }) {
  if (!rule) {
    return <></>;
  }

  return (
    <Paper className="equipment-rule-card" withBorder p="sm" radius={6}>
      <SimpleGrid cols={2}>
        <ReadRule label="Schaden" value={rule.damage} />
        <ReadRule label="Reichweite" value={rule.range} />
        <ReadRule label="Griff" value={rule.grip} />
        <ReadRule label="Eigenschaften" value={rule.properties} />
      </SimpleGrid>
    </Paper>
  );
}

function ArmorRuleSummary({ rule }: { rule?: ArmorRule }) {
  if (!rule) {
    return <></>;
  }

  return (
    <Paper className="equipment-rule-card" withBorder p="sm" radius={6}>
      <SimpleGrid cols={2}>
        <ReadRule label="Schutz" value={rule.protection} />
        <ReadRule label="Last" value={rule.load} />
        <ReadRule label="Versiegelung" value={rule.sealing} />
        <ReadRule label="Eigenschaften" value={rule.properties} />
      </SimpleGrid>
    </Paper>
  );
}

function MagicAspectRuleCard({ rule }: { rule: (typeof magicAspectRules)[number] }) {
  return (
    <Paper className="mark-rule-card" withBorder p="md" radius={6}>
      <Stack gap="xs">
        <div>
          <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
            Aspekt
          </Text>
          <Text fw={700}>{rule.name}</Text>
        </div>
        <Text size="sm">{rule.description}</Text>
      </Stack>
    </Paper>
  );
}

function SpellRuleSummary({ rule }: { rule: SpellRule }) {
  return (
    <Paper className="equipment-rule-card" withBorder p="sm" radius={6}>
      <Stack gap="xs">
        <Group justify="space-between" gap="xs" align="start">
          <div>
            <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
              {rule.aspect}
            </Text>
            <Text fw={700}>{rule.name}</Text>
          </div>
          <Text size="sm" fw={700}>
            MW {rule.minimumRoll}
          </Text>
        </Group>
        <SimpleGrid cols={{ base: 2, md: 4 }}>
          <ReadRule label="Art" value={rule.category} />
          <ReadRule label="Element" value={rule.element} />
          <ReadRule label="Kosten" value={rule.cost} />
          <ReadRule label="Reichweite" value={rule.range} />
          <ReadRule label="Dauer" value={rule.duration} />
          <ReadRule label="Bereich" value={rule.area} />
          <ReadRule label="Handlung" value={rule.castingTime || rule.action} />
          <ReadRule label="Widerstand" value={rule.resisted} />
        </SimpleGrid>
        <Text size="sm">{rule.description}</Text>
      </Stack>
    </Paper>
  );
}

function ReadRule({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={1}>
      <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Stack>
  );
}

function RuleLine({ label, value }: { label: string; value?: string }) {
  if (!value) return null;

  return (
    <Text size="sm">
      <Text span fw={700}>
        {label}:{" "}
      </Text>
      {value}
    </Text>
  );
}

function SkillRankSelector({ value, onChange }: { value: number; onChange: (rank: number) => void }) {
  return (
    <Stack gap={4}>
      <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
        Rang
      </Text>
      <Group gap={6} wrap="nowrap" className="attribute-circles">
        {skillRankValues.map((rank) => (
          <button
            key={rank}
            type="button"
            className="attribute-circle"
            data-selected={value === rank}
            onClick={() => onChange(rank)}
            aria-pressed={value === rank}
            aria-label={`Fertigkeit auf Rang ${rank} setzen`}
          >
            {rank}
          </button>
        ))}
      </Group>
    </Stack>
  );
}

function EquipmentSelect({
  label,
  value,
  data,
  onChange,
  onCustom,
}: {
  label: string;
  value: string;
  data: string[];
  onChange: (value: string) => void;
  onCustom: () => void;
}) {
  const options = value && !data.includes(value) ? [value, ...data] : data;

  return (
    <Group align="end" gap="xs" wrap="nowrap">
      <Select
        label={label}
        data={options}
        value={value || null}
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
