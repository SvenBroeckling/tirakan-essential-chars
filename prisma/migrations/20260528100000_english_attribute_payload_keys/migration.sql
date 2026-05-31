UPDATE "Character"
SET "attributes" = jsonb_build_object(
  'mind', COALESCE("attributes"->'mind', "attributes"->'Geist', to_jsonb(0)),
  'will', COALESCE("attributes"->'will', "attributes"->'Wille', to_jsonb(0)),
  'instinct', COALESCE("attributes"->'instinct', "attributes"->'Instinkt', to_jsonb(0)),
  'dexterity', COALESCE("attributes"->'dexterity', "attributes"->'Geschick', to_jsonb(0)),
  'body', COALESCE("attributes"->'body', "attributes"->'Körper', to_jsonb(0)),
  'presence', COALESCE("attributes"->'presence', "attributes"->'Erscheinung', to_jsonb(0)),
  'gift', COALESCE("attributes"->'gift', "attributes"->'Gabe', to_jsonb(0)),
  'perception', COALESCE("attributes"->'perception', "attributes"->'Wahrnehmung', to_jsonb(0))
)
WHERE "attributes" ?| ARRAY[
  'Geist',
  'Wille',
  'Instinkt',
  'Geschick',
  'Körper',
  'Erscheinung',
  'Gabe',
  'Wahrnehmung'
];
