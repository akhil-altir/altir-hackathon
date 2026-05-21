import { C, addBase, title, panel, footerNumber, label } from "./common.mjs";

const checklist = ["Repo link", "Deployment link, if applicable", "Demo video link", "Short deck / explanation", "Live demo"];

export async function slide06(presentation, ctx) {
  const slide = addBase(presentation, ctx, "SUBMIT + SCORE");
  label(ctx, slide, "JUDGING", 64, 104, 180, C.acid);
  title(ctx, slide, "Make it easy to judge", 64, 136, 720, 56);

  panel(ctx, slide, 78, 276, 520, 286, "#0a0a0a", C.line2);
  ctx.addText(slide, { text: "SUBMISSION", x: 112, y: 306, w: 180, h: 24, fontSize: 13, typeface: ctx.fonts.mono, color: C.acid, bold: true });
  checklist.forEach((item, i) => {
    const y = 352 + i * 34;
    ctx.addShape(slide, { x: 116, y: y + 3, w: 14, h: 14, fill: C.panel3, line: ctx.line(C.acid, 1) });
    ctx.addText(slide, { text: item, x: 150, y, w: 360, h: 22, fontSize: 18, typeface: ctx.fonts.body, color: C.text });
  });

  panel(ctx, slide, 668, 276, 534, 286, "#0a0a0a", C.line2);
  ctx.addText(slide, { text: "SCORING", x: 702, y: 306, w: 180, h: 24, fontSize: 13, typeface: ctx.fonts.mono, color: C.acid, bold: true });
  ctx.addText(slide, { text: "60%", x: 720, y: 350, w: 170, h: 70, fontSize: 58, typeface: ctx.fonts.title, color: C.text, bold: true });
  ctx.addText(slide, { text: "Judge score", x: 730, y: 424, w: 180, h: 24, fontSize: 17, typeface: ctx.fonts.body, color: C.dim });
  ctx.addText(slide, { text: "40%", x: 958, y: 350, w: 170, h: 70, fontSize: 58, typeface: ctx.fonts.title, color: C.acid, bold: true });
  ctx.addText(slide, { text: "Event score", x: 968, y: 424, w: 180, h: 24, fontSize: 17, typeface: ctx.fonts.body, color: C.dim });
  ctx.addText(slide, { text: "YouTube private/unlisted links are fine if accessible. Personal or company GitHub repos are fine if judges can access them. Do not expose secrets or private data.", x: 704, y: 484, w: 440, h: 54, fontSize: 14, typeface: ctx.fonts.body, color: C.dim });

  footerNumber(ctx, slide, 6);
  return slide;
}
