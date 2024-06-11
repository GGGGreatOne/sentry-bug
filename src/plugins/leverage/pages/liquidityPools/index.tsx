import { Box, Stack, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { LiquidityPoolCard } from './LiquidityPoolCard'
import { QuantosDetails } from '../../hook/useFactory'
import { control } from '../components/dialog/modal'
import useBreakpoint from '../../../../hooks/useBreakpoint'
const Page = ({
  boxQuantos,
  boxContractAdr,
  editing,
  allQuantos
}: {
  boxQuantos: QuantosDetails[] | undefined
  boxContractAdr: string
  editing: boolean
  allQuantos: QuantosDetails[] | undefined
}) => {
  const isSm = useBreakpoint('sm')
  const isMd = useBreakpoint('md')

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: 12,
        background: 'var(--ps-neutral2)',
        padding: isSm ? '16px 20px' : '32px 40px'
      }}
    >
      <Stack sx={{ flexDirection: isSm ? 'column' : 'row', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            color: 'var(--ps-text-100)',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.4,
            mb: isSm ? '16px' : ''
          }}
        >
          Liquidity Pools
        </Typography>
        <Stack flexDirection={'row'}>
          {editing ? (
            <>
              {/*<Button variant="outlined" sx={{ height: 44, marginRight: 16 }}>*/}
              {/*  Delete App Page*/}
              {/*</Button>*/}
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: 'var(--ps-text-100)',
                  height: 44,
                  marginRight: 16,
                  color: 'var(--ps-text-primary)'
                }}
                onClick={() => {
                  control.show('SelectToken', {
                    isAddLiquidity: true,
                    allQuantos: allQuantos,
                    boxAddress: boxContractAdr,
                    boxQuantos: boxQuantos
                  })
                  // creatPool().then()
                }}
              >
                Add Liquidity
              </Button>
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: 'var(--ps-text-100)',
                  height: 44,
                  color: 'var(--ps-text-primary)'
                }}
                startIcon={<AddIcon />}
                onClick={() => {
                  control.show('CreateLiquidityDialog', { boxAddress: boxContractAdr, allQuantos: allQuantos })
                  // creatPool().then()
                }}
              >
                Create
              </Button>
            </>
          ) : (
            <></>
          )}
        </Stack>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: isSm ? '1fr' : isMd ? '1fr 1fr' : '1fr 1fr 1fr',
          mt: '40px',
          gap: '24px'
        }}
      >
        {!boxQuantos && <div>loading</div>}
        {boxQuantos &&
          boxQuantos?.length > 0 &&
          boxQuantos.map(quanto => {
            return <LiquidityPoolCard key={quanto.tradingT} quanto={quanto} boxContactAddr={boxContractAdr} />
          })}
      </Box>
    </Box>
  )
}
export default Page
