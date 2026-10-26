// Generates demo mockup images into public/products. Run: node scripts/generate-product-images.mjs
import sharp from "sharp"
import { mkdirSync } from "node:fs"

const OUT = new URL("../public/products/", import.meta.url).pathname
mkdirSync(OUT, { recursive: true })

const PRODUCTS = {
  "standard-business-card": { kind: "card", w: 90, h: 55, accent: "#1f4e79" },
  "premium-soft-touch-business-card": { kind: "card", w: 90, h: 55, accent: "#111111", dark: true },
  "square-business-card": { kind: "card", w: 65, h: 65, accent: "#b4532a" },
  "a5-flyer": { kind: "flyer", w: 148, h: 210, accent: "#c0392b" },
  "a4-flyer": { kind: "flyer", w: 210, h: 297, accent: "#2471a3" },
  "dl-flyer": { kind: "flyer", w: 99, h: 210, accent: "#1e8449" },
  "a4-folded-brochure": { kind: "fold", w: 210, h: 297, panels: 2, accent: "#6c3483" },
  "tri-fold-brochure": { kind: "fold", w: 297, h: 210, panels: 3, accent: "#117a65" },
  "stapled-booklet": { kind: "booklet", w: 148, h: 210, accent: "#b9770e" },
}

const S = 800
const bg = (extra = "") => `<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f3f4f6"/><stop offset="1" stop-color="#d9dde3"/></linearGradient>
<filter id="sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="14" stdDeviation="14" flood-opacity="0.28"/></filter>${extra}</defs>
<rect width="${S}" height="${S}" fill="url(#bg)"/>`

const fit = (w, h, max) => {
  const k = max / Math.max(w, h)
  return [w * k, h * k]
}

function face(x, y, w, h, p, side, label) {
  const dark = p.dark
  const base = dark ? "#16181d" : "#ffffff"
  const ink = dark ? "#ffffff" : "#1b1f24"
  const sub = dark ? "#9aa0a6" : "#6b7280"
  let g = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${base}" rx="3"/>`
  const u = Math.min(w, h) / 100
  if (p.kind === "card" || p.kind === "booklet" && false) {
    if (side === "front") {
      g += `<rect x="${x}" y="${y}" width="${w * 0.06}" height="${h}" fill="${p.accent}"/>`
      g += `<circle cx="${x + w * 0.2}" cy="${y + h * 0.28}" r="${u * 7}" fill="${p.accent}"/>`
      g += `<rect x="${x + w * 0.34}" y="${y + h * 0.22}" width="${w * 0.45}" height="${u * 5}" fill="${ink}"/>`
      g += `<rect x="${x + w * 0.34}" y="${y + h * 0.34}" width="${w * 0.3}" height="${u * 3}" fill="${sub}"/>`
    } else {
      for (let i = 0; i < 4; i++) {
        g += `<rect x="${x + w * 0.14}" y="${y + h * (0.25 + i * 0.14)}" width="${w * (0.55 - i * 0.05)}" height="${u * 3}" fill="${i ? sub : ink}"/>`
      }
      g += `<rect x="${x + w * 0.72}" y="${y + h * 0.62}" width="${w * 0.18}" height="${w * 0.18}" fill="${p.accent}"/>`
    }
  } else if (p.kind === "flyer") {
    if (side === "front") {
      g += `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.42}" fill="${p.accent}"/>`
      g += `<rect x="${x + w * 0.1}" y="${y + h * 0.12}" width="${w * 0.7}" height="${h * 0.06}" fill="#fff"/>`
      g += `<rect x="${x + w * 0.1}" y="${y + h * 0.23}" width="${w * 0.45}" height="${h * 0.03}" fill="#ffffffcc"/>`
      for (let i = 0; i < 6; i++) {
        g += `<rect x="${x + w * 0.1}" y="${y + h * (0.52 + i * 0.05)}" width="${w * (0.8 - (i % 3) * 0.12)}" height="${h * 0.014}" fill="${sub}" opacity="0.7"/>`
      }
      g += `<rect x="${x + w * 0.1}" y="${y + h * 0.86}" width="${w * 0.3}" height="${h * 0.06}" fill="${p.accent}" rx="2"/>`
    } else {
      g += `<rect x="${x + w * 0.1}" y="${y + h * 0.08}" width="${w * 0.8}" height="${h * 0.3}" fill="${p.accent}" opacity="0.18"/>`
      for (let i = 0; i < 9; i++) {
        g += `<rect x="${x + w * 0.1}" y="${y + h * (0.45 + i * 0.05)}" width="${w * (0.8 - (i % 4) * 0.1)}" height="${h * 0.014}" fill="${sub}" opacity="0.7"/>`
      }
    }
  } else {
    g += `<rect x="${x}" y="${y}" width="${w}" height="${h * 0.5}" fill="${p.accent}"/>`
    g += `<rect x="${x + w * 0.12}" y="${y + h * 0.16}" width="${w * 0.7}" height="${h * 0.07}" fill="#fff"/>`
    g += `<rect x="${x + w * 0.12}" y="${y + h * 0.58}" width="${w * 0.6}" height="${h * 0.02}" fill="${ink}"/>`
    for (let i = 0; i < 5; i++) {
      g += `<rect x="${x + w * 0.12}" y="${y + h * (0.65 + i * 0.05)}" width="${w * 0.7}" height="${h * 0.012}" fill="${sub}" opacity="0.7"/>`
    }
  }
  if (label) g += `<text x="${x + w / 2}" y="${y + h + 34}" text-anchor="middle" font-family="Arial" font-size="20" fill="#4b5563">${label}</text>`
  return g
}

