import { C, addBase, title, body, panel, pill, footerNumber } from "./common.mjs";

export async function slide01(presentation, ctx) {
  const slide = addBase(presentation, ctx);
  panel(ctx, slide, 58, 112, 1164, 482, "#070707", C.line2);
  ctx.addShape(slide, { x: 58, y: 112, w: 9, h: 482, fill: C.acid });
  ctx.addText(slide, {
    text: "ALTIR",
    x: 104,
    y: 152,
    w: 320,
    h: 54,
    fontSize: 44,
    typeface: ctx.fonts.mono,
    color: C.acid,
    bold: true,
  });
  title(ctx, slide, "Tech Day", 104, 208, 720, 84);
  body(ctx, slide, "Four hours to build, ship, and demo something useful.", 108, 326, 760, 70, 30, C.text);
  pill(ctx, slide, "MAY 22", 104, 454, 120);
  pill(ctx, slide, "4-HOUR BUILD WINDOW", 240, 454, 230);
  pill(ctx, slide, "LIVE DEMOS", 486, 454, 150);
  ctx.addText(slide, {
    text: "OPENING SESSION",
    x: 884,
    y: 484,
    w: 250,
    h: 26,
    fontSize: 14,
    typeface: ctx.fonts.mono,
    color: C.faint,
    align: "right",
  });
  footerNumber(ctx, slide, 1);
  return slide;
}
