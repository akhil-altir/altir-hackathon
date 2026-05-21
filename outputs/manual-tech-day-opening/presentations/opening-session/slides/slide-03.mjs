import { C, addBase, title, panel, footerNumber, label } from "./common.mjs";

const events = [
  ["1:00 PM", "Keys + setup", "env setup starts"],
  ["1:30 PM", "Build starts", "4-hour window"],
  ["5:00 PM", "Early bonus", "submit early = bonus"],
  ["5:30 PM", "Submissions + demos", "live judging"],
];

export async function slide03(presentation, ctx) {
  const slide = addBase(presentation, ctx, "RUN OF SHOW");
  label(ctx, slide, "TIMELINE", 64, 104, 180, C.acid);
  title(ctx, slide, "Timeline", 64, 136, 520, 60);
  ctx.addShape(slide, { x: 136, y: 376, w: 954, h: 3, fill: C.line2 });
  events.forEach((ev, i) => {
    const x = 148 + i * 310;
    const active = i === 1 || i === 3;
    ctx.addShape(slide, { x: x - 8, y: 360, w: 34, h: 34, fill: active ? C.acid : C.panel3, line: ctx.line(active ? C.acid : C.line2, 1) });
    ctx.addText(slide, { text: String(i + 1).padStart(2, "0"), x: x - 2, y: 369, w: 22, h: 14, fontSize: 10, typeface: ctx.fonts.mono, color: active ? C.bg : C.dim, bold: true, align: "center" });
    panel(ctx, slide, x - 70, 426, 250, 118, "#0a0a0a", active ? C.acid : C.line2);
    ctx.addText(slide, { text: ev[0], x: x - 48, y: 450, w: 206, h: 28, fontSize: 23, typeface: ctx.fonts.mono, color: active ? C.acid : C.text, bold: true, align: "center" });
    ctx.addText(slide, { text: ev[1], x: x - 52, y: 488, w: 214, h: 22, fontSize: 15, typeface: ctx.fonts.body, color: C.text, bold: true, align: "center" });
    ctx.addText(slide, { text: ev[2], x: x - 52, y: 518, w: 214, h: 18, fontSize: 11, typeface: ctx.fonts.mono, color: C.faint, align: "center" });
  });
  footerNumber(ctx, slide, 3);
  return slide;
}
