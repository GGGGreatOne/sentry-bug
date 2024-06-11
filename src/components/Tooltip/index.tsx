import { styled, Tooltip as MuiTooltip, tooltipClasses, TooltipProps } from '@mui/material'

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} arrow classes={{ popper: className }} />
))(({}) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: 'var(--ps-neutral2)'
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--ps-neutral2)',
    borderRadius: '8px'
  }
}))

export default Tooltip
