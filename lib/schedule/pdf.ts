import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, type RGB } from "pdf-lib";
import { parseMarkdown, type Align, type Block, type Cell, type Line } from "./markdown";

// A4 portrait, in PostScript points.
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = { top: 52, right: 46, bottom: 30, left: 46 };
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN.left - MARGIN.right;
/** Lowest y that body content may occupy; below it sits the page footer. */
const CONTENT_BOTTOM = MARGIN.bottom + 22;
const PAGE_CAPACITY = PAGE_HEIGHT - MARGIN.top - CONTENT_BOTTOM;

// The site's navy/cyan palette, shifted for ink on white paper.
const NAVY = rgb(0.039, 0.086, 0.157);
const CYAN = rgb(0.024, 0.549, 0.678);
const INK = rgb(0.118, 0.161, 0.216);
const MUTED = rgb(0.322, 0.404, 0.51);
const HAIRLINE = rgb(0.867, 0.898, 0.937);
const ZEBRA = rgb(0.961, 0.973, 0.988);
const PAPER = rgb(1, 1, 1);

const TITLE_SIZE = 21;
const LEAD_SIZE = 10.5;
const DAY_SIZE = 13;
const MINOR_SIZE = 11;
const NOTE_SIZE = 9.5;
const CELL_SIZE = 9.5;
const HEAD_SIZE = 8.5;
const FOOTER_SIZE = 7.5;

const LINE_RATIO = 1.34;
/** Distance from the top of a line box down to its baseline, in ems. */
const BASELINE_RATIO = 0.94;
const CELL_PAD_X = 6;
const CELL_PAD_Y = 5;

/** Characters with no WinAnsi equivalent that still have an obvious ASCII stand-in. */
const SUBSTITUTIONS: Record<string, string> = {
  "\u00a0": " ", // no-break space
  "\u2007": " ", // figure space
  "\u2009": " ", // thin space
  "\u202f": " ", // narrow no-break space
  "\u2011": "-", // non-breaking hyphen
  "\u2012": "-", // figure dash
  "\u2015": "-", // horizontal bar
  "\u2212": "-", // minus sign
  "\u2190": "<-",
  "\u2192": "->",
  "\u21d2": "=>",
  "\u2264": "<=",
  "\u2265": ">=",
};

/** Code points above U+00FF that WinAnsi — the standard-font encoding — can represent. */
const WINANSI_HIGH = new Set([
  0x0152, 0x0153, 0x0160, 0x0161, 0x0178, 0x017d, 0x017e, 0x0192, 0x02c6, 0x02dc, 0x2013, 0x2014,
  0x2018, 0x2019, 0x201a, 0x201c, 0x201d, 0x201e, 0x2020, 0x2021, 0x2022, 0x2026, 0x2030, 0x2039,
  0x203a, 0x20ac, 0x2122,
]);

/**
 * Drops anything the standard PDF fonts cannot encode. Without this an emoji or a
 * stray arrow pasted into the markdown would fail the build instead of the page.
 */
function sanitize(text: string): string {
  let out = "";
  for (const char of text) {
    const substitution = SUBSTITUTIONS[char];
    if (substitution !== undefined) {
      out += substitution;
      continue;
    }
    const code = char.codePointAt(0) as number;
    if (code === 0x09) out += " ";
    else if (code < 0x20 || (code >= 0x7f && code <= 0x9f)) continue;
    else if (code <= 0xff || WINANSI_HIGH.has(code)) out += char;
  }
  return out;
}

type Fonts = { regular: PDFFont; bold: PDFFont; italic: PDFFont; boldItalic: PDFFont };

function fontFor(fonts: Fonts, bold: boolean, italic: boolean): PDFFont {
  if (bold && italic) return fonts.boldItalic;
  if (bold) return fonts.bold;
  if (italic) return fonts.italic;
  return fonts.regular;
}

