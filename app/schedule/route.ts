import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "hbay-nationals-entertainment.pdf"
  );
  const file = await readFile(filePath);

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="hbay-nationals-entertainment.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
