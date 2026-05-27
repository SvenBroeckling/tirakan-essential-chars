export const attributes = [
  "Geist",
  "Wille",
  "Instinkt",
  "Geschick",
  "Körper",
  "Erscheinung",
  "Gabe",
  "Wahrnehmung",
] as const;

export type AttributeName = (typeof attributes)[number];

export const centuryLevels: Record<number, { faith: number; magic: number }> = {
  1: { faith: 1, magic: 1 },
  2: { faith: 1, magic: 2 },
  3: { faith: 1, magic: 3 },
  4: { faith: 1, magic: 4 },
  5: { faith: 1, magic: 5 },
  6: { faith: 2, magic: 4 },
  7: { faith: 3, magic: 3 },
  8: { faith: 4, magic: 2 },
  9: { faith: 5, magic: 1 },
  10: { faith: 6, magic: 0 },
};

export const ancestries = [
  "Al Bah JiRa",
  "Asgoran",
  "Die Stämme der Barbaren",
  "Gas'Danir",
  "Gasdaria",
  "Meridian",
  "Nur'Tuk",
  "Hadewald",
  "Toran",
  "Quitaron",
  "Yadosien",
  "Yavon",
  "Ancatir",
  "Atiarel",
  "Silkanda",
  "Anscharon",
  "Fraxut",
  "Xordai",
  "Morgalas",
  "Katora",
  "Kroto'Chim",
  "O'Grut",
  "Asch-Ta-Khi",
  "Dunkelgoblins",
  "Duigosz",
  "Gnome",
  "Gorben",
  "Doldagor",
  "Flügler",
  "Echsen",
  "Minotauren",
];

export const paths = [
  "Krieger",
  "Gelehrter",
  "Abenteurer",
  "Barde",
  "Dieb",
  "Händler",
  "Mechanikus",
  "Seefahrer",
  "Pirat",
  "Söldner",
  "Wegelagerer",
  "Meuchler",
  "Gaukler",
  "Medikus",
  "Jäger",
  "Spion",
  "Soldat",
  "Schmied",
  "Boxer",
  "Schreiber",
  "Bote",
  "Bestatter",
  "Ritter",
  "Medium",
  "Bader",
  "Abdecker",
  "Wirt",
  "Chimärologe",
  "Dämonologe",
  "Druide",
  "Geisterbeschwörer",
  "Hexer",
  "Hermetiker",
  "Mystiker",
  "Nekrologe",
  "Runenleger",
  "Schwarzmagier",
  "Weissmagier",
  "Zauberer",
  "Waldläufer",
  "Mönch",
  "Paladin",
  "Priester",
  "Vampirjäger",
];

export const bonds = [
  "Die Heimat",
  "Die Familie",
  "Die letzte Ernte",
  "Die Straße nach Bayard",
  "Die Karawane aus Al Bah JiRa",
  "Die Wälder Hadewalds",
  "Die freien Städte Yavons",
  "Die Flüchtlinge des Südens",
  "Die verlorenen Kinder Yadosiens",
  "Der alte Lehrmeister",
  "Die Kameraden der Front",
  "Die kleine Tempelgemeinschaft",
  "Das fahrende Volk",
  "Die Gilde deines Handwerks",
  "Die Kinder des Viertels",
  "Die Grenzer von Büttingen",
  "Der Orden eines Heilers",
  "Die Bruderschaft des Rechten Weges",
  "Ein Zwergenclan der Fraxut",
  "Die Schattenjäger",
  "Das verlassene Gutshaus",
  "Das vergessene Schlachtfeld",
  "Die alte Garnison",
  "Der Schrein",
  "Der letzte Brief",
  "Die verlorene Bibliothek",
  "Der schwarze Turm Yadosiens",
  "Die Glocke von Thenon",
  "Der letzte Garten",
  "Der verbotene Geliebte",
  "Das Lied der Heimat",
  "Die freien Götter",
  "Ein Vertrauter der Titanen",
  "Die verbotene Liebe zu einem Nichtmenschen",
  "Das Banner des gefallenen Hauptmanns",
  "Die Stimmen der Ahnen",
  "Das Licht vor der Dunkelheit",
];

export const wizardSteps = [
  "Konzept",
  "Attribute",
  "Fertigkeiten",
  "Prägungen",
  "Schuld oder Eid",
  "Abgeleitete Werte",
  "Startausrüstung",
  "Startwerte",
  "Übernatürlicher Zugang",
];

export type CharacterPayload = {
  name: string;
  birthDate?: string;
  century: number;
  campaign?: string;
  playerName?: string;
  concept: string;
  ancestry: string;
  ancestryCustom: boolean;
  path: string;
  pathCustom: boolean;
  bond: string;
  bondCustom: boolean;
  oathOrDebt?: string;
  attributes: Record<AttributeName, number>;
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
  notes?: string;
};

export function deriveValues(payload: Pick<CharacterPayload, "attributes" | "century" | "skills">) {
  const levels = centuryLevels[payload.century] ?? centuryLevels[1];
  const body = payload.attributes.Körper ?? 0;
  const will = payload.attributes.Wille ?? 0;
  const dexterity = payload.attributes.Geschick ?? 0;
  const mind = payload.attributes.Geist ?? 0;
  const rite = payload.skills.find((skill) => skill.name.toLowerCase().includes("ritus"))?.rank ?? 0;

  return {
    woundThreshold: 3 + body,
    burdenThreshold: 5 + Math.floor(will / 2),
    initiative: 30 + dexterity * 10,
    faithLevel: levels.faith,
    magicLevel: levels.magic,
    omenMax: 2 + Math.floor(levels.faith / 2),
    invocationValue: levels.faith + rite,
    favorLimit: 1 + Math.floor(will / 2),
    arkanaMax: 3 + mind,
    favorMax: 3 + will,
  };
}

export function initialAttributes(): Record<AttributeName, number> {
  return attributes.reduce((acc, attribute) => ({ ...acc, [attribute]: 0 }), {} as Record<AttributeName, number>);
}
