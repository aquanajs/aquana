export function trimStart(str: string) {
  let i = 0;
  while (/\s/.test(str[i])) i += 1;

  return str.slice(i);
}

export function trimEnd(str: string) {
  let i = str.length;
  while (/\s/.test(str[i - 1])) i -= 1;

  return str.slice(0, i);
}
