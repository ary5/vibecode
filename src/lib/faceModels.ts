import * as faceapi from '@vladmandic/face-api'
import { Gender } from '@vladmandic/face-api'

const MODEL_URL = '/models'

let modelsLoaded = false

export async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return

  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
  ])

  modelsLoaded = true
}

export function areModelsLoaded(): boolean {
  return modelsLoaded
}

const detectorOptions = new faceapi.TinyFaceDetectorOptions({
  inputSize: 224,
  scoreThreshold: 0.5,
})

export type FaceScanResult = {
  feminineScore: number
  gender: Gender
  genderProbability: number
}

export function toFeminineScore(
  gender: Gender,
  genderProbability: number,
): number {
  const femaleProb =
    gender === Gender.FEMALE ? genderProbability : 1 - genderProbability
  return Math.round(femaleProb * 100)
}

export async function detectFaceWithGender(
  input: HTMLVideoElement,
): Promise<FaceScanResult | null> {
  const detection = await faceapi
    .detectSingleFace(input, detectorOptions)
    .withFaceLandmarks(true)
    .withAgeAndGender()

  if (!detection) return null

  return {
    feminineScore: toFeminineScore(
      detection.gender,
      detection.genderProbability,
    ),
    gender: detection.gender,
    genderProbability: detection.genderProbability,
  }
}

export { faceapi }
