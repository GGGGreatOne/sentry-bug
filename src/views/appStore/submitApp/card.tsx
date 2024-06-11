import { Box, Typography, Stack } from '@mui/material'

import useBreakpoint from 'hooks/useBreakpoint'

const SubmitCard = ({
  isDisabled,
  subTitle,
  title,
  content
}: {
  isDisabled: boolean
  subTitle: string
  title: string
  content: string
}) => {
  const isMd = useBreakpoint('md')
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '588px',
        borderRadius: '32px',
        padding: { xs: '32px 20px', md: '32px 40px' },
        height: { xs: '176px', md: '218px' },
        backgroundColor: 'var(--ps-neutral)',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 30, md: 40 },
        opacity: isDisabled ? 0.3 : 1,
        textAlign: 'center',
        cursor: isDisabled ? 'no-drop' : 'pointer'
      }}
    >
      <Stack spacing={12}>
        <Typography variant={isMd ? 'h5' : 'h4'} color={'var(--ps-text-80)'}>
          {subTitle || '--'}
        </Typography>
        <Typography
          fontSize={{ xs: 24, md: 40 }}
          fontWeight={600}
          lineHeight={{ xs: '17px', md: '28px' }}
          color={'var(--ps-text-100)'}
        >
          {title || '--'}
        </Typography>
      </Stack>
      <Typography fontSize={{ xs: 15, md: 16 }} lineHeight={1.4} color={'var(--ps-text-60)'}>
        {content || '--'}
      </Typography>
    </Box>
  )
}

const TestList = [
  {
    subTitle: 'Submit a',
    title: 'Free App',
    content: 'Accessible to All Clubs - Any club can install this App without financial constraints.'
  },
  {
    subTitle: 'Submit a',
    title: 'Permission-Based App',
    content: 'Exclusive Club Installation - Only specific clubs have the privilege to install this plugin.'
  },
  {
    subTitle: 'Submit a',
    title: 'Paid App',
    content: 'Token-Paid Installation - Clubs must pay a certain amount of tokens to install this App.'
  },
  {
    subTitle: 'Submit a',
    title: 'Rewarding App',
    content: 'Earn Rewards on Use - Clubs will receive rewards when users engage with the App after installation.'
  }
]

export default function Index() {
  const isMd = useBreakpoint('md')
  if (isMd) {
    return (
      <Box
        sx={{
          display: 'grid',
          gap: '24px',
          margin: '0 auto'
        }}
      >
        {TestList.map((v, index) => (
          <SubmitCard
            isDisabled
            key={v.title + index.toString()}
            subTitle={v.subTitle}
            title={v.title}
            content={v.content}
          />
        ))}
      </Box>
    )
  }
  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginTop: '30px'
      }}
    >
      {TestList.map((v, index) => (
        <SubmitCard
          isDisabled
          key={v.title + index.toString()}
          subTitle={v.subTitle}
          title={v.title}
          content={v.content}
        />
      ))}
    </Box>
  )
}
