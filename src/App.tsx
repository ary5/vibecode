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
  const showCamera = step === 'scanning' && cameraStatus === 'active'

  return (
    <div className="app">
      <header className="app__header">
        <h1>Face Scan</h1>
        <p className="app__subtitle">
          Allow camera access to scan your face and see where you fall on the
          masculine–feminine spectrum.
        </p>
      </header>

      <main className="app__main">
        {step === 'idle' && (
          <div className="app__idle">
            <button type="button" className="btn btn--primary" onClick={handleStart}>
              Start scan
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="app__scan">
            {cameraStatus === 'requesting' && (
              <p className="status-message">Requesting camera access…</p>
            )}

            {cameraStatus === 'error' && (
              <div className="error-panel">
                <p>{cameraError}</p>
                <button type="button" className="btn" onClick={handleScanAgain}>
                  Try again
                </button>
              </div>
            )}

            {showCamera && (
              <>
                <CameraView
                  videoRef={bindVideoRef}
                  stableProgress={isScanning ? stableProgress : 0}
                  isScanning={isScanning && !showResult}
                />

                {scannerStatus === 'loading_models' && (
                  <p className="status-message">Loading models…</p>
                )}

                {isScanning && (
                  <p className="status-message">Position your face in the frame</p>
                )}

                {showResult && (
                  <div className="app__result">
                    <h2>Your result</h2>
                    <MasculineFeminineGauge score={result.feminineScore} />
                    <p className="disclaimer">
                      For entertainment only — results are approximate.
                    </p>
                    <button type="button" className="btn btn--primary" onClick={handleScanAgain}>
                      Scan again
                    </button>
                  </div>
                )}
              </>
            )}

            {scannerStatus === 'error' && (
              <div className="error-panel">
                <p>{scannerError}</p>
                <button type="button" className="btn" onClick={handleRescan}>
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