/** A run of text measured at a fixed size. */
type Piece = { text: string; font: PDFFont; width: number; bold: boolean };
/** An unbreakable cluster of pieces — a word, possibly spanning an emphasis boundary. */
type Word = { pieces: Piece[]; width: number };

/**
 * Splits a styled line into measured words. Runs that touch without whitespace
 * (`**Bold**text`) stay glued into a single word.
 */
function toWords(line: Line, size: number, fonts: Fonts): Word[] {
  const words: Word[] = [];
  let current: Word | null = null;

  for (const run of line) {
    const font = fontFor(fonts, run.bold, run.italic);
    for (const chunk of sanitize(run.text).split(/(\s+)/)) {
      if (chunk === "") continue;
      if (/^\s+$/.test(chunk)) {
        current = null;
        continue;
      }
      const piece: Piece = {
        text: chunk,
        font,
        width: font.widthOfTextAtSize(chunk, size),
        bold: run.bold,
      };
      if (current) {
        current.pieces.push(piece);
        current.width += piece.width;
      } else {
        current = { pieces: [piece], width: piece.width };
        words.push(current);
      }
    }
  }

  return words;
}

/** Chops a word that is wider than its column into pieces that do fit. */
function breakWord(word: Word, maxWidth: number, size: number): Word[] {
  const parts: Word[] = [];
  let pieces: Piece[] = [];
  let width = 0;

  const flush = () => {
    if (pieces.length === 0) return;
    parts.push({ pieces, width });
    pieces = [];
    width = 0;
  };

  for (const piece of word.pieces) {
    let text = "";
    let textWidth = 0;
    for (const char of piece.text) {
      const charWidth = piece.font.widthOfTextAtSize(char, size);
      if (text !== "" && width + textWidth + charWidth > maxWidth) {
        pieces.push({ ...piece, text, width: textWidth });
        width += textWidth;
        flush();
        text = "";
        textWidth = 0;
      }
      text += char;
      textWidth += charWidth;
    }
    if (text !== "") {
      pieces.push({ ...piece, text, width: textWidth });
      width += textWidth;
    }
  }

  flush();
  return parts.length > 0 ? parts : [word];
}

function wrap(words: Word[], maxWidth: number, spaceWidth: number, size: number): Word[][] {
  const lines: Word[][] = [];
  let line: Word[] = [];
  let width = 0;

  for (const word of words) {
    if (line.length > 0 && width + spaceWidth + word.width > maxWidth) {
      lines.push(line);
      line = [];
      width = 0;
    }
    if (word.width > maxWidth) {
      for (const part of breakWord(word, maxWidth, size)) {
        if (line.length > 0) lines.push(line);
        line = [part];
        width = part.width;
      }
      continue;
    }
    if (line.length > 0) width += spaceWidth;
    line.push(word);
    width += word.width;
  }

  if (line.length > 0) lines.push(line);
  return lines.length > 0 ? lines : [[]];
}

function lineWidth(words: Word[], spaceWidth: number): number {
  const total = words.reduce((sum, word) => sum + word.width, 0);
  return total + Math.max(0, words.length - 1) * spaceWidth;
}

function offsetFor(align: Align, available: number, used: number): number {
  if (align === "right") return Math.max(0, available - used);
  if (align === "center") return Math.max(0, (available - used) / 2);
  return 0;
}

type TextStyle = { size: number; color: RGB; strongColor?: RGB };

function drawWords(
  page: PDFPage,
  words: Word[],
  x: number,
  baseline: number,
  style: TextStyle,
  spaceWidth: number,
): void {
  let cursor = x;
  words.forEach((word, index) => {
    if (index > 0) cursor += spaceWidth;
    for (const piece of word.pieces) {
      page.drawText(piece.text, {
        x: cursor,
        y: baseline,
        size: style.size,
        font: piece.font,
        color: piece.bold && style.strongColor ? style.strongColor : style.color,
      });
      cursor += piece.width;
    }
  });
}

