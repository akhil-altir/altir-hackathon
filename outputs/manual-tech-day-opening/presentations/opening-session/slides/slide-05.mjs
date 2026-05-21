import { C, addBase, title, body, panel, footerNumber, label } from "./common.mjs";

export async function slide05(presentation, ctx) {
  const slide = addBase(presentation, ctx, "OPENAI API");
  label(ctx, slide, "TEAM RESOURCE", 64, 104, 180, C.acid);
  title(ctx, slide, "Each team gets an OpenAI API key", 64, 136, 860, 54);
  panel(ctx, slide, 78, 282, 420, 236, "#0a0a0a", C.acid);
  ctx.addText(slide, { text: "$15", x: 118, y: 320, w: 220, h: 92, fontSize: 84, typeface: ctx.fonts.title, color: C.acid, bold: true });
  ctx.addText(slide, { text: "OpenAI credits per team", x: 126, y: 428, w: 280, h: 30, fontSize: 20, typeface: ctx.fonts.body, color: C.text, bold: true });
  ctx.addText(slide, { text: "Use efficiently and judiciously.", x: 126, y: 466, w: 290, h: 24, fontSize: 15, typeface: ctx.fonts.mono, color: C.dim });

  panel(ctx, slide, 550, 282, 650, 236, "#0a0a0a", C.line2);
  body(ctx, slide, "Use any available OpenAI model. Pick models based on the task: 5.3 Codex-style coding, 5.5-class reasoning, debugging, summarization, or fast iteration.", 590, 318, 550, 102, 22, C.text);
  ctx.addShape(slide, { x: 590, y: 432, w: 520, h: 1, fill: C.line2 });
  ctx.addText(slide, { text: "Do not commit keys to GitHub. Do not show keys in screenshots, logs, or demos.", x: 590, y: 462, w: 520, h: 34, fontSize: 15, typeface: ctx.fonts.mono, color: C.warn, bold: true });
  footerNumber(ctx, slide, 5);
  return slide;
}
