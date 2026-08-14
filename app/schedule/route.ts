import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderSchedulePdf } from "@/lib/schedule/pdf";

// The schedule only changes when content/schedule.md is edited, so build the PDF
// once at build time and serve it as a static asset.
export const dynamic = "force-static";

const FILENAME = "slsgb-nationals-2026-entertainment-schedule.pdf";

export async function GET() {
  const source = path.join(process.cwd(), "content", "schedule.md");
  const pdf = await renderSchedulePdf(await readFile(source, "utf8"));

  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(pdf.byteLength),
      // `inline` so it opens in the browser; the filename applies if it is saved.
      "Content-Disposition": `inline; filename="${FILENAME}"`,
    },
  });
}