function front(p) {
  const [w, h] = fit(p.w, p.h, p.kind === "card" ? 520 : 560)
  const panels = p.panels ?? 1
  const x = (S - w) / 2
  const y = (S - h) / 2 - 10
  let g = `<g filter="url(#sh)">`
  if (p.kind === "fold") {
    const pw = w / panels
    for (let i = 0; i < panels; i++) g += face(x + i * pw, y, pw, h, p, i === 0 ? "front" : "back")
  } else {
    g += face(x, y, w, h, p, "front")
  }
  g += `</g>`
  if (p.kind === "fold") for (let i = 1; i < panels; i++) g += `<line x1="${x + (w / panels) * i}" y1="${y}" x2="${x + (w / panels) * i}" y2="${y + h}" stroke="#00000030" stroke-dasharray="6 5"/>`
  return `${bg()}${g}<text x="${S / 2}" y="${y + h + 50}" text-anchor="middle" font-family="Arial" font-size="22" fill="#4b5563">${p.w} x ${p.h} mm</text>`
}

function frontBack(p) {
  const [w, h] = fit(p.w, p.h, p.kind === "card" ? 330 : 380)
  const gap = 40
  const total = w * 2 + gap
  const x = (S - total) / 2
  const y = (S - h) / 2
  return `${bg()}<g filter="url(#sh)">${face(x, y, w, h, p, "front", "Front")}</g><g filter="url(#sh)">${face(x + w + gap, y, w, h, p, "back", "Back")}</g>`
}

function stack(p) {
  const [w, h] = fit(p.w, p.h, p.kind === "card" ? 380 : 400)
  let g = bg()
  const n = 4
  for (let i = 0; i < n; i++) {
    const rot = (i - 1.5) * 7
    const cx = S / 2 + (i - 1.5) * 26
    const cy = S / 2 + (i - 1.5) * 10
    const x = cx - w / 2, y = cy - h / 2
    g += `<g transform="rotate(${rot} ${cx} ${cy})" filter="url(#sh)">${face(x, y, w, h, p, i === n - 1 ? "front" : "back")}</g>`
  }
  if (p.kind === "booklet" || p.kind === "fold") {
    g += `<line x1="${S / 2 - w / 2}" y1="${S / 2}" x2="${S / 2 + w / 2}" y2="${S / 2}" stroke="#00000000"/>`
  }
  return g
}

for (const [handle, p] of Object.entries(PRODUCTS)) {
  const views = [front(p), frontBack(p), stack(p)]
  for (let i = 0; i < views.length; i++) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${views[i]}</svg>`
    await sharp(Buffer.from(svg)).png().toFile(`${OUT}${handle}-${i + 1}.png`)
  }
}
console.log("done")