/** A text block already wrapped to a known width, so its height is known before drawing. */
type LaidText = { lines: Word[][]; style: TextStyle; spaceWidth: number; height: number };

function layoutText(lines: Line[], width: number, style: TextStyle, fonts: Fonts): LaidText {
  const spaceWidth = fonts.regular.widthOfTextAtSize(" ", style.size);
  const visual: Word[][] = [];
  for (const line of lines) {
    visual.push(...wrap(toWords(line, style.size, fonts), width, spaceWidth, style.size));
  }
  return {
    lines: visual,
    style,
    spaceWidth,
    height: visual.length * style.size * LINE_RATIO,
  };
}

type LaidCell = { lines: Word[][]; align: Align };
type LaidRow = { cells: LaidCell[]; height: number };
type LaidTable = {
  widths: number[];
  width: number;
  header: LaidRow | null;
  rows: LaidRow[];
  spaceWidth: number;
};

/** Widest single word in a cell, which is the narrowest the column can usefully be. */
function widestWord(words: Word[]): number {
  return words.reduce((max, word) => Math.max(max, word.width), 0);
}

/**
 * Column widths from content: start from the width each column would like, then
 * either share out the slack or shrink the greedy columns down towards their
 * longest word.
 */
function measureColumns(head: Cell[], body: Cell[][], columns: number, fonts: Fonts): number[] {
  const natural = new Array<number>(columns).fill(0);
  const minimum = new Array<number>(columns).fill(0);

  const consider = (cells: Cell[], size: number) => {
    const spaceWidth = fonts.regular.widthOfTextAtSize(" ", size);
    for (let column = 0; column < columns; column++) {
      for (const line of cells[column]?.lines ?? []) {
        const words = toWords(line, size, fonts);
        natural[column] = Math.max(natural[column], lineWidth(words, spaceWidth));
        minimum[column] = Math.max(minimum[column], widestWord(words));
      }
    }
  };

  if (head.length > 0) consider(head, HEAD_SIZE);
  for (const row of body) consider(row, CELL_SIZE);

  const available = CONTENT_WIDTH - columns * 2 * CELL_PAD_X;
  const widths = [...natural];
  const total = () => widths.reduce((sum, width) => sum + width, 0);

  // Shrink proportionally, holding each column at or above its longest word.
  for (let pass = 0; pass < 8 && total() > available; pass++) {
    const flexible = widths.map((width, column) => width > minimum[column] + 0.01);
    const fixed = widths.reduce((sum, width, column) => (flexible[column] ? sum : sum + width), 0);
    const flex = widths.reduce((sum, width, column) => (flexible[column] ? sum + width : sum), 0);
    const target = available - fixed;
    if (flex <= 0 || target <= 0) break;
    const scale = target / flex;
    if (scale >= 1) break;
    for (let column = 0; column < columns; column++) {
      if (flexible[column]) widths[column] = Math.max(minimum[column], widths[column] * scale);
    }
  }

  // Content narrower than the page: share the slack so the table spans the text column.
  const slack = available - total();
  const naturalTotal = natural.reduce((sum, width) => sum + width, 0);
  if (slack > 0) {
    for (let column = 0; column < columns; column++) {
      widths[column] +=
        naturalTotal > 0 ? (slack * natural[column]) / naturalTotal : slack / columns;
    }
  } else if (slack < 0) {
    // Even the longest words overflow: scale everything and let breakWord cope.
    const shrink = available / total();
    for (let column = 0; column < columns; column++) widths[column] *= shrink;
  }

  return widths.map((width) => width + 2 * CELL_PAD_X);
}

