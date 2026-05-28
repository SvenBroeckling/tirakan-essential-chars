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
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { AttributeRow, attributeTargetRolls, sheetRankValues, SkillRankRow } from "@/components/AttributeRows";
import { armorRules, ArmorRule, weaponRules, WeaponRule } from "@/lib/equipmentRules";
import { magicAspectRules, SpellRule, spellRules } from "@/lib/magicRules";
import { ancestryRules, bondRules, MarkRule, pathRules } from "@/lib/markRules";
import { attributeLabels, attributes, centuryLevels, deriveValues, normalizeAttributes } from "@/lib/rulebook";

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

export function CharacterDetail({ character }: { character: CharacterView }) {
  const [draft, setDraft] = useState({ ...character, attributes: normalizeAttributes(character.attributes) });
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showRules, setShowRules] = useState(false);
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
              <Switch
                label="Beschreibungen und Regeln"
                checked={showRules}
                onChange={(event) => setShowRules(event.currentTarget.checked)}
              />
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
                  {showRules && (
                    <Stack gap="xs">
                      <MarkRuleSummary title="Abstammung" name={draft.ancestry} rule={ancestryRule} />
                      <MarkRuleSummary title="Weg" name={draft.path} rule={pathRule} showFacet />
                      <MarkRuleSummary title="Bindung" name={draft.bond} rule={bondRule} />
                    </Stack>
                  )}
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
              {showRules && (
                <RuleHelp>
                  <RuleLine label="Wunden" value={`Maximum = 3 + ${attributeLabels.body}`} />
                  <RuleLine label="Bürde" value={`Maximum = 5 + abgerundete Hälfte von ${attributeLabels.will}`} />
                  <RuleLine label="Omen" value="Maximum = 2 + abgerundete Hälfte des Glaubensniveaus" />
                  <RuleLine label="Arkana" value={`Maximum = 3 + ${attributeLabels.mind}`} />
                  <RuleLine label="Gunst" value={`Maximum = 3 + ${attributeLabels.will}`} />
                </RuleHelp>
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
              {showRules && (
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
              )}
            </Paper>
          </SimpleGrid>

          <Paper className="book-panel" p="lg">
            <SectionTitle title="Attribute" onEdit={() => setEditing("attributes")} />
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
            {showRules && (
              <RuleHelp>
                <RuleLine label="Zielwerte" value="Attribut 0 = 30, 1 = 45, 2 = 60, 3 = 75, 4 = 90." />
                <RuleLine
                  label="Aktuelle Zielwerte"
                  value={attributes
                    .map((attribute) => `${attributeLabels[attribute]} ${attributeTargetRolls[(draft.attributes[attribute] ?? 0) as keyof typeof attributeTargetRolls] ?? 30}`)
                    .join(", ")}
                />
              </RuleHelp>
            )}
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
                    <SkillRankRow key={index} name={skill.name} value={skill.rank} />
                  ),
                )}
              </Stack>
              {showRules && (
                <RuleHelp>
                  <RuleLine label="Fertigkeiten" value="Fertigkeitsränge ergänzen Proben, wenn eine passende Fertigkeit zur Handlung genutzt wird." />
                  <RuleLine label="Startverteilung" value="Bei der Erschaffung: eine Fertigkeit Rang 3, drei Fertigkeiten Rang 2, alle übrigen Rang 1." />
                </RuleHelp>
              )}
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
                  <WeaponTable
                    weapons={[
                      { slot: "Primärwaffe", name: draft.equipment.primaryWeapon, rule: primaryWeapon },
                      { slot: "Zweitwaffe", name: draft.equipment.secondaryWeapon, rule: secondaryWeapon },
                    ]}
                  />
                  <ArmorTable name={draft.equipment.armor} rule={armor} />
                  <Read label="Gegenstände" value={draft.equipment.items.filter(Boolean).join(", ") || "-"} />
                  {showRules && (
                    <RuleHelp>
                      <RuleLine label="Waffen" value="Schaden, Reichweite, Griff und Eigenschaften stammen aus der Startausrüstung im Regelanhang." />
                      <RuleLine label="Rüstung" value="Schutz reduziert Trefferfolgen, Last belastet, Siegel beschreibt die arkane Versiegelung." />
                    </RuleHelp>
                  )}
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
              <Stack>
                <SimpleGrid cols={{ base: 1, md: 2 }}>
                  <Read label="Fokus" value={draft.supernatural.focus || "-"} />
                  <Read label="Regenerationsritual" value={draft.supernatural.regenerationRitual || "-"} />
                  <Read label="Aspekte" value={draft.supernatural.aspects.filter(Boolean).join(", ") || "-"} />
                  <Read label="Zauber" value={draft.supernatural.spells.filter(Boolean).join(", ") || "-"} />
                </SimpleGrid>
                {showRules && (
                  <Stack gap="xs">
                    <RuleHelp>
                      <RuleLine label="Begabte" value={`Magie ist möglich ab ${attributeLabels.gift} 1.`} />
                      <RuleLine label="Aspekte" value="Gabe 1 erlaubt einen Aspekt, Gabe 2+ erlaubt zwei Aspekte." />
                      <RuleLine label="Zauber" value="Neue Charaktere beherrschen Gabe + 2 Zauber, maximal 5." />
                      <RuleLine label="Zauberprobe" value="Gewürfelt wird auf Gabe; Wirkstufen verändern Zielwert, Arkana und Zauberstärke." />
                    </RuleHelp>
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
