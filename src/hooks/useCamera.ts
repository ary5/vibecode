import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraStatus = 'idle' | 'requesting' | 'active' | 'error'

const VIDEO_CONSTRAINTS: MediaStreamConstraints[] = [
  { video: { facingMode: 'user' }, audio: false },
  { video: true, audio: false },
]

async function requestCameraStream(): Promise<MediaStream> {
  let lastError: unknown

  for (const constraints of VIDEO_CONSTRAINTS) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints)
    } catch (err) {
      lastError = err
    }
  }

  throw lastError
}

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const attachStreamToVideo = useCallback(async (video: HTMLVideoElement) => {
    const stream = streamRef.current
    if (!stream) return

    if (video.srcObject !== stream) {
      video.srcObject = stream
    }

    if (video.paused) {
      await video.play()
    }
  }, [])

  const bindVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node
      if (node && streamRef.current) {
        void attachStreamToVideo(node)
      }
    },
    [attachStreamToVideo],
  )

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setStatus('idle')
  }, [])

  const startCamera = useCallback(async () => {
    if (!window.isSecureContext) {
      setError(
        'Camera requires a secure connection (HTTPS). Please open this site over https://.',
      )
      setStatus('error')
      return
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera is not available in this browser.')
      setStatus('error')
      return
    }

    setStatus('requesting')
    setError(null)

    try {
      const stream = await requestCameraStream()
      streamRef.current = stream

      if (videoRef.current) {
        await attachStreamToVideo(videoRef.current)
      }

      setStatus('active')
    } catch (err) {
      setError(getCameraErrorMessage(err))
      setStatus('error')
    }
  }, [attachStreamToVideo])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  return {
    videoRef,
    bindVideoRef,
    status,
    error,
    startCamera,
    stopCamera,
  }
}

function getCameraErrorMessage(err: unknown): string {
  if (err instanceof DOMException) {
    switch (err.name) {
      case 'NotAllowedError':
        return 'Camera access was denied. Please allow camera permission and try again.'
      case 'NotFoundError':
        return 'No camera was found on this device.'
      case 'NotReadableError':
        return 'Camera is already in use by another application.'
      case 'OverconstrainedError':
        return 'Could not start the camera with the requested settings. Please try again.'
      default:
        return err.message || 'Failed to access the camera.'
    }
  }
  if (err instanceof Error) {
    return err.message || 'Failed to access the camera.'
  }
  return 'Failed to access the camera.'
}
