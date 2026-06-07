import { useState } from 'react'
import { CameraView } from './components/CameraView'
import { MasculineFeminineGauge } from './components/MasculineFeminineGauge'
import { useCamera } from './hooks/useCamera'
import { useFaceScanner } from './hooks/useFaceScanner'

type AppStep = 'idle' | 'scanning' | 'result'

function App() {
  const [step, setStep] = useState<AppStep>('idle')
  const {
    videoRef,
    bindVideoRef,
    status: cameraStatus,
    error: cameraError,
    startCamera,
    stopCamera,
  } = useCamera()
  const scanningEnabled = step === 'scanning' && cameraStatus === 'active'
  const { status: scannerStatus, result, error: scannerError, stableProgress, reset } =
    useFaceScanner(videoRef, scanningEnabled)

  const handleStart = () => {
    setStep('scanning')
    void startCamera()
  }

  const handleScanAgain = () => {
    reset()
    stopCamera()
    setStep('idle')
  }

  const handleRescan = () => {
    reset()
    setStep('scanning')
    void startCamera()
  }

  const isScanning =
    step === 'scanning' &&
    scannerStatus === 'scanning' &&
    cameraStatus === 'active'

  const showResult = step === 'scanning' && scannerStatus === 'complete' && result
  const showCamera = step === 'scanning' && cameraStatus === 'active' && !showResult

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">face scan</h1>
        <p className="app__subtitle">
          Allow camera access to scan your face and see where you fall on the
          masculine–feminine spectrum. runs on your device. no photo taken. no
          frame uploaded.
        </p>
      </header>

      <main className="app__main">
        {step === 'idle' && (
          <div className="camera-frame camera-frame--idle">
            <button
              type="button"
              className="btn btn--scan"
              onClick={handleStart}
            >
              Start Scan
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <>
            {cameraStatus === 'requesting' && (
              <p className="status-message">Requesting camera access…</p>
            )}

            {cameraStatus === 'error' && (
              <div className="error-panel">
                <p>{cameraError}</p>
                <button type="button" className="btn btn--scan" onClick={handleScanAgain}>
                  Start Scan
                </button>
              </div>
            )}

            {showCamera && (
              <>
                <div className="camera-frame">
                  <CameraView
                    videoRef={bindVideoRef}
                    stableProgress={isScanning ? stableProgress : 0}
                    isScanning={isScanning}
                  />
                </div>

                {scannerStatus === 'loading_models' && (
                  <p className="scan-status">loading models…</p>
                )}

                {isScanning && (
                  <p className="scan-status">
                    scanning ... please center your face
                  </p>
                )}
              </>
            )}

            {showResult && (
              <>
                <MasculineFeminineGauge feminineScore={result.feminineScore} />
                <button
                  type="button"
                  className="btn btn--scan"
                  onClick={handleScanAgain}
                >
                  Start Scan
                </button>
              </>
            )}

            {scannerStatus === 'error' && (
              <div className="error-panel">
                <p>{scannerError}</p>
                <button type="button" className="btn btn--scan" onClick={handleRescan}>
                  Start Scan
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
