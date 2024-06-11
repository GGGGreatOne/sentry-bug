import { AutoColumn } from 'components/Widget2/components/Column'
import { Input } from 'components/Widget2/components/NumericalInput'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  padding: 26px 16px;
`

export const ScrollablePage = styled.div`
  padding: 20px 8px 0px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;

  @media only screen and (max-width: 678px) {
    padding: 48px 0px 0px;
  }

  @media only screen and (max-width: 640px) {
    padding-top: 20px;
  }
`

export const DynamicSection = styled(AutoColumn)<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.2' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'initial')};
`

export const StyledInput = styled(Input)`
  background-color: ${({ theme }) => theme.surface1};
  text-align: left;
  font-size: 18px;
  width: 100%;
`

/* two-column layout where DepositAmount is moved at the very end on mobile. */
export const ResponsiveTwoColumns = styled.div<{ wide: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;

  border-top: 1px solid ${({ theme }) => theme.surface3};

  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    margin-top: 0;
  `};
`

export const MediumOnly = styled.div`
  ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToMedium`
    display: none;
  `};
`
