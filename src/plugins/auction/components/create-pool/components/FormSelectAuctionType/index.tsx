import { MenuItem, Select, Typography } from '@mui/material'
import { FormLayout, Title } from '../../comps'
import { AuctionType } from 'plugins/auction/plugins/fixed-price/constants/type'
import { useCreateParams } from 'plugins/auction/pages/erc20-create-pool/provider'
import { useCallback } from 'react'
import { ProviderDispatchActionType } from 'plugins/auction/pages/erc20-create-pool/type'
import DownArrowWhite from 'assets/svg/auction/arrow-down-white.svg'
type AuctionKeyType = keyof typeof AuctionType
interface Props {
  onChange: (v: AuctionType) => void
  curAuctionType: AuctionType
}
const FormSelectAuctionType = ({ curAuctionType, onChange }: Props) => {
  const { dispatch } = useCreateParams()
  const handleChangeAuctionType = useCallback(
    (type: AuctionType) => {
      if (dispatch) {
        dispatch({ type: ProviderDispatchActionType.setPoolValue, payload: { auctionType: type } })
      }
    },
    [dispatch]
  )
  const selectChange = useCallback(
    (v: AuctionType) => {
      onChange(v)
      handleChangeAuctionType(v)
    },
    [handleChangeAuctionType, onChange]
  )
  return (
    <FormLayout
      title1="Auction Type"
      childForm={
        <Select
          sx={{
            '&.MuiOutlinedInput-root': {
              height: 44,
              color: 'rgba(230, 230, 206, 0.60)'
            },
            '& .MuiSvgIcon-root': {
              display: 'none'
            },
            '& .MuiOutlinedInput-notchedOutline,&:hover .MuiOutlinedInput-notchedOutline': {
              borderRadius: 0,
              border: '1px solid  rgba(230, 230, 206, 0.20)'
            }
          }}
          endAdornment={<DownArrowWhite />}
          value={curAuctionType}
          onChange={e => {
            const val = e.target.value as AuctionType
            selectChange(val)
          }}
          renderValue={selected => {
            return (
              <Title sx={{ fontSize: 16, color: '#85878C', fontWeight: 400, textTransform: 'capitalize' }}>
                {selected} Auction
              </Title>
            )
          }}
          MenuProps={{
            sx: {
              '& .MuiPaper-root': {
                top: { xs: 370, md: 960 },
                borderRadius: 8,
                border: '1px solid var(--black-6, rgba(18, 18, 18, 0.06))',
                background: ' #1b1b1b',
                '& .MuiMenuItem-root': {
                  background: ' #1b1b1b'
                }
              }
            }
          }}
        >
          {(Object.keys(AuctionType) as AuctionKeyType[]).map(key => (
            <MenuItem key={key} value={AuctionType[key]} sx={{}}>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: curAuctionType === AuctionType[key] ? '#FFFFE5' : 'rgba(230, 230, 206, 0.60)',
                  fontWeight: 400,
                  textTransform: 'capitalize'
                }}
              >
                {AuctionType[key]} Auction
              </Typography>
            </MenuItem>
          ))}
        </Select>
      }
    />
  )
}
export default FormSelectAuctionType
