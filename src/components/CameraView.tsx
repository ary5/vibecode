import type { Ref } from 'react'

type CameraViewProps = {
  videoRef: Ref<HTMLVideoElement> | ((node: HTMLVideoElement | null) => void)
  stableProgress: number
  isScanning: boolean
}

export function CameraView({
  videoRef,
  stableProgress,
  isScanning,
}: CameraViewProps) {
  return (
    <div className="camera-view">
      <video
        ref={videoRef}
        className="camera-view__video"
        playsInline
        muted
        autoPlay
      />
      {isScanning && (
        <div className="camera-view__overlay">
          <div className="camera-view__frame" />
          {stableProgress > 0 && stableProgress < 100 && (
            <div className="camera-view__progress">
              <div
                className="camera-view__progress-bar"
                style={{ width: `${stableProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
