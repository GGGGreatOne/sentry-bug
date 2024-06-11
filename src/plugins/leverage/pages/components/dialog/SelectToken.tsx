import BaseDialog from '../../../../../components/Dialog/baseDialog'
import { Box, InputBase, styled, Typography } from '@mui/material'
import { QuantosDetails } from '../../../hook/useFactory'
import { control } from './modal'
import { useLeverageStateData } from 'plugins/leverage/state/hooks'
import SeachSvg from '../../../../../assets/svg/search.svg'
import NoResultSvg from '../../../../../assets/svg/no_result_icon.svg'
import { useEditBoxPluginBitleverageData } from '../../../../../state/boxes/hooks'
import { ChangeEvent, useMemo, useState } from 'react'
import CurrencyLogo from '../../../../../components/essential/CurrencyLogo'

const StyledSearch = styled(SeachSvg)<{ color?: string }>(({ theme, color }) => ({
  cursor: 'pointer',
  '& g': {
    stroke: color ? color : theme.palette.text.primary
  }
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  height: 44,
  transition: '1s',
  fontSize: 13,
  fontWeight: 400,
  lineHeight: 1.4,
  color: 'var(--ps-text-100)',
  '& .MuiInputBase-input': {
    height: 44,
    padding: theme.spacing(1, 1, 1, 0)
  }
}))

const StyledBox = styled(Box)(() => ({
  borderBottom: '1px solid var(--ps-text-20)',
  my: '24px'
}))

export const SelectToken = ({
  allQuantos,
  isAddLiquidity = false,
  boxAddress,
  boxQuantos
}: {
  allQuantos: undefined | QuantosDetails[]
  isAddLiquidity: boolean
  boxAddress: string
  boxQuantos?: QuantosDetails[]
}) => {
  const [searchText, setSearchText] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  const allQuantosWithFilter = useMemo(() => {
    if (allQuantos)
      return allQuantos?.filter(quanto => quanto.tokenInfo?.symbol?.toLowerCase().includes(searchText.toLowerCase()))
    else return undefined
  }, [searchText, allQuantos])

  return (
    <BaseDialog title="Select a token">
      <Box
        display={'flex'}
        alignItems={'center'}
        sx={{
          background: 'var(--ps-text-10)',
          padding: '0 24px 0 12px',
          borderRadius: 8,
          position: 'relative',
          mb: '24px'
        }}
      >
        <StyledSearch sx={{ mr: '12px' }} />
        <StyledInputBase
          placeholder="Search by name or token address"
          sx={{ width: '100%' }}
          value={searchText}
          onChange={handleChange}
        />
      </Box>
      <StyledBox />
      <Box sx={{ borderRadius: 12, mb: '24px' }}>
        <Box sx={{ maxHeight: '324px', overflow: 'auto', pt: '24px' }}>
          {allQuantosWithFilter &&
            allQuantosWithFilter.map((quanto, index) => (
              <SelectTokenItem
                key={quanto.tradingT}
                quanto={quanto}
                index={index}
                isAddLiquidity={isAddLiquidity}
                boxQuantos={boxQuantos}
              />
            ))}
          {!allQuantosWithFilter ||
            (allQuantosWithFilter?.length === 0 && (
              <Box sx={{ display: 'center', minHeight: '300px', justifyContent: 'center', alignItems: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <NoResultSvg />
                  <Typography sx={{ mt: '24px' }}>Sorry we couldn’t find any related result.</Typography>
                  <Typography>Please search again.</Typography>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
      <StyledBox />
      <Box sx={{ color: 'var(--ps-neutral3, #717171)', display: 'flex', justifyContent: 'center', pt: '32px' }}>
        <Typography sx={{ maxWidth: '312px', textAlign: 'center' }}>
          <span>{"Can't find the target asset you want to trade? Come"}</span>
          <span
            onClick={() => control.show('CreateLiquidityDialog', { boxAddress: boxAddress, allQuantos: allQuantos })}
            style={{ color: 'var(--ps-text-100)', textDecorationLine: 'underline', cursor: 'pointer', margin: '0 4px' }}
          >
            create
          </span>
          <span>one!</span>
        </Typography>
      </Box>
    </BaseDialog>
  )
}

const SelectTokenItem = ({
  quanto,
  index,
  isAddLiquidity = false,
  boxQuantos
}: {
  quanto: QuantosDetails
  index: number
  isAddLiquidity: boolean
  boxQuantos?: QuantosDetails[]
}) => {
  const { updateLeverageStateCallback, data: bitleverageData } = useLeverageStateData()
  const { updateBoxPluginBitleverageDataCallback } = useEditBoxPluginBitleverageData()
  const isAdded = useMemo(() => {
    if (boxQuantos) {
      const boxQuantosList = boxQuantos.map(quanto => quanto.tokenT)
      return boxQuantosList.includes(quanto.tokenT)
    } else return undefined
  }, [boxQuantos, quanto.tokenT])

  return (
    <Box
      sx={{
        py: '10px',
        px: '12px',
        cursor: 'pointer',
        ':hover': { background: 'var(--ps-text-10, rgba(255, 255, 255, 0.1))' }
      }}
      onClick={async () => {
        if (isAddLiquidity) {
          if (!isAdded) await updateBoxPluginBitleverageDataCallback('add', { token0: quanto.tokenT })
        } else {
          await updateLeverageStateCallback({
            tradePairIndex: bitleverageData?.tradePairIndex ?? 0,
            tradeQuantosIndex: index
          })
        }
        control.hide('SelectToken')
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CurrencyLogo currencyOrAddress={quanto?.tokenInfo} size={'24px'} />
          <Box sx={{ ml: '8px' }}>
            <Typography
              sx={{
                color: 'var(--ps-neutral5)',
                fontFamily: '"SF Pro Display"',
                fontStyle: 'normal',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '100%'
              }}
            >
              {quanto.tokenInfo?.symbol}
            </Typography>
            <Typography
              sx={{
                color: 'var(--ps-text-40, rgba(255, 255, 255, 0.4))',
                fontFamily: '"SF Pro Display"',
                fontStyle: 'normal',
                fontSize: '12px',
                fontWeight: '500',
                lineHeight: '100%'
              }}
            >
              {quanto.tokenInfo?.name}
            </Typography>
          </Box>
        </Box>
        {isAdded && <span>Added</span>}
      </Box>
    </Box>
  )
}
