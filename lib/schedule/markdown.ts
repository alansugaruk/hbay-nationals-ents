import MarkdownIt, { type Token } from "markdown-it";

/** A stretch of text sharing the same emphasis. */
export type Run = { text: string; bold: boolean; italic: boolean };

/** One source line of text, made up of one or more runs. */
export type Line = Run[];

export type Align = "left" | "center" | "right";

export type Cell = { lines: Line[]; align: Align };

export type Block =
  | { kind: "heading"; level: number; lines: Line[] }
  | { kind: "paragraph"; lines: Line[] }
  | { kind: "list"; items: { marker: string; lines: Line[] }[] }
  | { kind: "table"; head: Cell[]; body: Cell[][] }
  | { kind: "rule" };

const TERMINAL_PUNCTUATION = /[.!?:;]["'’)\]]?$/;

function plain(line: Line): string {
  return line.map((run) => run.text).join("");
}

/** True if a line begins with a lowercase letter, as a wrapped sentence would. */
function startsLowercase(line: Line): boolean {
  const first = plain(line).trimStart().charAt(0);
  return first !== "" && first === first.toLowerCase() && first !== first.toUpperCase();
}

/**
 * Decides whether a single newline in the source was a deliberate line break or
 * just a hard-wrapped sentence.
 *
 * Both shapes appear in the schedule: "Volunteers / MC / Sound Tech" blocks want a
 * break per line, while a long note wrapped at the edge of the file must flow as one
 * sentence. A wrapped sentence is the case where the previous line stops without
 * closing punctuation and the next one picks up in lowercase.
 */
function continuesSentence(previous: Line, next: Line): boolean {
  const before = plain(previous).trimEnd();
  if (before === "" || TERMINAL_PUNCTUATION.test(before)) return false;
  return startsLowercase(next);
}

/**
 * Flattens a markdown-it `inline` token into lines of styled runs. Hard breaks always
 * split; single newlines split unless they are mid-sentence (see continuesSentence).
 */
function inlineToLines(token: Token | undefined): Line[] {
  const lines: Line[] = [[]];
  /** Whether the break that started each line was a soft one; index 0 is unused. */
  const soft: boolean[] = [false];
  let bold = 0;
  let italic = 0;

  const push = (text: string) => {
    if (!text) return;
    const line = lines[lines.length - 1];
    const previous = line[line.length - 1];
    if (previous && previous.bold === bold > 0 && previous.italic === italic > 0) {
      previous.text += text;
      return;
    }
    line.push({ text, bold: bold > 0, italic: italic > 0 });
  };

  const walk = (children: Token[]) => {
    for (const child of children) {
      switch (child.type) {
        case "strong_open":
          bold++;
          break;
        case "strong_close":
          bold--;
          break;
        case "em_open":
          italic++;
          break;
        case "em_close":
          italic--;
          break;
        case "softbreak":
        case "hardbreak":
          lines.push([]);
          soft.push(child.type === "softbreak");
          break;
        case "text":
        case "code_inline":
          push(child.content);
          break;
        case "image":
          // Images cannot be drawn inside a text run; keep the alt text.
          push(child.content);
          break;
        default:
          // Links and anything else we do not style: keep the inner text.
          if (child.children) walk(child.children);
          else push(child.content);
      }
    }
  };

  if (token?.children) walk(token.children);

  const joined: Line[] = [];
  lines.forEach((line, index) => {
    const previous = joined[joined.length - 1];
    if (index > 0 && line.length === 0) return;
    if (previous && soft[index] && continuesSentence(previous, line)) {
      previous[previous.length - 1].text += " ";
      previous.push(...line);
      return;
    }
    joined.push(line);
  });

  return joined;
}

function alignOf(token: Token): Align {
  const style = String(token.attrGet("style") ?? "");
  if (style.includes("text-align:center")) return "center";
  if (style.includes("text-align:right")) return "right";
  return "left";
}

function parseTable(tokens: Token[], start: number): [Block, number] {
  const head: Cell[] = [];
  const body: Cell[][] = [];
  let row: Cell[] | null = null;
  let inHead = false;
  let index = start + 1;

  for (; index < tokens.length; index++) {
    const token = tokens[index];
    switch (token.type) {
      case "thead_open":
        inHead = true;
        break;
      case "thead_close":
        inHead = false;
        break;
      case "tr_open":
        row = [];
        break;
      case "tr_close":
        if (row) {
          if (inHead) head.push(...row);
          else body.push(row);
        }
        row = null;
        break;
      case "th_open":
      case "td_open": {
        const cell: Cell = { lines: inlineToLines(tokens[index + 1]), align: alignOf(token) };
        row?.push(cell);
        break;
      }
      case "table_close":
        return [{ kind: "table", head, body }, index + 1];
    }
  }

  return [{ kind: "table", head, body }, index];
}

function parseList(tokens: Token[], start: number): [Block, number] {
  const ordered = tokens[start].type === "ordered_list_open";
  const items: { marker: string; lines: Line[] }[] = [];
  let depth = 0;
  let counter = 1;
  let index = start;

  for (; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.type === "bullet_list_open" || token.type === "ordered_list_open") {
      depth++;
    } else if (token.type === "bullet_list_close" || token.type === "ordered_list_close") {
      depth--;
      if (depth === 0) return [{ kind: "list", items }, index + 1];
    } else if (token.type === "inline") {
      // Nested lists are flattened rather than indented; the schedule does not use them.
      items.push({ marker: ordered ? `${counter++}.` : "•", lines: inlineToLines(token) });
    }
  }

  return [{ kind: "list", items }, index];
}

/** Parses the schedule markdown into the blocks the PDF renderer knows how to draw. */
export function parseMarkdown(markdown: string): Block[] {
  const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
  const tokens = md.parse(markdown, {});
  const blocks: Block[] = [];
  let index = 0;

  while (index < tokens.length) {
    const token = tokens[index];

    if (token.type === "heading_open") {
      blocks.push({
        kind: "heading",
        level: Number(token.tag.slice(1)) || 1,
        lines: inlineToLines(tokens[index + 1]),
      });
      index += 3;
      continue;
    }

    if (token.type === "paragraph_open") {
      const lines = inlineToLines(tokens[index + 1]);
      if (lines.some((line) => line.length > 0)) blocks.push({ kind: "paragraph", lines });
      index += 3;
      continue;
    }

    if (token.type === "hr") {
      blocks.push({ kind: "rule" });
      index += 1;
      continue;
    }

    if (token.type === "table_open") {
      const [block, next] = parseTable(tokens, index);
      blocks.push(block);
      index = next;
      continue;
    }

    if (token.type === "bullet_list_open" || token.type === "ordered_list_open") {
      const [block, next] = parseList(tokens, index);
      blocks.push(block);
      index = next;
      continue;
    }

    index += 1;
  }

  return blocks;
}
