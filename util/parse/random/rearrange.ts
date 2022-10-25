/**
 * Rearrange characters in a string randomly.
 * @param s String to rearrange.
 * @returns String rearranged randomly.
 */
export default function rearrange(s: string): string {
  return s.split("").sort(() => Math.random() > 0.5 ? 1 : -1).join("");
}
