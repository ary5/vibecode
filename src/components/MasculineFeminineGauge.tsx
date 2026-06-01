type MasculineFeminineGaugeProps = {
  score: number
}

export function MasculineFeminineGauge({ score }: MasculineFeminineGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score))

  return (
    <div className="gauge">
      <div className="gauge__labels">
        <span>Masculine</span>
        <span className="gauge__score">{clampedScore} / 100</span>
        <span>Feminine</span>
      </div>
      <div className="gauge__track">
        <div
          className="gauge__fill"
          style={{ width: `${clampedScore}%` }}
        />
        <div
          className="gauge__marker"
          style={{ left: `${clampedScore}%` }}
        />
      </div>
    </div>
  )
}
