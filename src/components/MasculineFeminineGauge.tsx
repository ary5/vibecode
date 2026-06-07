import {
  getSpectrumColor,
  getSpectrumExplanation,
  getSpectrumLabel,
  toMasculineScore,
} from '../lib/spectrum'
import {
  GAUGE_CENTER_X,
  GAUGE_GRADIENT,
  GAUGE_HEIGHT,
  GAUGE_WIDTH,
  TEARDROP_PATH,
} from '../lib/teardropGauge'

type MasculineFeminineGaugeProps = {
  feminineScore: number
}

export function MasculineFeminineGauge({
  feminineScore,
}: MasculineFeminineGaugeProps) {
  const masculineScore = toMasculineScore(feminineScore)
  const label = getSpectrumLabel(masculineScore)
  const labelColor = getSpectrumColor(masculineScore)
  const markerY = GAUGE_HEIGHT - (masculineScore / 100) * GAUGE_HEIGHT
  const markerTop = 12 + markerY

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
            style={{ top: `${markerTop}px` }}
          >
            <span
              className="spectrum__label"
              style={{ color: labelColor }}
            >
              {label}
            </span>
            <svg
              className="spectrum__arrow"
              viewBox="0 0 52 15"
              width="51"
              height="15"
              aria-hidden
            >
              <path
                d="M51.7071 8.07107C52.0976 7.68054 52.0976 7.04738 51.7071 6.65685L45.3431 0.292893C44.9526 -0.097631 44.3195 -0.097631 43.9289 0.292893C43.5384 0.683418 43.5384 1.31658 43.9289 1.70711L49.5858 7.36396L43.9289 13.0208C43.5384 13.4113 43.5384 14.0445 43.9289 14.435C44.3195 14.8256 44.9526 14.8256 45.3431 14.435L51.7071 8.07107ZM0 7.36396V8.36396H51V7.36396V6.36396H0V7.36396Z"
                fill="white"
              />
            </svg>
          </div>

          <div className="spectrum__scale-wrap">
            <svg
              className="spectrum__scale"
              viewBox={`0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT}`}
              width={GAUGE_WIDTH}
              height={GAUGE_HEIGHT}
              role="img"
              aria-label={`Masculine score ${masculineScore} out of 100`}
            >
              <defs>
                <linearGradient
                  id="spectrum-gradient"
                  x1={GAUGE_CENTER_X}
                  y1="0"
                  x2={GAUGE_CENTER_X}
                  y2={GAUGE_HEIGHT}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor={GAUGE_GRADIENT.top} />
                  <stop offset="1" stopColor={GAUGE_GRADIENT.bottom} />
                </linearGradient>
              </defs>

              <path d={TEARDROP_PATH} fill="url(#spectrum-gradient)" />
            </svg>

            <div
              className="spectrum__marker"
              style={{ top: `${(markerY / GAUGE_HEIGHT) * 100}%` }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  )
}
