/** Gauge silhouette — viewBox 0 0 72 × 317 */
export const GAUGE_WIDTH = 72
export const GAUGE_HEIGHT = 317
export const GAUGE_CENTER_X = GAUGE_WIDTH / 2

export const TOP_CAP_RADIUS = GAUGE_WIDTH / 2
export const BOTTOM_CAP_RADIUS = 12

export const STRAIGHT_TOP_Y = TOP_CAP_RADIUS
export const STRAIGHT_BOTTOM_Y = GAUGE_HEIGHT - BOTTOM_CAP_RADIUS
export const BOTTOM_LEFT_X = GAUGE_CENTER_X - BOTTOM_CAP_RADIUS
export const BOTTOM_RIGHT_X = GAUGE_CENTER_X + BOTTOM_CAP_RADIUS

/**
 * Large top semicircle → straight tapered sides → small bottom semicircle.
 */
export const TEARDROP_PATH = [
  `M ${GAUGE_CENTER_X} 0`,
  `A ${TOP_CAP_RADIUS} ${TOP_CAP_RADIUS} 0 0 1 ${GAUGE_WIDTH} ${STRAIGHT_TOP_Y}`,
  `L ${BOTTOM_RIGHT_X} ${STRAIGHT_BOTTOM_Y}`,
  `A ${BOTTOM_CAP_RADIUS} ${BOTTOM_CAP_RADIUS} 0 0 1 ${BOTTOM_LEFT_X} ${STRAIGHT_BOTTOM_Y}`,
  `L 0 ${STRAIGHT_TOP_Y}`,
  `A ${TOP_CAP_RADIUS} ${TOP_CAP_RADIUS} 0 0 1 ${GAUGE_CENTER_X} 0`,
  'Z',
].join(' ')

export const GAUGE_GRADIENT = {
  top: '#DB381F',
  bottom: '#D5EDAC',
} as const
