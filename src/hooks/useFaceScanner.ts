import { useCallback, useEffect, useRef, useState } from 'react'
import {
  detectFaceWithGender,
  loadFaceModels,
  type FaceScanResult,
} from '../lib/faceModels'

export type ScannerStatus =
  | 'loading_models'
  | 'scanning'
  | 'complete'
  | 'error'

const STABLE_FRAMES_REQUIRED = 30

export function useFaceScanner(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean,
) {
  const [status, setStatus] = useState<ScannerStatus>('loading_models')
  const [result, setResult] = useState<FaceScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [stableProgress, setStableProgress] = useState(0)
  const stableCountRef = useRef(0)
  const rafRef = useRef<number>(0)
  const scanningRef = useRef(false)

  const reset = useCallback(() => {
    stableCountRef.current = 0
    setStableProgress(0)
    setResult(null)
    setError(null)
    scanningRef.current = false
    if (enabled) {
      setStatus('scanning')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    stableCountRef.current = 0
    setStableProgress(0)
    setResult(null)
    setError(null)
    scanningRef.current = false
    setStatus('loading_models')

    async function init() {
      try {
        await loadFaceModels()
        if (!cancelled) {
          setStatus('scanning')
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load face detection models.')
          setStatus('error')
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || status !== 'scanning') return

    const video = videoRef.current
    if (!video) return

    scanningRef.current = true
    stableCountRef.current = 0
    setStableProgress(0)

    const scan = async () => {
      if (!scanningRef.current || !videoRef.current) return

      if (videoRef.current.readyState < 2) {
        rafRef.current = requestAnimationFrame(scan)
        return
      }

      try {
        const detection = await detectFaceWithGender(videoRef.current)

        if (!scanningRef.current) return

        if (detection) {
          stableCountRef.current += 1
          setStableProgress(
            Math.min(
              100,
              Math.round(
                (stableCountRef.current / STABLE_FRAMES_REQUIRED) * 100,
              ),
            ),
          )

          if (stableCountRef.current >= STABLE_FRAMES_REQUIRED) {
            scanningRef.current = false
            setResult(detection)
            setStatus('complete')
            return
          }
        } else {
          stableCountRef.current = 0
          setStableProgress(0)
        }
      } catch {
        if (scanningRef.current) {
          setError('Face detection failed.')
          setStatus('error')
          scanningRef.current = false
          return
        }
      }

      rafRef.current = requestAnimationFrame(scan)
    }

    rafRef.current = requestAnimationFrame(scan)

    return () => {
      scanningRef.current = false
      cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, status, videoRef])

  return {
    status,
    result,
    error,
    stableProgress,
    reset,
  }
}
