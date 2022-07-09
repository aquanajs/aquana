import { ParseError } from "../errors/parse-error.ts";

export interface HtmlElement {
  start: number;
  end: number;
  type: string;
  data: string;
  children: HtmlElement[];
}

export class Parser {
  pointer: number;
  stack: HtmlElement[];
  template: string;

  html: HtmlElement;

  css: null;

  js: null;
  constructor(template: string) {
    this.pointer = 0;
    this.stack = [];
    this.template = template;

    this.html = {
      start: 0,
      data: "",
      end: 0,
      type: "Fragment",
      children: [],
    };

    this.css = null, this.js = null;
  }
  get current(): HtmlElement {
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
  requireWhitespace(): boolean {
    if(!this.move(" ")) this.error( `Expected whitespace` );
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
}
