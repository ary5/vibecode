import {
  getSpectrumColor,
  getSpectrumExplanation,
  getSpectrumLabel,
  toMasculineScore,
} from '../lib/spectrum'

type MasculineFeminineGaugeProps = {
  feminineScore: number
}

const SCALE_HEIGHT = 317
const SCALE_WIDTH = 73

export function MasculineFeminineGauge({
  feminineScore,
}: MasculineFeminineGaugeProps) {
  const masculineScore = toMasculineScore(feminineScore)
  const label = getSpectrumLabel(masculineScore)
  const labelColor = getSpectrumColor(masculineScore)
  const markerY = SCALE_HEIGHT - (masculineScore / 100) * SCALE_HEIGHT

  return (
    <div className="result-panel">
      <p className="result-panel__heading">Your result:</p>

      <div className="result-panel__body">
        <p className="result-panel__explanation">
          {getSpectrumExplanation(masculineScore)}
        </p>

        <div className="spectrum">
          <div
            className="spectrum__label-row"
            style={{ top: `${(markerY / SCALE_HEIGHT) * 100}%` }}
          >
            <span
              className="spectrum__label"
              style={{ color: labelColor }}
            >
              {label}
            </span>
            <svg
              className="spectrum__arrow"
              viewBox="0 0 51 15"
              width="51"
              height="15"
              aria-hidden
            >
              <line
                x1="0"
                y1="7.5"
                x2="45"
                y2="7.5"
                stroke="white"
                strokeWidth="2"
              />
              <polygon points="45,2 51,7.5 45,13" fill="white" />
            </svg>
          </div>

          <div className="spectrum__scale-wrap">
            <svg
              className="spectrum__scale"
              viewBox={`0 0 ${SCALE_WIDTH} ${SCALE_HEIGHT}`}
              width={SCALE_WIDTH}
              height={SCALE_HEIGHT}
              role="img"
              aria-label={`Masculine score ${masculineScore} out of 100`}
            >
              <defs>
                <linearGradient
                  id="spectrum-gradient"
                  x1="0"
                  y1="1"
                  x2="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#d5edac" />
                  <stop offset="35%" stopColor="#e8c547" />
                  <stop offset="65%" stopColor="#e86530" />
                  <stop offset="100%" stopColor="#db381f" />
                </linearGradient>
              </defs>

              <path
                d="M36.5 0 C56 0 72.5 16 72.5 36 L72.5 280 C72.5 302 56 317 36.5 317 C17 317 0.5 302 0.5 280 L0.5 36 C0.5 16 17 0 36.5 0 Z"
                fill="url(#spectrum-gradient)"
              />

              <circle
                cx={36.5}
                cy={markerY}
                r="10"
                fill="white"
                stroke="#241c33"
                strokeWidth="2"
              />
            </svg>

            <span className="spectrum__endpoint spectrum__endpoint--top">
              100 masculine
            </span>
            <span className="spectrum__endpoint spectrum__endpoint--bottom">
              0 feminine
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
