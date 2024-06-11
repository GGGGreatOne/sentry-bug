import { Button, styled } from '@mui/material'
import { LoadingButton } from '@mui/lab'

export interface IProps {
  nextHandle?: (p: any) => void
  submitHandle?: (p: any) => void
}
export const NextBtnStyle = styled(LoadingButton)`
  width: 140px;
  height: 44px;
  padding: 12px 24px;
  border-radius: 100px;
  background: #ffffe5;
  color: #0c0c0c;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  &:hover {
    opacity: 0.99;
    background: #ffffe5;
  }
`
export const CancelBtnStyle = styled(Button)`
  &,
  &:hover {
    width: 140px;
    height: 44px;
    padding: 12px 24px;
    border-radius: 0px;
    border: 1px solid rgba(255, 255, 229, 0.2);
    color: var(--ps-grey-03, #959595);
    background-color: rgba(0, 0, 0, 0);
    border-radius: 100px;
  }
  &:hover {
    opacity: 0.8;
    background-color: rgba(0, 0, 0, 0);
  }
`