function layoutRow(
  cells: Cell[],
  widths: number[],
  columns: number,
  size: number,
  fonts: Fonts,
): LaidRow {
  const spaceWidth = fonts.regular.widthOfTextAtSize(" ", size);
  const laid: LaidCell[] = [];
  let tallest = 1;

  for (let column = 0; column < columns; column++) {
    const cell = cells[column];
    const inner = widths[column] - 2 * CELL_PAD_X;
    const visual: Word[][] = [];
    for (const line of cell?.lines ?? []) {
      visual.push(...wrap(toWords(line, size, fonts), inner, spaceWidth, size));
    }
    if (visual.length === 0) visual.push([]);
    tallest = Math.max(tallest, visual.length);
    laid.push({ lines: visual, align: cell?.align ?? "left" });
  }

  return { cells: laid, height: tallest * size * LINE_RATIO + 2 * CELL_PAD_Y };
}

function layoutTable(head: Cell[], body: Cell[][], fonts: Fonts): LaidTable {
  const columns = Math.max(head.length, ...body.map((row) => row.length), 1);
  const widths = measureColumns(head, body, columns, fonts);
  // Header labels always print bold, whatever the markdown says.
  const boldHead = head.map((cell) => ({
    ...cell,
    lines: cell.lines.map((line) => line.map((run) => ({ ...run, bold: true }))),
  }));

  return {
    widths,
    width: widths.reduce((sum, width) => sum + width, 0),
    header: head.length > 0 ? layoutRow(boldHead, widths, columns, HEAD_SIZE, fonts) : null,
    rows: body.map((row) => layoutRow(row, widths, columns, CELL_SIZE, fonts)),
    spaceWidth: fonts.regular.widthOfTextAtSize(" ", CELL_SIZE),
  };
}

type Rule = { color: RGB; thickness: number; gap: number };

type Item =
  | { type: "text"; gapBefore: number; text: LaidText; rule?: Rule }
  | { type: "table"; gapBefore: number; table: LaidTable }
  | { type: "rule"; gapBefore: number; rule: Rule };

function itemHeight(item: Item): number {
  switch (item.type) {
    case "text":
      return (
        item.gapBefore + item.text.height + (item.rule ? item.rule.gap + item.rule.thickness : 0)
      );
    case "rule":
      return item.gapBefore + item.rule.gap + item.rule.thickness;
    case "table":
      return (
        item.gapBefore +
        (item.table.header?.height ?? 0) +
        item.table.rows.reduce((sum, row) => sum + row.height, 0)
      );
  }
}

/** Tracks the current page and the y cursor, adding pages as content runs off the bottom. */
class Writer {
  page: PDFPage;
  readonly pages: PDFPage[] = [];
  y = 0;
  atTop = true;
  private readonly doc: PDFDocument;

  constructor(doc: PDFDocument) {
    this.doc = doc;
    this.page = this.addPage();
  }

  private addPage(): PDFPage {
    const page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pages.push(page);
    this.page = page;
    this.y = PAGE_HEIGHT - MARGIN.top;
    this.atTop = true;
    return page;
  }

  newPage(): void {
    this.addPage();
  }

  get remaining(): number {
    return this.y - CONTENT_BOTTOM;
  }

  advance(height: number): void {
    this.y -= height;
    this.atTop = false;
  }
}

function drawText(writer: Writer, text: LaidText): void {
  for (const words of text.lines) {
    const baseline = writer.y - text.style.size * BASELINE_RATIO;
    drawWords(writer.page, words, MARGIN.left, baseline, text.style, text.spaceWidth);
    writer.advance(text.style.size * LINE_RATIO);
  }
}

function drawRule(writer: Writer, rule: Rule, width: number): void {
  writer.advance(rule.gap);
  writer.page.drawRectangle({
    x: MARGIN.left,
    y: writer.y - rule.thickness,
    width,
    height: rule.thickness,
    color: rule.color,
  });
  writer.advance(rule.thickness);
}

