import { Typography, SxProps, Theme } from '@mui/material'
interface Props {
  text: string
  sx?: SxProps<Theme>
}
const Simple = ({ text, sx }: Props) => {
  return (
    <Typography
      variant="h5"
      color={'var(--ps-text-40)'}
      sx={
        sx
          ? sx
          : {
              marginTop: 31,
              marginBottom: 51,
              textAlign: 'center',
              fontWeight: 700
            }
      }
    >
      {text}
    </Typography>
  )
}

export default Simple
