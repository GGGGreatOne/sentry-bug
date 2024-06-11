import Input from 'components/Input'
import { Currency } from 'constants/token'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { viewControl } from 'views/editBox/modal'
import Image from 'components/Image'
import { Box, styled } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import SearchSvg from 'assets/svg/search.svg'
import { ITokenListItem, TokenType } from 'api/common/type'
import { usePairContract } from 'components/Widget/hooks/useContract'
import { useSingleCallResult } from 'hooks/multicall'
import { useActiveWeb3React } from 'hooks'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'
import { useToken } from 'hooks/useToken'
import { useGetPluginTokenList } from 'state/pluginTokenListConfig/hooks'

interface Props {
  checkToken?: Currency | undefined
  setCheckToken?: Dispatch<SetStateAction<Currency | undefined>>
  clearable?: boolean
  onSelect?: (val: Currency | undefined, tokenType: TokenType) => void
}

export const useGetPairToken = (tokenAddr: string) => {
  const { chainId } = useActiveWeb3React()
  const pairContract = usePairContract(tokenAddr)
  const token0Address = useSingleCallResult(chainId, pairContract, 'token0')?.result?.[0]
  const token1Address = useSingleCallResult(chainId, pairContract, 'token1')?.result?.[0]
  return { token0Address: token0Address, token1Address: token1Address }
}

const SelectToken = ({ checkToken, setCheckToken, clearable = false, onSelect }: Props) => {
  useGetPluginTokenList()
  const { token0Address, token1Address } = useGetPairToken(checkToken?.address || '')
  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)
  const handleTokenSelection = useCallback(
    (e: { tokenItem: ITokenListItem; tokenCurrency: Currency }) => {
      setCheckToken && setCheckToken(e.tokenCurrency)
      onSelect && onSelect(e.tokenCurrency, e.tokenItem.tokenType)
      viewControl.hide('SelectTokenDialog')
    },
    [onSelect, setCheckToken]
  )

  const showSelectTokenDialog = useCallback(() => {
    viewControl.show('SelectTokenDialog', {
      handleTokenSelection,
      curSelectToken: checkToken
    })
  }, [checkToken, handleTokenSelection])

  const clearToken = useCallback(() => {
    setCheckToken && setCheckToken(undefined)
  }, [setCheckToken])

  return (
    <CusInput
      startAdornment={
        <Box display={'flex'} alignItems={'center'}>
          <Box mr={12} display={'flex'} alignItems={'center'}>
            <CusSearchSvg />
          </Box>
          {token0Address ? (
            <DoubleCurrencyLogo
              size={24}
              currency0={token0Address || undefined}
              currency1={token1Address || undefined}
            />
          ) : (
            checkToken?.logo && (
              <Image
                style={{
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}
                src={checkToken?.logo}
                width={24}
                height={24}
                alt=""
              ></Image>
            )
          )}
        </Box>
      }
      placeholder="Select token"
      endAdornment={
        clearable &&
        checkToken && (
          <Box
            onClick={e => {
              e.stopPropagation()
              clearToken()
            }}
            sx={{ cursor: 'pointer' }}
            display={'flex'}
            alignItems={'center'}
          >
            {<ClearIcon />}
          </Box>
        )
      }
      onClick={showSelectTokenDialog}
      value={token0Address ? token0?.symbol + '/' + token1?.symbol : checkToken?.symbol || ''}
    ></CusInput>
  )
}

const CusInput = styled(Input)`
  &.MuiInputBase-root {
    height: 44px;
    border-radius: 6px;
    /* background: var(--ps-text-10); */
    padding-right: 24px;
    border: 1px solid var(--ps-text-20);
  }

  &.Mui-focused {
    border: 1px solid var(--ps-text-20) !important;
  }

  & .MuiInputBase-input::placeholder {
    color: var(--ps-neutral3, red);
    /* D/body3 */
    font-family: 'SF Pro Display';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 18.2px */
  }
`

const CusSearchSvg = styled(SearchSvg)`
  g {
    stroke: #bcbcbc;
  }
`
export default SelectToken