function drawRow(writer: Writer, table: LaidTable, row: LaidRow, band: number | null): void {
  const page = writer.page;
  const top = writer.y;
  const isHeader = band === null;
  const size = isHeader ? HEAD_SIZE : CELL_SIZE;

  if (isHeader) {
    page.drawRectangle({
      x: MARGIN.left,
      y: top - row.height,
      width: table.width,
      height: row.height,
      color: NAVY,
    });
  } else if (band % 2 === 1) {
    page.drawRectangle({
      x: MARGIN.left,
      y: top - row.height,
      width: table.width,
      height: row.height,
      color: ZEBRA,
    });
    page.drawRectangle({
      x: MARGIN.left,
      y: top - row.height,
      width: table.width,
      height: 0.5,
      color: HAIRLINE,
    });
  } else {
    page.drawRectangle({
      x: MARGIN.left,
      y: top - row.height,
      width: table.width,
      height: 0.5,
      color: HAIRLINE,
    });
  }

  const style: TextStyle = isHeader
    ? { size, color: PAPER }
    : { size, color: INK, strongColor: NAVY };
  const spaceWidth = isHeader ? table.spaceWidth * (HEAD_SIZE / CELL_SIZE) : table.spaceWidth;

  let x = MARGIN.left;
  row.cells.forEach((cell, column) => {
    const inner = table.widths[column] - 2 * CELL_PAD_X;
    let lineTop = top - CELL_PAD_Y;
    for (const words of cell.lines) {
      const offset = offsetFor(cell.align, inner, lineWidth(words, spaceWidth));
      drawWords(
        page,
        words,
        x + CELL_PAD_X + offset,
        lineTop - size * BASELINE_RATIO,
        style,
        spaceWidth,
      );
      lineTop -= size * LINE_RATIO;
    }
    x += table.widths[column];
  });

  writer.advance(row.height);
}

function drawTable(writer: Writer, table: LaidTable): void {
  const headerHeight = table.header?.height ?? 0;
  if (headerHeight + (table.rows[0]?.height ?? 0) > writer.remaining) writer.newPage();
  if (table.header) drawRow(writer, table, table.header, null);

  table.rows.forEach((row, index) => {
    if (row.height > writer.remaining) {
      writer.newPage();
      // Repeat the header so a continued table still labels its columns.
      if (table.header) drawRow(writer, table, table.header, null);
    }
    drawRow(writer, table, row, index);
  });
}

function drawItem(writer: Writer, item: Item): void {
  // A gap at the very top of a page would just push content away from the margin.
  if (!writer.atTop) writer.advance(item.gapBefore);

  switch (item.type) {
    case "text":
      drawText(writer, item.text);
      if (item.rule) drawRule(writer, item.rule, CONTENT_WIDTH);
      break;
    case "rule":
      drawRule(writer, item.rule, CONTENT_WIDTH);
      break;
    case "table":
      drawTable(writer, item.table);
      break;
  }
}

