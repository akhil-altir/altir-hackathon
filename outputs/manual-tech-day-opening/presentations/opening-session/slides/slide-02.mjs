import { C, addBase, title, body, panel, footerNumber, label } from "./common.mjs";

export async function slide02(presentation, ctx) {
  const slide = addBase(presentation, ctx, "CONTEXT");
  label(ctx, slide, "THE CONSTRAINT", 64, 104, 220, C.acid);
  title(ctx, slide, "Most demos fail because the scope is too big", 64, 136, 920, 48);
  body(ctx, slide, "You already have a team. You likely have an idea. Now cut it down.", 68, 258, 790, 48, 26, C.text);

  panel(ctx, slide, 78, 370, 500, 170, "#0b0b0b", C.line2);
  ctx.addText(slide, { text: "TOO MUCH SCOPE", x: 110, y: 404, w: 220, h: 24, fontSize: 13, typeface: ctx.fonts.mono, color: C.magenta, bold: true });
  ctx.addText(slide, { text: "Unfinished demo", x: 110, y: 448, w: 360, h: 48, fontSize: 34, typeface: ctx.fonts.title, color: C.text, bold: true });
  ctx.addShape(slide, { x: 108, y: 512, w: 390, h: 2, fill: C.magenta });

  panel(ctx, slide, 700, 370, 500, 170, "#0b0b0b", C.line2);
  ctx.addText(slide, { text: "SHARP SCOPE", x: 732, y: 404, w: 180, h: 24, fontSize: 13, typeface: ctx.fonts.mono, color: C.acid, bold: true });
  ctx.addText(slide, { text: "Demoable", x: 732, y: 448, w: 330, h: 48, fontSize: 38, typeface: ctx.fonts.title, color: C.text, bold: true });
  ctx.addShape(slide, { x: 730, y: 512, w: 390, h: 2, fill: C.acid });

  body(ctx, slide, "Pick the smallest version that proves the value. Build that insanely well.", 232, 596, 820, 42, 22, C.dim);
  footerNumber(ctx, slide, 2);
  return slide;
}
