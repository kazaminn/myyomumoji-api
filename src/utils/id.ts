import { randomBytes } from "node:crypto";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
const ID_LENGTH = 8;
const PREFIX = "mym-";

export function generateProfileId(): string {
  const bytes = randomBytes(ID_LENGTH);
  let id = PREFIX;
  for (const byte of bytes) {
    id += CHARS[byte % CHARS.length];
  }
  return id;
}
