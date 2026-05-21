import { C, addBase, title, body, panel, footerNumber, label } from "./common.mjs";

const rows = [
  ["STACK", "Next.js, React, Python, SQL, Supabase, Postgres, APIs, scripts, notebooks"],
  ["AI TOOLS", "Cursor, Claude, Codex, Codeium, ChatGPT, Gemini, Lovable, Replit"],
  ["HOSTING", "Vercel, Railway, Render, Replit, Netlify, Cloudflare, your own infra"],
  ["COLLAB", "Combine platforms. Ask any assistant when blocked."],
];

export async function slide04(presentation, ctx) {
  const slide = addBase(presentation, ctx, "TOOLS");
  label(ctx, slide, "OPEN CHOICE", 64, 104, 180, C.acid);
  ctx.addText(slide, {
    text: "Use whatever helps you finish",
    x: 64,
    y: 136,
    w: 760,
    h: 128,
    fontSize: 54,
    typeface: ctx.fonts.title,
    color: C.text,
    bold: true,
  });
  body(ctx, slide, "The toolchain is flexible. The demo has to work.", 68, 268, 760, 38, 23, C.text);
  rows.forEach((row, i) => {
    const y = 338 + i * 74;
    panel(ctx, slide, 78, y, 1124, 58, i % 2 ? "#090909" : "#0d0d0d", C.line);
    ctx.addText(slide, { text: row[0], x: 104, y: y + 18, w: 140, h: 20, fontSize: 13, typeface: ctx.fonts.mono, color: C.acid, bold: true });
    ctx.addText(slide, { text: row[1], x: 272, y: y + 15, w: 720, h: 24, fontSize: 17, typeface: ctx.fonts.body, color: C.text });
    ctx.addText(slide, { text: "OPEN", x: 1088, y: y + 16, w: 70, h: 20, fontSize: 12, typeface: ctx.fonts.mono, color: C.acid, bold: true, align: "center" });
  });
  footerNumber(ctx, slide, 4);
  return slide;
}
