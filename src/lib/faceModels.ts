import Human, { type Config, type Gender } from '@vladmandic/human'

const MODEL_BASE_PATH =
  'https://cdn.jsdelivr.net/npm/@vladmandic/human/models/'

const humanConfig: Partial<Config> = {
  backend: 'webgl',
  modelBasePath: MODEL_BASE_PATH,
  debug: false,
  face: {
    enabled: true,
    detector: {
      enabled: true,
      rotation: false,
      maxDetected: 1,
      minConfidence: 0.5,
    },
    mesh: { enabled: false },
    attention: { enabled: false },
    iris: { enabled: false },
    description: { enabled: true },
    emotion: { enabled: false },
    antispoof: { enabled: false },
    liveness: { enabled: false },
    gear: { enabled: false },
  },
  body: { enabled: false },
  hand: { enabled: false },
  object: { enabled: false },
  gesture: { enabled: false },
  segmentation: { enabled: false },
}

let human: Human | null = null
let loadPromise: Promise<void> | null = null
let modelsLoaded = false

function getHuman(): Human {
  if (!human) {
    human = new Human(humanConfig)
  }
  return human
}

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return
  if (loadPromise) return loadPromise

  loadPromise = getHuman()
    .load()
    .then(() => {
      modelsLoaded = true
    })
    .catch((err: unknown) => {
      loadPromise = null
      throw err
    })

  return loadPromise
}

export function areModelsLoaded(): boolean {
  return modelsLoaded
}

export type FaceScanResult = {
  feminineScore: number
  gender: Gender
  genderProbability: number
}

export function toFeminineScore(gender: Gender, genderScore: number): number {
  if (gender === 'female') return Math.round(genderScore * 100)
  if (gender === 'male') return Math.round((1 - genderScore) * 100)
  return 50
}

export async function detectFaceWithGender(
  input: HTMLVideoElement,
): Promise<FaceScanResult | null> {
  const result = await getHuman().detect(input)
  const face = result.face[0]

  if (
    !face ||
    !face.gender ||
    face.gender === 'unknown' ||
    face.genderScore === undefined
  ) {
    return null
  }

  const genderProbability =
    face.gender === 'female' ? face.genderScore : 1 - face.genderScore

  return {
    feminineScore: toFeminineScore(face.gender, face.genderScore),
    gender: face.gender,
    genderProbability,
  }
}
