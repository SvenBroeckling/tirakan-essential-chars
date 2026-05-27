export type WeaponRule = {
  name: string;
  damage: string;
  range: string;
  grip: string;
  properties: string;
};

export type ArmorRule = {
  name: string;
  protection: string;
  load: string;
  sealing: string;
  properties: string;
};

export const weaponRules = [
  { name: "Unbewaffnet", damage: "1", range: "Nahkampf", grip: "10", properties: "Nichttödlich" },
  { name: "Messer", damage: "1", range: "Nahkampf", grip: "10", properties: "Verbergbar" },
  { name: "Dolch", damage: "1", range: "Nahkampf/nah", grip: "10", properties: "Verbergbar, Wurf" },
  { name: "Knüppel", damage: "1", range: "Nahkampf", grip: "0", properties: "Brutal" },
  { name: "Stab", damage: "1", range: "Nahkampf/nah", grip: "0", properties: "Abfangen" },
  { name: "Beil", damage: "2", range: "Nahkampf/nah", grip: "0", properties: "Wurf" },
  { name: "Schwert", damage: "2", range: "Nahkampf", grip: "10", properties: "Ausgewogen" },
  { name: "Streitkolben", damage: "2", range: "Nahkampf", grip: "0", properties: "Wuchtig" },
  { name: "Speer", damage: "2", range: "Nahkampf/nah", grip: "0", properties: "Abfangen, Aufsetzen" },
  { name: "Zweihandaxt", damage: "3", range: "Nahkampf", grip: "-10", properties: "Schwer, Laut" },
  { name: "Bogen", damage: "2", range: "nah/fern", grip: "0", properties: "Zweihändig, Nachladen 1" },
  { name: "Armbrust", damage: "3", range: "nah/fern", grip: "-10", properties: "Zweihändig, Nachladen 2" },
  { name: "Schleuder", damage: "1", range: "nah/fern", grip: "0", properties: "Nachladen 1" },
  { name: "Pistole", damage: "2", range: "nah/fern", grip: "0", properties: "Nachladen 2, Laut" },
  { name: "Muskete", damage: "3", range: "fern/weit", grip: "-10", properties: "Zweihändig, Nachladen 2, Laut" },
] satisfies WeaponRule[];

export const armorRules = [
  { name: "Gepolsterter Mantel", protection: "1", load: "0", sealing: "0", properties: "Verbergbar" },
  { name: "Geschichtete Roben", protection: "1", load: "0", sealing: "1", properties: "Ritual" },
  { name: "Lederwams", protection: "1", load: "0", sealing: "0", properties: "Feldtauglich" },
  { name: "Flickwerk-Kettenhemd", protection: "2", load: "1", sealing: "0", properties: "-" },
  { name: "Brigantine", protection: "2", load: "1", sealing: "1", properties: "Verstärkt" },
  { name: "Halbe Platte", protection: "3", load: "2", sealing: "1", properties: "Schwer" },
  { name: "Vollharnisch", protection: "3", load: "2", sealing: "2", properties: "Kriegsgerät" },
] satisfies ArmorRule[];