/** Turns parsed blocks into laid-out items, grouped so each day can stay on one page. */
function layoutBlocks(blocks: Block[], fonts: Fonts): Item[][] {
  const sections: Item[][] = [[]];
  let seenTitle = false;
  let afterTitle = false;

  const push = (item: Item) => sections[sections.length - 1].push(item);

  blocks.forEach((block, index) => {
    switch (block.kind) {
      case "heading": {
        if (block.level <= 2 && sections[sections.length - 1].length > 0) sections.push([]);
        if (!seenTitle && block.level === 1) {
          seenTitle = true;
          afterTitle = true;
          push({
            type: "text",
            gapBefore: 0,
            text: layoutText(block.lines, CONTENT_WIDTH, { size: TITLE_SIZE, color: NAVY }, fonts),
            rule: { color: CYAN, thickness: 2.5, gap: 9 },
          });
          return;
        }
        const size = block.level <= 2 ? DAY_SIZE : MINOR_SIZE;
        push({
          type: "text",
          gapBefore: block.level <= 2 ? 20 : 14,
          text: layoutText(block.lines, CONTENT_WIDTH, { size, color: NAVY }, fonts),
          rule: block.level <= 2 ? { color: HAIRLINE, thickness: 0.75, gap: 5 } : undefined,
        });
        return;
      }

      case "paragraph": {
        const size = afterTitle ? LEAD_SIZE : NOTE_SIZE;
        push({
          type: "text",
          gapBefore: afterTitle ? 13 : 9,
          text: layoutText(
            block.lines,
            CONTENT_WIDTH,
            { size, color: MUTED, strongColor: NAVY },
            fonts,
          ),
        });
        afterTitle = false;
        return;
      }

      case "list": {
        block.items.forEach((item, itemIndex) => {
          const lines: Line[] = item.lines.map((line, lineIndex) =>
            lineIndex === 0
              ? [{ text: `${item.marker} `, bold: false, italic: false }, ...line]
              : line,
          );
          push({
            type: "text",
            gapBefore: itemIndex === 0 ? 9 : 2,
            text: layoutText(
              lines,
              CONTENT_WIDTH,
              { size: NOTE_SIZE, color: MUTED, strongColor: NAVY },
              fonts,
            ),
          });
        });
        afterTitle = false;
        return;
      }

      case "table":
        push({ type: "table", gapBefore: 11, table: layoutTable(block.head, block.body, fonts) });
        afterTitle = false;
        return;

      case "rule": {
        // `---` in the source separates days, and the day heading already does that
        // visually — so only draw a divider when it is not introducing a heading.
        const next = blocks[index + 1];
        if (next?.kind === "heading" && next.level <= 2) return;
        push({ type: "rule", gapBefore: 14, rule: { color: HAIRLINE, thickness: 0.75, gap: 0 } });
        afterTitle = false;
        return;
      }
    }
  });

  return sections.filter((section) => section.length > 0);
}

function plainText(lines: Line[]): string {
  // Sanitised here too: this label is drawn directly rather than through the
  // word splitter, so dropped glyphs must not leave doubled spaces behind.
  return sanitize(lines.map((line) => line.map((run) => run.text).join("")).join(" "))
    .replace(/\s+/g, " ")
    .trim();
}

function drawFooters(writer: Writer, label: string, fonts: Fonts): void {
  const total = writer.pages.length;
  writer.pages.forEach((page, index) => {
    const right = `Page ${index + 1} of ${total}`;
    const y = MARGIN.bottom;
    page.drawText(label, {
      x: MARGIN.left,
      y,
      size: FOOTER_SIZE,
      font: fonts.regular,
      color: MUTED,
    });
    page.drawText(right, {
      x: PAGE_WIDTH - MARGIN.right - fonts.regular.widthOfTextAtSize(right, FOOTER_SIZE),
      y,
      size: FOOTER_SIZE,
      font: fonts.regular,
      color: MUTED,
    });
  });
}

/** Renders the schedule markdown as a print-ready A4 PDF. */
export async function renderSchedulePdf(markdown: string): Promise<Uint8Array> {
  const blocks = parseMarkdown(markdown);
  const doc = await PDFDocument.create();
  const fonts: Fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    italic: await doc.embedFont(StandardFonts.HelveticaOblique),
    boldItalic: await doc.embedFont(StandardFonts.HelveticaBoldOblique),
  };

  const title = blocks.find((block) => block.kind === "heading" && block.level === 1);
  const label = title?.kind === "heading" ? plainText(title.lines) : "Entertainment Schedule";

  doc.setTitle(label);
  doc.setSubject("Entertainment schedule, Beach Marquee, Holywell Bay");
  doc.setCreator("hbay-nationals-ents");
  doc.setLanguage("en-GB");

  const writer = new Writer(doc);
  for (const section of layoutBlocks(blocks, fonts)) {
    const height = section.reduce((sum, item) => sum + itemHeight(item), 0);
    // Keep a day together when it would fit on a page of its own.
    if (height > writer.remaining && height <= PAGE_CAPACITY && !writer.atTop) writer.newPage();
    for (const item of section) drawItem(writer, item);
  }

  drawFooters(writer, label, fonts);
  return doc.save();
}
