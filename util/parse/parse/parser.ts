import { repeat } from "../misc/repeat.ts";
import { tabsToSpaces } from "../misc/tabsToSpaces.ts";
import { locate } from "./locate.ts";

export class Parser<T> {
  pointer: number;
  template: string;
  stack: T[];
  constructor(template: string) {
    this.pointer = 0;
    this.template = template;
    this.stack = [];
  }
  get current(): T {
    return this.stack[this.stack.length - 1];
  }
  error(message: string, index = this.pointer) {
    throw new ParseError(message, this.template, index);
  }
  match(val: string): boolean {
    return this.template.slice(
      this.pointer,
      this.pointer + val.length,
    ) === val;
  }
  /**
   * Move the pointer ahead of the `val` string.
   * @param {string} val Value to move ahead of.
   * @returns {boolean} Whether the movement was successful.
   */
  move(val: string, required = false): boolean {
    if (this.match(val)) {
      this.pointer += val.length;
      return true;
    }
    if (required) this.error(`${val} is required at position ${this.pointer}.`);
    return false;
  }
  read(pattern: RegExp): string {
    const matches = pattern.exec(this.template.slice(this.pointer));
    if (!matches || matches.index !== 0) return "";

    this.pointer += matches[0].length;

    return matches[0];
  }
  readUntil(val: RegExp): string {
    const match = val.exec(this.template.slice(this.pointer));
    return this.template.slice(
      this.pointer,
      match ? (this.pointer += match.index) : this.template.length,
    );
  }
  remaining(): string {
    return this.template.slice(this.pointer, this.template.length - 1);
  }
  requireWhitespace(): boolean {
    if (!this.move(" ")) this.error(`Expected whitespace`);
    this.skipWhitespace();
    return true;
  }
  skipWhitespace() {
    while (
      this.pointer < this.template.length &&
      /\s/.test(this.template[this.pointer])
    ) {
      this.pointer++;
    }
  }
  skipNewline() {
    while (
      this.pointer < this.template.length &&
      /\n/.test(this.template[this.pointer])
    ) {
      this.pointer++;
    }
  }
  skipWhitespaceAndNewline() {
    while (
      this.pointer < this.template.length &&
      /\s|\n/.test(this.template[this.pointer])
    ) {
      this.pointer++;
    }
  }
}

export class ParseError extends Error {
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
      .map((content, i) => {
        const isErrorLine = frameStart + i === line;

        let lineNum = String(i + frameStart + 1);
        while (lineNum.length < digits) lineNum = ` ${lineNum}`;

        if (isErrorLine) {
          const indicator =
            repeat(
              " ",
              digits + 2 + tabsToSpaces(content.slice(0, column)).length,
            ) +
            "^";
          return `${lineNum}: ${tabsToSpaces(content)}\n${indicator}`;
        }

        return `${lineNum}: ${tabsToSpaces(content)}`;
      })
      .join("\n");

    super(`${message} (${line + 1}:${column})\n${frame}`);
    this.loc = { line, column };
    this.shortMessage = message;
  }
}
