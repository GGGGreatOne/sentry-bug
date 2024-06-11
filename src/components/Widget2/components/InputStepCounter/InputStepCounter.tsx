import { FeeAmount } from '@uniswap/v3-sdk'
import Card from 'components/Card'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { Input as NumericalInput } from '../NumericalInput'
import { ButtonGray } from '../Button'
import { AutoColumn } from '../Column'
import { ThemedText } from 'components/Widget2/theme/components'
// import { Stack } from '@mui/material'
// import PlusIcon from '../../assets/images/plus.svg'
// import MinusIcon from '../../assets/images/minus.svg'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color};
  }

  70% {
    box-shadow: 0 0 0 2px ${color};
  }

  100% {
    box-shadow: 0 0 0 0 ${color};
  }
`

const InputRow = styled.div`
  display: flex;
`

const SmallButton = styled(ButtonGray)`
  border-radius: 8px;
  padding: 4px;
`

const FocusedOutlineCard = styled(Card)<{ active?: boolean; pulsing?: boolean }>`
  background-color: var(--ps-text-primary);
  border-color: ${({ active }) => active && '#fff'};
  padding: 12px;
  animation: ${({ pulsing }) => pulsing && pulse('#fff')} 0.8s linear;
`

const StyledInput = styled(NumericalInput)<{ usePercent?: boolean }>`
  padding: 4px;
  color: var(--ps-text-100);
  background-color: transparent;
  font-weight: 535;
  text-align: left;
  width: 100%;
  font-size: 28px;
`

const InputColumn = styled(AutoColumn)`
  width: 100%;
`

const InputTitle = styled(ThemedText.DeprecatedSmall)`
  color: var(--px-text-100);
  font-size: 12px;
  font-weight: 535;
`

interface StepCounterProps {
  value: string
  onUserInput: (value: string) => void
  decrement: () => string
  increment: () => string
  decrementDisabled?: boolean
  incrementDisabled?: boolean
  feeAmount?: FeeAmount
  label?: string
  width?: string
  locked?: boolean // disable input
  title: ReactNode
  tokenA?: string
  tokenB?: string
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  width,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB
}: StepCounterProps) => {
  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false)

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('')
  const [useLocalValue, setUseLocalValue] = useState(false)

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false)

  const handleOnFocus = () => {
    setUseLocalValue(true)
    setActive(true)
  }

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false)
    setActive(false)
    onUserInput(localValue) // trigger update on parent value
  }, [localValue, onUserInput])

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(decrement())
  }, [decrement, onUserInput])

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false)
    onUserInput(increment())
  }, [increment, onUserInput])

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value) // reset local value to match parent
        setPulsing(true) // trigger animation
        setTimeout(function () {
          setPulsing(false)
        }, 1800)
      }, 0)
    }
  }, [localValue, useLocalValue, value])

  return (
    <FocusedOutlineCard pulsing={pulsing} active={active} onFocus={handleOnFocus} onBlur={handleOnBlur} width={width}>
      <InputRow>
        <InputColumn justify="flex-start" style={{ width: '100%' }}>
          <InputTitle fontSize={12} textAlign="center">
            {title}
          </InputTitle>
          <StyledInput
            className="rate-input-0"
            value={localValue}
            fontSize="20px"
            disabled={locked}
            onUserInput={val => {
              setLocalValue(val)
            }}
          />
          <InputTitle fontSize={12} textAlign="left">
            {tokenB} per {tokenA}
          </InputTitle>
        </InputColumn>
        <AutoColumn>
          {!locked && (
            <SmallButton
              style={{ backgroundColor: 'transparent', border: 'none' }}
              data-testid="increment-price-range"
              onClick={handleIncrement}
              disabled={incrementDisabled}
            >
              <AddCircleIcon sx={{ fontSize: 30, color: 'var(--ps-neutral)' }} />
            </SmallButton>
          )}
          {!locked && (
            <SmallButton
              style={{ backgroundColor: 'transparent', border: 'none' }}
              data-testid="decrement-price-range"
              onClick={handleDecrement}
              disabled={decrementDisabled}
            >
              <RemoveCircleIcon sx={{ fontSize: 30, color: 'var(--ps-neutral)' }} />
            </SmallButton>
          )}
        </AutoColumn>
      </InputRow>
    </FocusedOutlineCard>
  )
}

export default StepCounter
