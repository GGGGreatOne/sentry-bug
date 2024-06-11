import React, { useMemo, useState } from 'react'
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Typography, styled } from '@mui/material'
export const BaseButton = styled(Button)(
  ({ theme }) => `
    width: 100%;
    height: 52px;
    border-radius: 100px;
    background:  #FFFFE5;
    &:hover {
     opacity: 0.9;
     background: #FFFFE5;
     color:  #0C0C0C;
    }
    &.Mui-disabled{
      border-radius: 100px;
      background:  rgba(255, 255, 229, 0.20);
      color:  rgba(255, 255, 229, 0.20);
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 150%; 
    }
    color: #0C0C0C;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 24px */
    ${
      theme.breakpoints.up('sm')
        ? `max-width: 550px; margin: 0 auto;
            display: block;`
        : ''
    }
`
)
const FormGroupStyle = styled(FormGroup)`
  &.MuiFormGroup-root {
    ${({ theme }) => theme.breakpoints.up('sm')} {
      /* gap: 16px; */
      margin-top: 16px;
    }
  }
  & .MuiFormControlLabel-root:nth-child(even) {
    align-items: start;
    & .MuiFormControlLabel-label {
      max-width: 376px;
    }
  }
`
const FormControlLabelStyle = styled(FormControlLabel)`
  &.MuiFormControlLabel-root {
    width: 100%;
    align-items: center;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      width: 100%;
      align-items: center;
      gap: 5px;
      margin-top: 16px;
    }
  }

  & .MuiCheckbox-root {
    /* padding: 0px; */
    /* padding-left: 10px; */
    /* padding-top: 3px; */
  }
  &.MuiFormControlLabel-root .MuiTypography-root {
    color: #626262;
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%;
  }
  & .Mui-checked {
    color: #ffffe5 !important;
    border-radius: 6px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 17px;
  }
  &.check .MuiFormControlLabel-label {
    color: #ffffe5 !important;
    font-weight: 500;
  }
`
const CheckIcon = styled(Box)`
  width: 20px;
  height: 20px;
  background: url(/assets/imgs/components/check-icon.svg);
  background-position: 0px -4px;
`
const CheckedIcon = styled(Box)`
  width: 20px;
  height: 19px;
  background: url(/assets/imgs/components/checked-icon.svg);
  background-position: 0px -1px;
`
const Title = styled(Typography)`
  color: #ffffe5;
  font-family: Public Sans;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: -0.32px;
`
const CheckboxStyle = styled(Checkbox)`
  color: #8f9288;
  & .MuiSvgIcon-root {
    border-radius: 6px;
    font-size: 20px;
  }
  &.Mui-checked {
    color: var(--AI-green, #76ba1e);
  }
`
export enum CheckStatus {
  NoCheck,
  Checking,
  Checked
}
const CheckBox = ({ onToBid }: { onToBid: () => void }) => {
  const [confirmationState, setConfirmationState] = useState({
    notice1: false,
    notice2: false,
    notice3: false
  })

  const handleChange = (event: React.ChangeEvent<any>) => {
    setConfirmationState({
      ...confirmationState,
      [event.target.name]: event.target.checked
    })
  }

  const { notice1, notice2, notice3 } = confirmationState
  const icons = { icon: <CheckIcon />, checkedIcon: <CheckedIcon /> }
  const isFinishSelected = useMemo(() => Object.values(confirmationState).every(Boolean), [confirmationState])
  return (
    <Box sx={{ margin: '0 auto', mt: 40, width: '100%', maxWidth: 753, mb: 32 }}>
      <Box sx={{ maxWidth: 574 }}>
        <Title sx={{ fontWeight: 600 }}>Please check the following information before your participation</Title>

        <FormGroupStyle>
          <FormControlLabelStyle
            checked={notice1}
            name="notice1"
            control={<CheckboxStyle defaultChecked {...icons} />}
            onChange={handleChange}
            label="I researched the creator"
            className={notice1 ? 'check' : ''}
          />
          <FormControlLabelStyle
            checked={notice2}
            control={<CheckboxStyle {...icons} />}
            onChange={handleChange}
            name="notice2"
            label="I checked the token and contract address to make sure it is not fake token"
            className={notice2 ? 'check' : ''}
          />
          <FormControlLabelStyle
            checked={notice3}
            control={<CheckboxStyle {...icons} />}
            onChange={handleChange}
            name="notice3"
            label="I checked the price"
            className={notice3 ? 'check' : ''}
          />
        </FormGroupStyle>
        <BaseButton
          sx={{ marginTop: 32 }}
          onClick={isFinishSelected ? onToBid : undefined}
          disabled={!isFinishSelected}
        >
          Confirm and continue
        </BaseButton>
      </Box>
    </Box>
  )
}

export default CheckBox
