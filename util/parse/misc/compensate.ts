/**
 * Add a character to the beginning of a string till it reaches a certain character count.
 * @param {number} s - String to compensate.
 * @param {number} length - Number of characters to reach.
 */

export function compensateBeginning(
  s: string,
  length: number,
  compensateWith = "0",
): string {
  const arr = new Array(length).fill(compensateWith);
  return `${arr.join("").slice(0, length - s.length)}${s}`;
}


/**
 * Add a character to the end of a string till it reaches a certain character count.
 * @param {number} s - String to compensate.
 * @param {number} length - Number of characters to reach.
 */

 export function compensateEnd(
    s: string,
    length: number,
    compensateWith = "0",
  ): string {
    const arr = new Array(length).fill(compensateWith);
    return `${s}${arr.join("").slice(0, length - s.length)}`;
  }
  