import { Parser } from "./parse/parse/parser.ts";

interface AquaElement {
  name: string;
  children: AquaElement[];
  startIndex: number;
  type: "aqua" | "html" | "text";
  data: string | Record<string, string>;
  endIndex: number | null;
}

export function parse(template: string) {
  const parser = new Parser<AquaElement>(template);

  while (parser.remaining()) {
    if (parser.match("<")) {
      // Parse as a html tag
      parseHTML(parser);
    } else if (parser.match("{{")) {
      // Parse as a template tag
      parseAqua(parser);
    } else parseText(parser); // Parse as plain text
  }
  if (parser.current.endIndex === null) {
    parser.error(
      `Unterminated ${parser.current.type} (name: ${parser.current.name})`,
      parser.current.startIndex,
    );
  }
}

function parseHTML(parser: Parser<AquaElement>) {}
function parseAqua(parser: Parser<AquaElement>) {}

function parseText(parser: Parser<AquaElement>) {
  const start = parser.pointer;

  let textData = "";

  while (
    parser.pointer < parser.template.length && !parser.match("<") &&
    !parser.match("{{")
  ) {
    textData += parser.template[parser.pointer++];
  }

  const textElement: AquaElement = {
    name: "text_node",
    children: [],
    startIndex: start,
    endIndex: parser.pointer,
    type: "text",
    data: textData,
  };

  if (parser.current.endIndex === null) {
    parser.current.children.push(textElement);
  } else parser.stack.push(textElement);
}
