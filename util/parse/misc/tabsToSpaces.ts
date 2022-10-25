/**
 * Tabs are not cool.
 */
export function tabsToSpaces(str: string) {
  return str.replace(/^\t+/, (m) => m.split("\t").join("  "));
}
