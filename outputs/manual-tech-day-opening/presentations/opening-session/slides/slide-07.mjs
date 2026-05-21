import { C, addBase, title, body, panel, footerNumber, label } from "./common.mjs";

export async function slide07(presentation, ctx) {
  const slide = addBase(presentation, ctx, "START");
  label(ctx, slide, "BUILD MODE", 64, 104, 180, C.acid);
  title(ctx, slide, "Let's start building", 64, 150, 760, 72);
  body(ctx, slide, "Make it work. Make it clear. Ship it.", 68, 266, 760, 52, 34, C.text);

  panel(ctx, slide, 118, 398, 1044, 118, "#080808", C.acid);
  ctx.addText(slide, { text: "> start build", x: 154, y: 434, w: 410, h: 46, fontSize: 34, typeface: ctx.fonts.mono, color: C.acid, bold: true });
  ctx.addText(slide, { text: "Cut scope now / build the core path first / use help early / demo live at 5:30 PM", x: 154, y: 488, w: 820, h: 24, fontSize: 14, typeface: ctx.fonts.mono, color: C.faint });
  footerNumber(ctx, slide, 7);
  return slide;
}
