"use client";

import { Group, Text } from "@mantine/core";
import { AttributeName } from "@/lib/rulebook";

export const attributeValues = [0, 1, 2, 3] as const;

export function AttributeRow({
  attribute,
  value,
  onChange,
}: {
  attribute: AttributeName;
  value: number;
  onChange?: (value: number) => void;
}) {
  const readOnly = !onChange;

  return (
    <div className="attribute-row">
      <Text fw={700}>{attribute}</Text>
      <Group gap={6} wrap="nowrap" className="attribute-circles">
        {attributeValues.map((option) => {
          const selected = value === option;
          const label = `${attribute} ${selected ? "ist" : "auf"} ${option}`;

          return onChange ? (
            <button
              key={option}
              type="button"
              className="attribute-circle"
              data-selected={selected}
              onClick={() => onChange(option)}
              aria-pressed={selected}
              aria-label={`${attribute} auf ${option} setzen`}
            >
              {option}
            </button>
          ) : (
            <span
              key={option}
              className="attribute-circle"
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
