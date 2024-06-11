import dynamic from 'next/dynamic'
const Joyride = dynamic(() => import('react-joyride'), { ssr: false })
import TooltipComponent from 'components/QuickTour/TooltipComponent'
import { useState } from 'react'
import useBreakpoint from 'hooks/useBreakpoint'
import { CallBackProps, Step } from 'react-joyride'

export default function Page({
  steps,
  run,
  setRun,
  callback,
  showStart,
  setFirstWeb,
  handleSkip
}: {
  steps: Array<Step>
  run: boolean
  setRun: (e: boolean) => void
  callback?: (data: CallBackProps) => void
  showStart?: boolean
  setFirstWeb?: () => void
  handleSkip?: (e: boolean) => void
}) {
  const isMd = useBreakpoint('md')
  const [stepIndex, setStepIndex] = useState(0)
  const handleJoyrideCallback = (data: CallBackProps) => {
    if (callback) callback(data)
    else {
      const { action, status } = data
      if (action === 'skip') {
        setRun(false)
        setStepIndex(0)
      }
      if (status === 'finished') {
        setRun(false)
        setStepIndex(0)
      }
    }
  }
  return (
    <Joyride
      callback={handleJoyrideCallback}
      tooltipComponent={props => (
        <TooltipComponent
          {...props}
          isMd={isMd}
          totalSteps={steps.length}
          setStepIndex={setStepIndex}
          showStart={showStart}
          setFirstWeb={setFirstWeb}
          handleSkip={handleSkip}
        />
      )}
      disableScrolling={isMd ? false : true}
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      scrollOffset={isMd ? 200 : 400}
      continuous
      disableOverlayClose
      floaterProps={{
        styles: {
          floater: {
            zIndex: 1500
          }
        }
      }}
      styles={{
        options: {
          overlayColor: 'rgba(0, 0, 0, 0)'
        },
        spotlight: {
          backgroundColor: 'transparent'
        },
        overlay: {
          zIndex: 1300
        }
      }}
    />
  )
}
