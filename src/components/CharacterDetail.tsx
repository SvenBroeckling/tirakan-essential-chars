"use client";

import {
  ActionIcon,
  Autocomplete,
  Badge,
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
  Tooltip,
} from "@mantine/core";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { AttributeRow, attributeTargetRolls, sheetRankValues, SkillRankRow } from "@/components/AttributeRows";
import { armorRules, ArmorRule, weaponRules, WeaponRule } from "@/lib/equipmentRules";
import { magicAspectRules, SpellRule, spellRules } from "@/lib/magicRules";
import { ancestryRules, bondRules, MarkRule, pathRules } from "@/lib/markRules";
import {
  ancestries,
  attributeLabels,
  attributes,
  bonds,
  centuryLevels,
  deriveValues,
  normalizeAttributes,
  paths,
} from "@/lib/rulebook";

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
    customWeapons?: Record<string, WeaponRule>;
    customArmors?: Record<string, ArmorRule>;
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

const skillRankOptions = ["1", "2", "3"];

function pathSkillOptions(pathName: string) {
  const skills = pathRules.find((rule) => rule.name === pathName)?.skills;
  if (!skills) return [];

  return Array.from(new Set(skills.split(",").map((skill) => skill.trim()).filter(Boolean)));
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

function selectOptionsWithCurrent(value: string, options: readonly string[]) {
  return value && !options.includes(value) ? [value, ...options] : [...options];
}

export function CharacterDetail({ character }: { character: CharacterView }) {
  const [draft, setDraft] = useState({ ...character, attributes: normalizeAttributes(character.attributes) });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [infoModal, setInfoModal] = useState<{ title: string; content: ReactNode } | null>(null);
  const primaryWeapon =
    weaponRules.find((rule) => rule.name === draft.equipment.primaryWeapon) ??
    draft.equipment.customWeapons?.[draft.equipment.primaryWeapon];
  const secondaryWeapon =
    weaponRules.find((rule) => rule.name === draft.equipment.secondaryWeapon) ??
    draft.equipment.customWeapons?.[draft.equipment.secondaryWeapon];
  const armor =
    armorRules.find((rule) => rule.name === draft.equipment.armor) ?? draft.equipment.customArmors?.[draft.equipment.armor];
  const ancestryRule = ancestryRules.find((rule) => rule.name === draft.ancestry);
  const pathRule = pathRules.find((rule) => rule.name === draft.path);
  const bondRule = bondRules.find((rule) => rule.name === draft.bond);
  const aspectRules = draft.supernatural.aspects
    .map((aspect) => magicAspectRules.find((rule) => rule.name === aspect))
    .filter((rule): rule is (typeof magicAspectRules)[number] => Boolean(rule));
  const selectedSpellRules = draft.supernatural.spells
    .map((spell) => spellRules.find((rule) => rule.name === spell))
    .filter((rule): rule is SpellRule => Boolean(rule));
  const derived = deriveValues({
    attributes: draft.attributes as never,
    century: draft.century,
    skills: draft.skills,
  });

  const conditionRows = [
    { key: "wounds", label: "Wunden", value: draft.conditions.wounds ?? 0, max: derived.woundThreshold },
    { key: "burden", label: "Bürde", value: draft.conditions.burden ?? 0, max: derived.burdenThreshold },
    { key: "omen", label: "Omen", value: draft.conditions.omen ?? derived.omenMax, max: derived.omenMax },
    { key: "arkana", label: "Arkana", value: draft.conditions.arkana ?? derived.arkanaMax, max: derived.arkanaMax },
    { key: "favor", label: "Gunst", value: draft.conditions.favor ?? derived.favorMax, max: derived.favorMax },
    {
      key: "corruption",
      label: "Verderbnis",
      value: draft.conditions.corruption ?? 0,
      max: Math.max(6, draft.conditions.corruption ?? 0),
    },
  ];
  const selectedPathSkillOptions = pathSkillOptions(draft.path);
  const weaponOptions = weaponRules.map((rule) => rule.name);
  const armorOptions = armorRules.map((rule) => rule.name);
  const aspectOptions = magicAspectRules.map((rule) => rule.name);
  const slots = magicSlots(draft.attributes.gift ?? 0);
  const aspectValues = resizeValues(draft.supernatural.aspects, Math.max(slots.aspects, draft.supernatural.aspects.length));
  const spellValues = resizeValues(draft.supernatural.spells, Math.max(slots.spells, draft.supernatural.spells.length));
  const spellOptions = (
    aspectValues.filter(Boolean).length
      ? spellRules.filter((rule) => aspectValues.includes(rule.aspect))
      : spellRules
  ).map((rule) => rule.name);

  const save = async (nextDraft = draft, closeEditing = true) => {
    setSaving(true);
    const response = await fetch(`/api/characters/${nextDraft.hash}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextDraft),
    });
    const updated = await response.json();
    setSaving(false);
    if (response.ok) {
      setDraft(JSON.parse(JSON.stringify(updated)));
      if (closeEditing) {
        setEditing(null);
      }
    }
  };

  const saveCondition = (key: string, value: number) => {
    const nextDraft = {
      ...draft,
      conditions: {
        ...draft.conditions,
        [key]: value,
      },
    };
    setDraft(nextDraft);
    void save(nextDraft, false);
  };

  const copyHash = async () => {
    await navigator.clipboard.writeText(draft.hash);
  };

  return (
    <main className="book-page">
      <Modal
        opened={Boolean(infoModal)}
        onClose={() => setInfoModal(null)}
        title={infoModal?.title}
        size="lg"
        centered
      >
        {infoModal?.content}
      </Modal>
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
            <Link className="page-brand-link" href="/" aria-label="Zur Startseite">
              <span className="page-brand-mark">TE</span>
              <span className="page-brand-text">
                <span>Tirakan</span>
                <span>Essential</span>
              </span>
            </Link>
          </Group>

          <Paper className="book-panel" p="lg">
            <SectionTitle
              title="Identität"
              onEdit={() => setEditing("identity")}
              onInfo={() =>
                setInfoModal({
                  title: "Identität",
                  content: (
                    <RuleHelp>
                      <RuleLine label="Konzept" value="Der Konzeptsatz beschreibt die Figur knapp und spielbar." />
                      <RuleLine label="Jahrhundert" value="Das Jahrhundert bestimmt Glaubens- und Magieniveau." />
                      <RuleLine label="Hash" value="Wer den Hash kennt, kann diesen Charakterbogen öffnen." />
                    </RuleHelp>
                  ),
                })
              }
            />
            {editing === "identity" ? (
              <Stack>
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
                <SaveButton saving={saving} onSave={save} />
              </Stack>
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

          <div className="character-summary-grid">
            <Paper className="book-panel" p="lg">
              <SectionTitle
                title="Prägungen"
                onEdit={() => setEditing("marks")}
                onInfo={() =>
                  setInfoModal({
                    title: "Prägungen",
                    content: (
                      <Stack gap="xs">
                        <MarkRuleSummary title="Abstammung" name={draft.ancestry} rule={ancestryRule} />
                        <MarkRuleSummary title="Weg" name={draft.path} rule={pathRule} showFacet />
                        <MarkRuleSummary title="Bindung" name={draft.bond} rule={bondRule} />
                      </Stack>
                    ),
                  })
                }
              />
              {editing === "marks" ? (
                <Stack>
                  <Select
                    label="Abstammung"
                    data={selectOptionsWithCurrent(draft.ancestry, ancestries)}
                    value={draft.ancestry || null}
                    searchable
                    onChange={(value) => value && setDraft({ ...draft, ancestry: value, ancestryCustom: !ancestries.includes(value) })}
                  />
                  <Select
                    label="Weg"
                    data={selectOptionsWithCurrent(draft.path, paths)}
                    value={draft.path || null}
                    searchable
                    onChange={(value) => value && setDraft({ ...draft, path: value, pathCustom: !paths.includes(value) })}
                  />
                  <Select
                    label="Bindung"
                    data={selectOptionsWithCurrent(draft.bond, bonds)}
                    value={draft.bond || null}
                    searchable
                    onChange={(value) => value && setDraft({ ...draft, bond: value, bondCustom: !bonds.includes(value) })}
                  />
                  <TextInput label="Mal" value={draft.mark} onChange={(e) => setDraft({ ...draft, mark: e.currentTarget.value })} />
                  <SaveButton saving={saving} onSave={save} />
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
              <SectionTitle
                title="Zustand"
                onInfo={() =>
                  setInfoModal({
                    title: "Zustand",
                    content: (
                      <RuleHelp>
                        <RuleLine label="Wunden" value={`Maximum = 3 + ${attributeLabels.body}`} />
                        <RuleLine label="Bürde" value={`Maximum = 5 + abgerundete Hälfte von ${attributeLabels.will}`} />
                        <RuleLine label="Omen" value="Maximum = 2 + abgerundete Hälfte des Glaubensniveaus" />
                        <RuleLine label="Arkana" value={`Maximum = 3 + ${attributeLabels.mind}`} />
                        <RuleLine label="Gunst" value={`Maximum = 3 + ${attributeLabels.will}`} />
                      </RuleHelp>
                    ),
                  })
                }
              />
              <Stack gap="xs">
                {conditionRows.map((condition) => (
                  <ConditionRow
                    key={condition.key}
                    label={condition.label}
                    value={condition.value}
                    max={condition.max}
                    disabled={saving}
                    onChange={(value) => saveCondition(condition.key, value)}
                  />
                ))}
              </Stack>
            </Paper>

            <Paper className="book-panel" p="lg">
              <SectionTitle
                title="Abgeleitet"
                onEdit={() => setEditing(null)}
                onInfo={() =>
                  setInfoModal({
                    title: "Abgeleitet",
                    content: (
                      <RuleHelp>
                        <RuleLine label="Initiative" value={`30 + ${attributeLabels.dexterity} × 10`} />
                        <RuleLine
                          label="Glaube und Magie"
                          value={`Aus dem ${draft.century}. Jahrhundert: Glaube ${centuryLevels[draft.century]?.faith ?? centuryLevels[1].faith}, Magie ${centuryLevels[draft.century]?.magic ?? centuryLevels[1].magic}`}
                        />
                        <RuleLine label="Anrufung" value="Glaubensniveau + Rang einer Fertigkeit mit Ritus im Namen" />
                        <RuleLine label="Gunstgrenze" value={`1 + abgerundete Hälfte von ${attributeLabels.will}`} />
                        <RuleLine label="Omen" value="2 + abgerundete Hälfte des Glaubensniveaus" />
                      </RuleHelp>
                    ),
                  })
                }
              />
              <SimpleGrid cols={2}>
                <Read label="Initiative" value={String(derived.initiative)} />
                <Read label="Glaube" value={String(derived.faithLevel)} />
                <Read label="Magie" value={String(derived.magicLevel)} />
                <Read label="Anrufung" value={String(derived.invocationValue)} />
                <Read label="Gunstgrenze" value={String(derived.favorLimit)} />
              </SimpleGrid>
            </Paper>
          </div>

          <Paper className="book-panel" p="lg">
            <SectionTitle
              title="Attribute"
              onEdit={() => setEditing("attributes")}
              onInfo={() =>
                setInfoModal({
                  title: "Attribute",
                  content: (
                    <RuleHelp>
                      <RuleLine label="Zielwerte" value="Attribut 0 = 30, 1 = 45, 2 = 60, 3 = 75, 4 = 90." />
                      <RuleLine
                        label="Aktuelle Zielwerte"
                        value={attributes
                          .map(
                            (attribute) =>
                              `${attributeLabels[attribute]} ${attributeTargetRolls[(draft.attributes[attribute] ?? 0) as keyof typeof attributeTargetRolls] ?? 30}`,
                          )
                          .join(", ")}
                      />
                    </RuleHelp>
                  ),
                })
              }
            />
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              {attributes.map((attribute) => (
                <AttributeRow
                  key={attribute}
                  attribute={attribute}
                  value={draft.attributes[attribute] ?? 0}
                  values={sheetRankValues}
                  showTargetRoll
                  onChange={
                    editing === "attributes"
                      ? (value) => setDraft({ ...draft, attributes: { ...draft.attributes, [attribute]: value } })
                      : undefined
                  }
                />
              ))}
            </SimpleGrid>
            {editing === "attributes" && <SaveButton saving={saving} onSave={save} />}
          </Paper>

          <SimpleGrid cols={{ base: 1, md: 2 }}>
            <Paper className="book-panel" p="lg">
              <SectionTitle
                title="Fertigkeiten"
                onEdit={() => setEditing("skills")}
                onInfo={() =>
                  setInfoModal({
                    title: "Fertigkeiten",
                    content: (
                      <RuleHelp>
                        <RuleLine label="Fertigkeiten" value="Fertigkeitsränge ergänzen Proben, wenn eine passende Fertigkeit zur Handlung genutzt wird." />
                        <RuleLine label="Startverteilung" value="Bei der Erschaffung: eine Fertigkeit Rang 3, drei Fertigkeiten Rang 2, alle übrigen Rang 1." />
                      </RuleHelp>
                    ),
                  })
                }
              />
              <Stack>
                {draft.skills.map((skill, index) =>
                  editing === "skills" ? (
                    <div key={index} className="skill-row">
                      <Autocomplete
                        label="Name"
                        data={selectOptionsWithCurrent(skill.name, selectedPathSkillOptions)}
                        value={skill.name}
                        onChange={(value) => {
                          const skills = [...draft.skills];
                          skills[index] = { ...skill, name: value };
                          setDraft({ ...draft, skills });
                        }}
                      />
                      <Select
                        label="Rang"
                        data={selectOptionsWithCurrent(String(skill.rank), skillRankOptions)}
                        value={String(skill.rank)}
                        onChange={(value) => {
                          const skills = [...draft.skills];
                          skills[index] = { ...skill, rank: Number(value) || 0 };
                          setDraft({ ...draft, skills });
                        }}
                      />
                    </div>
                  ) : (
                    <SkillRankRow key={index} name={skill.name} value={skill.rank} />
                  ),
                )}
                {editing === "skills" && <SaveButton saving={saving} onSave={save} />}
              </Stack>
            </Paper>

            <Paper className="book-panel" p="lg">
              <SectionTitle
                title="Ausrüstung"
                onEdit={() => setEditing("equipment")}
                onInfo={() =>
                  setInfoModal({
                    title: "Ausrüstung",
                    content: (
                      <RuleHelp>
                        <RuleLine label="Waffen" value="Schaden, Reichweite, Griff und Eigenschaften stammen aus der Startausrüstung im Regelanhang." />
                        <RuleLine label="Rüstung" value="Schutz reduziert Trefferfolgen, Last belastet, Siegel beschreibt die arkane Versiegelung." />
                      </RuleHelp>
                    ),
                  })
                }
              />
              {editing === "equipment" ? (
                <Stack>
                  <Select
                    label="Primärwaffe"
                    data={selectOptionsWithCurrent(draft.equipment.primaryWeapon, weaponOptions)}
                    value={draft.equipment.primaryWeapon || null}
                    searchable
                    onChange={(value) => value && setDraft({ ...draft, equipment: { ...draft.equipment, primaryWeapon: value } })}
                  />
                  <Select
                    label="Zweitwaffe"
                    data={selectOptionsWithCurrent(draft.equipment.secondaryWeapon, weaponOptions)}
                    value={draft.equipment.secondaryWeapon || null}
                    searchable
                    onChange={(value) => value && setDraft({ ...draft, equipment: { ...draft.equipment, secondaryWeapon: value } })}
                  />
                  <Select
                    label="Rüstung"
                    data={selectOptionsWithCurrent(draft.equipment.armor, armorOptions)}
                    value={draft.equipment.armor || null}
                    searchable
                    onChange={(value) => value && setDraft({ ...draft, equipment: { ...draft.equipment, armor: value } })}
                  />
                  <Textarea
                    label="Gegenstände"
                    value={draft.equipment.items.join("\n")}
                    onChange={(e) => setDraft({ ...draft, equipment: { ...draft.equipment, items: e.currentTarget.value.split("\n") } })}
                  />
                  <SaveButton saving={saving} onSave={save} />
                </Stack>
              ) : (
                <Stack>
                  <WeaponTable
                    weapons={[
                      { slot: "Primärwaffe", name: draft.equipment.primaryWeapon, rule: primaryWeapon },
                      { slot: "Zweitwaffe", name: draft.equipment.secondaryWeapon, rule: secondaryWeapon },
                    ]}
                  />
                  <ArmorTable name={draft.equipment.armor} rule={armor} />
                  <Read label="Gegenstände" value={draft.equipment.items.filter(Boolean).join(", ") || "-"} />
                </Stack>
              )}
            </Paper>
          </SimpleGrid>

          <Paper className="book-panel" p="lg">
            <SectionTitle
              title="Magie und Glaube"
              onEdit={() => setEditing("supernatural")}
              onInfo={() =>
                setInfoModal({
                  title: "Magie und Glaube",
                  content: (
                    <Stack gap="xs">
                      <RuleHelp>
                        <RuleLine label="Begabte" value={`Magie ist möglich ab ${attributeLabels.gift} 1.`} />
                        <RuleLine label="Aspekte" value="Gabe 1 erlaubt einen Aspekt, Gabe 2+ erlaubt zwei Aspekte." />
                        <RuleLine label="Zauber" value="Neue Charaktere beherrschen Gabe + 2 Zauber, maximal 5." />
                      </RuleHelp>
                      <SpellCastingRules />
                      {aspectRules.length > 0 && (
                        <SimpleGrid cols={{ base: 1, md: 2 }}>
                          {aspectRules.map((rule) => (
                            <MagicAspectRuleCard key={rule.name} rule={rule} />
                          ))}
                        </SimpleGrid>
                      )}
                      {selectedSpellRules.map((rule) => (
                        <SpellRuleSummary key={`${rule.aspect}-${rule.name}`} rule={rule} />
                      ))}
                    </Stack>
                  ),
                })
              }
            />
            {editing === "supernatural" ? (
              <Stack>
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
                  {aspectValues.map((aspect, index) => (
                    <Select
                      key={`aspect-${index}`}
                      label={`Aspekt ${index + 1}`}
                      data={selectOptionsWithCurrent(aspect, aspectOptions)}
                      value={aspect || null}
                      searchable
                      clearable
                      onChange={(value) => {
                        const aspects = [...aspectValues];
                        aspects[index] = value ?? "";
                        const allowedSpellNames = new Set(
                          spellRules.filter((rule) => aspects.includes(rule.aspect)).map((rule) => rule.name),
                        );
                        setDraft({
                          ...draft,
                          supernatural: {
                            ...draft.supernatural,
                            aspects: aspects.filter(Boolean),
                            spells: spellValues.filter((spell) => allowedSpellNames.has(spell)),
                          },
                        });
                      }}
                    />
                  ))}
                  {spellValues.map((spell, index) => (
                    <Select
                      key={`spell-${index}`}
                      label={`Zauber ${index + 1}`}
                      data={selectOptionsWithCurrent(spell, spellOptions)}
                      value={spell || null}
                      searchable
                      clearable
                      onChange={(value) => {
                        const spells = [...spellValues];
                        spells[index] = value ?? "";
                        setDraft({
                          ...draft,
                          supernatural: { ...draft.supernatural, spells: spells.filter(Boolean) },
                        });
                      }}
                    />
                  ))}
                </SimpleGrid>
                <SaveButton saving={saving} onSave={save} />
              </Stack>
            ) : (
              <Stack gap="xs">
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <Read label="Fokus" value={draft.supernatural.focus || "-"} />
                  <Read label="Regenerationsritual" value={draft.supernatural.regenerationRitual || "-"} />
                  <Read label="Aspekte" value={draft.supernatural.aspects.filter(Boolean).join(", ") || "-"} />
                  <Read label="Zauber" value={draft.supernatural.spells.filter(Boolean).join(", ") || "-"} />
                </SimpleGrid>
                {selectedSpellRules.length > 0 && (
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mt="sm">
                    {selectedSpellRules.map((rule) => (
                      <SpellRuleSummary key={`${rule.aspect}-${rule.name}`} rule={rule} />
                    ))}
                  </SimpleGrid>
                )}
              </Stack>
            )}
          </Paper>
        </Stack>
      </Container>
    </main>
  );
}

function WeaponTable({
  weapons,
}: {
  weapons: Array<{ slot: string; name: string; rule?: WeaponRule }>;
}) {
  return (
    <div className="equipment-table-wrap">
      <table className="equipment-table">
        <thead>
          <tr>
            <th>Waffe</th>
            <th>Schaden</th>
            <th>Reichweite</th>
            <th>Griff</th>
            <th>Eigenschaften</th>
          </tr>
        </thead>
        <tbody>
          {weapons.map(({ slot, name, rule }) => (
            <tr key={slot}>
              <td>
                <Text fw={700}>{name || "-"}</Text>
                <Text size="xs" c="dimmed">
                  {slot}
                </Text>
              </td>
              <td>{rule?.damage ?? "-"}</td>
              <td>{rule?.range ?? "-"}</td>
              <td>{rule?.grip ?? "-"}</td>
              <td>{rule?.properties ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ArmorTable({ name, rule }: { name: string; rule?: ArmorRule }) {
  return (
    <div className="equipment-table-wrap">
      <table className="equipment-table">
        <thead>
          <tr>
            <th>Rüstung</th>
            <th>Schutz</th>
            <th>Last</th>
            <th>Siegel</th>
            <th>Eigenschaften</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Text fw={700}>{name || "-"}</Text>
            </td>
            <td>{rule?.protection ?? "-"}</td>
            <td>{rule?.load ?? "-"}</td>
            <td>{rule?.sealing ?? "-"}</td>
            <td>{rule?.properties ?? "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function MarkRuleSummary({
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
    <Paper className="rule-help-card" withBorder p="sm" radius={6}>
      <Stack gap={4}>
        <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
          {title}
        </Text>
        <Text fw={700}>{name || "-"}</Text>
        {rule ? (
          <>
            <RuleLine label="Vorteil" value={rule.benefit} />
            <RuleLine label="Verwundbarkeit" value={rule.vulnerability} />
            {showFacet && <RuleLine label="Wegfacette" value={rule.facet} />}
            <RuleLine label="Fertigkeiten" value={rule.skills} />
          </>
        ) : (
          <Text size="sm">Keine Regelbeschreibung hinterlegt.</Text>
        )}
      </Stack>
    </Paper>
  );
}

function MagicAspectRuleCard({ rule }: { rule: (typeof magicAspectRules)[number] }) {
  return (
    <Paper className="rule-help-card" withBorder p="sm" radius={6}>
      <Stack gap={4}>
        <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
          Aspekt
        </Text>
        <Text fw={700}>{rule.name}</Text>
        <Text size="sm">{rule.description}</Text>
      </Stack>
    </Paper>
  );
}

function SpellRuleSummary({ rule }: { rule: SpellRule }) {
  return (
    <Paper className="rule-help-card" withBorder p="sm" radius={6}>
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
          <RuleMetric label="Art" value={rule.category} />
          <RuleMetric label="Element" value={rule.element} />
          <RuleMetric label="Kosten" value={rule.cost} />
          <RuleMetric label="Reichweite" value={rule.range} />
          <RuleMetric label="Dauer" value={rule.duration} />
          <RuleMetric label="Bereich" value={rule.area} />
          <RuleMetric label="Handlung" value={rule.castingTime || rule.action} />
          <RuleMetric label="Widerstand" value={rule.resisted} />
        </SimpleGrid>
        <Text size="sm">{rule.description}</Text>
      </Stack>
    </Paper>
  );
}

function SpellCastingRules() {
  return (
    <RuleHelp>
      <RuleLine label="Ablauf" value="Der Zauber gibt vor, ob er ein Ritual oder ein einfacher Zauber ist. Einfache Zauber können in einer Kampfhandlung gewirkt werden, Rituale brauchen in der Regel mehr als eine Handlung." />
      <RuleLine label="Probe" value="Nach Wahl der Wirkstufe wird mit eventuellen Modifikationen auf Gabe geworfen. Die Kosten werden immer bezahlt, auch wenn der Zauber fehlschlägt." />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <RuleMetric label="Gering" value="+10 Zielwert, Zauberstärke 0" />
        <RuleMetric label="Normal" value="keine Auswirkungen, Zauberstärke 1" />
        <RuleMetric label="Schwer" value="-10 Zielwert, +1 Arkana, Zauberstärke 3" />
        <RuleMetric label="Katastrophal" value="-30 Zielwert, +2 Arkana, Zauberstärke 5" />
      </SimpleGrid>
      <RuleLine label="Kritischer Erfolg" value="+2 Zauberstärke" />
      <RuleLine label="Starker Erfolg" value="+1 Zauberstärke" />
      <RuleLine label="Sauberer Erfolg" value="Effekt tritt wie erklärt ein." />
      <RuleLine label="Knapp geschafft" value="Effekt tritt ein, aber mit einem geringen Nebeneffekt." />
      <RuleLine label="Misserfolg" value="Kein beabsichtigter Effekt, stattdessen Nebeneffekt." />
    </RuleHelp>
  );
}

function RuleHelp({ children }: { children: ReactNode }) {
  return (
    <Paper className="rule-help-card" withBorder p="sm" radius={6}>
      <Stack gap={4}>{children}</Stack>
    </Paper>
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

function RuleMetric({ label, value }: { label: string; value: string }) {
  return (
    <Stack gap={1}>
      <Text size="xs" tt="uppercase" c="dimmed" fw={700}>
        {label}
      </Text>
      <Text size="sm">{value}</Text>
    </Stack>
  );
}

function ConditionRow({
  label,
  value,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  const safeValue = Math.max(0, value);
  const safeMax = Math.max(0, max, safeValue);
  const options = Array.from({ length: safeMax + 1 }, (_, index) => index);

  return (
    <div className="condition-row">
      <div className="rank-label">
        <Text fw={700}>{label}</Text>
      </div>
      <Group gap={6} wrap="wrap" className="rank-circles condition-circles">
        {options.map((option) => {
          const current = option === safeValue;

          return (
            <button
              key={option}
              type="button"
              className="rank-circle condition-circle"
              data-selected={current}
              disabled={disabled}
              onClick={() => onChange(option)}
              aria-pressed={current}
              aria-label={`${label} auf ${option} setzen`}
            >
              {option}
            </button>
          );
        })}
      </Group>
    </div>
  );
}

function SectionTitle({ title, onEdit, onInfo }: { title: string; onEdit?: () => void; onInfo: () => void }) {
  return (
    <Group className="sheet-section-header" justify="space-between" mb="md">
      <Title order={2} size="h3" className="display-font">
        {title}
      </Title>
      <Group gap={6}>
        <Tooltip label="Beschreibung und Regeln">
          <ActionIcon className="section-info" variant="subtle" size="sm" aria-label={`Beschreibung und Regeln: ${title}`} onClick={onInfo}>
            i
          </ActionIcon>
        </Tooltip>
        {onEdit ? (
          <button className="tiny-edit" type="button" onClick={onEdit}>
            bearbeiten
          </button>
        ) : null}
      </Group>
    </Group>
  );
}

function SaveButton({ saving, onSave }: { saving: boolean; onSave: () => void }) {
  return (
    <Group justify="end">
      <Button color="red.9" loading={saving} onClick={onSave}>
        Speichern
      </Button>
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
