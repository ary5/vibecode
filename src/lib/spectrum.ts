const GRADIENT_STOPS: { stop: number; color: [number, number, number] }[] = [
  { stop: 0, color: [213, 237, 172] }, // #d5edac — bottom (0 feminine)
  { stop: 0.35, color: [232, 197, 71] },
  { stop: 0.65, color: [232, 101, 48] },
  { stop: 1, color: [219, 56, 31] }, // #db381f — top (100 masculine)
]

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

/** masculineScore 0–100; 0 = bottom of scale, 100 = top */
export function getSpectrumColor(masculineScore: number): string {
  const t = Math.max(0, Math.min(1, masculineScore / 100))

  for (let i = 0; i < GRADIENT_STOPS.length - 1; i++) {
    const a = GRADIENT_STOPS[i]
    const b = GRADIENT_STOPS[i + 1]
    if (t >= a.stop && t <= b.stop) {
      const local = (t - a.stop) / (b.stop - a.stop)
      return rgbToHex([
        lerp(a.color[0], b.color[0], local),
        lerp(a.color[1], b.color[1], local),
        lerp(a.color[2], b.color[2], local),
      ])
    }
  }

  return rgbToHex(GRADIENT_STOPS[GRADIENT_STOPS.length - 1].color)
}

export function toMasculineScore(feminineScore: number): number {
  return Math.max(0, Math.min(100, 100 - feminineScore))
}

export function getSpectrumLabel(masculineScore: number): string {
  if (masculineScore >= 85) return 'Chad'
  if (masculineScore >= 70) return 'Alpha'
  if (masculineScore >= 55) return 'Based'
  if (masculineScore >= 40) return 'Neutral'
  if (masculineScore >= 25) return 'Soft'
  return 'Angel'
}

export function getSpectrumExplanation(masculineScore: number): string {
  const label = getSpectrumLabel(masculineScore)
  return `Your facial features scored ${masculineScore} on the masculine scale (0 feminine at the bottom, 100 masculine at the top). That places you in the "${label}" range — a rough, on-device estimate from gender classification, not a scientific measure.`
}
