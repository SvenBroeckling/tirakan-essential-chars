"use client";

import { Group, Text } from "@mantine/core";
import { AttributeName, attributeLabels } from "@/lib/rulebook";

export const attributeValues = [0, 1, 2, 3] as const;
export const sheetRankValues = [0, 1, 2, 3, 4] as const;
export const attributeTargetRolls: Record<(typeof sheetRankValues)[number], number> = {
  0: 30,
  1: 45,
  2: 60,
  3: 75,
  4: 90,
};

type RankValue = (typeof sheetRankValues)[number];

export function AttributeRow({
  attribute,
  value,
  onChange,
  values = attributeValues,
  showTargetRoll = false,
}: {
  attribute: AttributeName;
  value: number;
  onChange?: (value: number) => void;
  values?: readonly number[];
  showTargetRoll?: boolean;
}) {
  const readOnly = !onChange;
  const label = attributeLabels[attribute];
  const targetRoll = attributeTargetRolls[value as RankValue];

  return (
    <div className="attribute-row">
      <div className="rank-label">
        <Text fw={700}>{label}</Text>
        {showTargetRoll ? (
          <Text className="rank-target" aria-label={`${label} Zielwert ${targetRoll ?? 30}`}>
            Zielwert {targetRoll ?? 30}
          </Text>
        ) : null}
      </div>
      <Group gap={6} wrap="nowrap" className="rank-circles attribute-circles">
        {values.map((option) => {
          const selected = value === option;
          const target = attributeTargetRolls[option as RankValue];
          const optionLabel = target
            ? `${label} ${selected ? "ist" : "auf"} ${option}, Zielwert ${target}`
            : `${label} ${selected ? "ist" : "auf"} ${option}`;

          return onChange ? (
            <button
              key={option}
              type="button"
              className="rank-circle attribute-circle"
              data-selected={selected}
              onClick={() => onChange(option)}
              aria-pressed={selected}
              aria-label={`${label} auf ${option}${target ? ` mit Zielwert ${target}` : ""} setzen`}
            >
              {option}
            </button>
          ) : (
            <span
              key={option}
              className="rank-circle attribute-circle"
              data-selected={selected}
              data-readonly="true"
              aria-label={optionLabel}
            >
              {option}
            </span>
          );
        })}
      </Group>
    </div>
  );
}

export function SkillRankRow({
  name,
  value,
  onChange,
}: {
  name: string;
  value: number;
  onChange?: (value: number) => void;
}) {
  return (
    <div className="skill-rank-row">
      <Text fw={700}>{name || "-"}</Text>
      <Group gap={6} wrap="nowrap" className="rank-circles">
        {sheetRankValues.map((option) => {
          const selected = value === option;
          const label = `${name || "Fertigkeit"} ${selected ? "ist" : "auf"} Rang ${option}`;

          return onChange ? (
            <button
              key={option}
              type="button"
              className="rank-circle"
              data-selected={selected}
              onClick={() => onChange(option)}
              aria-pressed={selected}
              aria-label={`${name || "Fertigkeit"} auf Rang ${option} setzen`}
            >
              {option}
            </button>
          ) : (
            <span
              key={option}
              className="rank-circle"
              data-selected={selected}
              data-readonly="true"
              aria-label={label}
            >
              {option}
            </span>
          );
        })}
      </Group>
    </div>
  );
}
