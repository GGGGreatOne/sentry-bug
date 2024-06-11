import { Button, Stack, Typography } from '@mui/material'

interface ModuleList {
  value: string
  component: JSX.Element | React.ReactNode
}

const SectionModule = ({
  isMd,
  styleType,
  data,
  onCancel,
  onChoose,
  onSave
}: {
  isMd: boolean
  styleType: string
  data: ModuleList[]
  onCancel?: () => void
  onChoose: (e: string) => void
  onSave: (e: number) => void
}) => {
  return (
    <Stack flexDirection={'column'}>
      <Stack>
        <Stack gap={16} flexDirection={'row'} alignItems={'center'} width={'100%'} flexWrap={'wrap'}>
          {data.map((item, index) => {
            return (
              <Stack
                key={index}
                gap={isMd ? 16 : 32}
                flexDirection={'column'}
                alignItems={'center'}
                sx={{
                  width: isMd ? '100%' : '48%',
                  padding: '32px 40px',
                  background: 'var(--ps-neutral2)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: item.value === styleType ? '2px solid var(--ps-text-100)' : '2px solid transparent',
                  ':hover': {
                    background: 'var(--ps-text-10)'
                  }
                }}
                onClick={() => {
                  onChoose(item.value)
                }}
              >
                {item.component}
                <Typography
                  variant="h3"
                  sx={{
                    fontSize: isMd ? 15 : 20,
                    lineHeight: isMd ? '19.5px' : '26px',
                    fontWeight: 500
                  }}
                >
                  module {index + 1}
                </Typography>
              </Stack>
            )
          })}
        </Stack>
      </Stack>
      <Stack
        gap={16}
        flexDirection={'row'}
        justifyContent={isMd ? 'center' : 'flex-end'}
        sx={{
          '& button': {
            marginTop: isMd ? 16 : 33,
            width: 133,
            height: isMd ? 36 : 44,
            fontSize: isMd ? 13 : 15,
            fontWeight: 500
          }
        }}
      >
        {onCancel && (
          <Button variant="outlined" onClick={onCancel}>
            Back
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => {
            onSave(2)
          }}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  )
}

export default SectionModule
