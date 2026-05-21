export const C = {
  bg: "#050505",
  panel: "#0b0b0b",
  panel2: "#111111",
  panel3: "#171717",
  line: "#2a2a2a",
  line2: "#3a3a3a",
  text: "#f4f4f4",
  dim: "#a6a6a6",
  faint: "#666666",
  acid: "#c4ff00",
  cyan: "#00d4ff",
  magenta: "#ff2bd6",
  warn: "#ffcc00",
};

export function addBase(presentation, ctx, section = "ALTIR TECH DAY") {
  const slide = presentation.slides.add();
  ctx.addShape(slide, { x: 0, y: 0, w: ctx.W, h: ctx.H, fill: C.bg });
  for (let x = 80; x < ctx.W; x += 160) {
    ctx.addShape(slide, { x, y: 0, w: 1, h: ctx.H, fill: "#101010" });
  }
  for (let y = 80; y < ctx.H; y += 80) {
    ctx.addShape(slide, { x: 0, y, w: ctx.W, h: 1, fill: "#101010" });
  }
  ctx.addText(slide, {
    text: section,
    x: 58,
    y: 32,
    w: 280,
    h: 24,
    fontSize: 12,
    typeface: ctx.fonts.mono,
    color: C.acid,
    bold: true,
  });
  ctx.addText(slide, {
    text: "BUILD WINDOW / LIVE DEMOS / 5:30 PM",
    x: ctx.W - 360,
    y: 32,
    w: 300,
    h: 24,
    fontSize: 11,
    typeface: ctx.fonts.mono,
    color: C.faint,
    align: "right",
  });
  ctx.addShape(slide, { x: 58, y: 66, w: ctx.W - 116, h: 1, fill: C.line });
  return slide;
}

export function label(ctx, slide, text, x, y, w = 180, color = C.dim) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h: 22,
    fontSize: 11,
    typeface: ctx.fonts.mono,
    color,
    bold: true,
  });
}

export function title(ctx, slide, text, x, y, w, size = 56) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h: size * 1.55,
    fontSize: size,
    typeface: ctx.fonts.title,
    color: C.text,
    bold: true,
  });
}

export function body(ctx, slide, text, x, y, w, h, size = 23, color = C.dim) {
  return ctx.addText(slide, {
    text,
    x,
    y,
    w,
    h,
    fontSize: size,
    typeface: ctx.fonts.body,
    color,
  });
}

export function panel(ctx, slide, x, y, w, h, fill = C.panel, line = C.line) {
  return ctx.addShape(slide, {
    x,
    y,
    w,
    h,
    fill,
    line: ctx.line(line, 1),
  });
}

export function pill(ctx, slide, text, x, y, w, color = C.acid) {
  panel(ctx, slide, x, y, w, 34, "#101010", color);
  ctx.addText(slide, {
    text,
    x: x + 12,
    y: y + 8,
    w: w - 24,
    h: 18,
    fontSize: 11,
    typeface: ctx.fonts.mono,
    color,
    bold: true,
    align: "center",
  });
}

export function footerNumber(ctx, slide, n) {
  ctx.addText(slide, {
    text: String(n).padStart(2, "0"),
    x: ctx.W - 106,
    y: ctx.H - 66,
    w: 46,
    h: 28,
    fontSize: 18,
    typeface: ctx.fonts.mono,
    color: C.faint,
    align: "right",
  });
}
