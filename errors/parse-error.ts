import { locate } from "../utils/locate.ts";

function tabsToSpaces(str: string) {
  return str.replace(/^\t+/, (match) => match.split("\t").join("  "));
}

function spaces(i: number): string {
  let result = "";
  while (i--) result += " ";
  return result;
}

export class ParseError {
  message: string;
  loc: { line: number; column: number };
  shortMessage: string;
  constructor(message: string, template: string, index: number) {
    const { line, column } = locate(template, index);
    const lines = template.split("\n");

    const frameStart = Math.max(0, line - 2);
    const frameEnd = Math.min(line + 3, lines.length);

    const digits = String(frameEnd + 1).length;
    const frame = lines
      .slice(frameStart, frameEnd)
      .map((str, i) => {
        const isErrorLine = frameStart + i === line;

        let lineNum = String(i + frameStart + 1);
        while (lineNum.length < digits) lineNum = ` ${lineNum}`;

        if (isErrorLine) {
          const indicator =
            spaces(digits + 2 + tabsToSpaces(str.slice(0, column)).length) +
            "^";
          return `${lineNum}: ${tabsToSpaces(str)}\n${indicator}`;
        }

        return `${lineNum}: ${tabsToSpaces(str)}`;
      })
      .join("\n");

    this.message = `${message} (${line + 1}:${column})\n${frame}`;
    this.loc = { line, column };
    this.shortMessage = message;
  }
}
