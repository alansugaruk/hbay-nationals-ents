This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Entertainment schedule PDF

[`content/schedule.md`](content/schedule.md) is the single source of truth for the
entertainment schedule. Edit that file — plain markdown headings, paragraphs and
tables — and the PDF at [`/schedule`](http://localhost:3000/schedule) follows. There
is no separate PDF to regenerate or commit.

The PDF is built by [`lib/schedule/pdf.ts`](lib/schedule/pdf.ts) from the parsed
markdown, and served by [`app/schedule/route.ts`](app/schedule/route.ts). The route is
`force-static`, so the PDF is rendered once during `next build` and then served as a
static asset.

Notes for editing the markdown:

- `##` headings start a new day. Each day is kept on a single page where it fits.
- Tables may have any number of columns; column widths are measured from the content,
  and a table longer than a page repeats its header row on the next one.
- `**bold**` and `*italics*` work in paragraphs and in table cells.
- `---` between days is optional — the day heading is its own separator, so a rule
  immediately before a heading is not drawn.
- Text is set in Helvetica, so characters outside its WinAnsi range (emoji, for
  example) are dropped from the PDF rather than failing the build.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
