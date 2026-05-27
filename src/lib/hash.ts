import { randomBytes } from "crypto";

export function createCharacterHash() {
  return randomBytes(9).toString("base64url");
}
