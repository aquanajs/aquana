/**
 * Repeat a string n times.
 * @param s String to repeat.
 * @param n Number of times to repeat.
 * @returns Repeated string.
 */
export function repeat(s: string, n: number): string {
    let res = "";
    while (n > 0) {
        res += s;
        n -= 1;
    }
    return res;
}