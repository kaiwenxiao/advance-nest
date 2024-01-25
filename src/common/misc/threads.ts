import { hash } from "argon2";

export const hashString = (value: string): Promise<string> =>
  hash(value, {
    type: 1,
    hashLength: 50,
    saltLength: 32,
    timeCost: 4
  })