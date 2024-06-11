import BaseDialog from 'components/Dialog/baseDialog'
import { Box, Button, Stack, Typography, styled } from '@mui/material'
import { viewControl } from 'views/editBox/modal'
import NoTokenIconSvg from 'plugins/tokenToolBox/assets/toolBox/tokeninfo_no_icon.svg'
import NoTokenIconMdSvg from 'plugins/tokenToolBox/assets/toolBox/tokeninfo_no_icon_md.svg'
import NoTokenUploadMdSvg from 'plugins/tokenToolBox/assets/toolBox/tokeninfo_upload_icon.svg'
import { ReactNode, useMemo, useState } from 'react'
import { useCurrencyBalance, useToken } from 'hooks/useToken'
import { useTotalSupply } from 'components/Widget/data/TotalSupply'
import { useActiveWeb3React } from 'hooks'
import BlueArrow from 'plugins/tokenToolBox/assets/toolBox/blue_arrow.svg'
import { NETWORK_CHAIN_ID } from 'constants/chains'
import { useTokenListGetToken } from 'plugins/tokenToolBox/hook/useTokenList'
import { useUserInfo } from 'state/user/hooks'
import { CusButton, RowItem, SectionItem } from './ComonComponents'
import { Currency } from 'constants/token'
import Copy from 'components/essential/Copy'
import Tooltip from 'components/Tooltip'
import Upload from 'components/Upload'
import Image from 'components/Image'
import { toast } from 'react-toastify'
import { upload } from 'api/common'
import { TokenUploadimg } from 'api/toolbox'
import useBreakpoint from 'hooks/useBreakpoint'
import { ITokenListItem, TokenType } from 'api/common/type'
import DoubleCurrencyLogo from 'components/essential/CurrencyLogo/DoubleLogo'

const UploadLoading = ({ loading, children }: { loading: boolean; children: ReactNode }) => {
  const StyleBox = loading ? LoadingBox : Box
  return <StyleBox>{children}</StyleBox>
}

// const TokenPairsSymbol = ({ token0, token1 }: { token0?: Currency | null; token1?: Currency | null }) => {
//   if (!token0 || !token1) {
//     return '--'
//   }
//   return `${token0?.symbol} / ${token1?.symbol}`
// }

interface Props {
  token: Currency
  token0Contract?: string
  token1Contract?: string
  tokenType: TokenType
  data?: ITokenListItem
  boxAddress: string
  hideCallBack?: () => void
}

const TokenInfo = ({ data, token, token0Contract, token1Contract, tokenType, hideCallBack, boxAddress }: Props) => {
  const isMd = useBreakpoint('md')
  const { account, chainId } = useActiveWeb3React()
  const userTokenBalance = useCurrencyBalance(account, token || undefined, chainId)
  const userTotalSupply = useTotalSupply(token as any)
  const userInfo = useUserInfo()
  const token0 = useToken(token0Contract || '', chainId)
  const token1 = useToken(token1Contract || '', chainId)
  const isLp = useMemo(() => tokenType !== TokenType.TOKEN, [tokenType])
  const [hasToken] = useTokenListGetToken(
    {
      boxId: userInfo.box?.boxId ? Number(userInfo.box?.boxId) : undefined
    },
    token?.address || ''
  )

  const [tokenImageFile, setTokenImageFile] = useState<File | undefined>()
  const [loading, setLoading] = useState(false)
  return (
    <BaseDialog
      minWidth={650}
      mt={0}
      onClose={() => {
        setTokenImageFile(undefined)
        hideCallBack && hideCallBack()
        viewControl.hide('TokenMinter')
      }}
    >
      <Stack gap={40}>
        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} gap={20}>
            {isLp ? (
              <Box display={'flex'} alignItems={'center'} width={'100'}>
                <DoubleCurrencyLogo
                  size={isMd ? 40 : 64}
                  currency0={token0 || undefined}
                  currency1={token1 || undefined}
                />
              </Box>
            ) : (
              <Upload
                isReady={!data && (!hasToken || loading)}
                imgRadius={'50%'}
                hideHover={true}
                imgWidth={isMd ? 40 : 64}
                imgHeight={isMd ? 40 : 64}
                isImgAlignCenter={true}
                onDelete={() => {}}
                onSuccess={async ({ file }) => {
                  setTokenImageFile(file)

                  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                    return toast.error('Please upload PNG or JPG files only for intelligent submission.')
                  }
                  setLoading(true)
                  const uploadRes = await upload({
                    file
                  })
                  setLoading(false)
                  if (uploadRes.code === 200) {
                    const nameRes = await TokenUploadimg({ tokenContract: token.address, imageUrl: uploadRes.data.url })
                    if (nameRes.code !== 200) toast.error(nameRes.msg)
                    return
                  } else if (uploadRes.code === 401) {
                    toast.error('Sorry, you do not have permission.')
                    return
                  } else {
                    toast.error('Sorry, you failed to upload your avatar.')
                    return
                  }
                }}
                file={tokenImageFile}
              >
                <UploadLoading loading={!data && (!hasToken || loading)}>
                  <Box display={'flex'} alignItems={'center'} position={'relative'}>
                    {token.logo ? (
                      <Image
                        style={{ borderRadius: '50%', overflow: 'hidden' }}
                        alt=""
                        src={token.logo}
                        width={isMd ? 40 : 64}
                        height={isMd ? 40 : 64}
                      ></Image>
                    ) : isMd ? (
                      <NoTokenIconMdSvg />
                    ) : (
                      <>
                        <NoTokenIconSvg />
                        <Box
                          position={'absolute'}
                          top={'50%'}
                          left={'50%'}
                          sx={{
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          <NoTokenUploadMdSvg />
                        </Box>
                      </>
                    )}
                  </Box>
                </UploadLoading>
              </Upload>
            )}
            <Typography
              fontFamily={'IBM Plex Sans'}
              color={'var(--ps-text-100)'}
              fontSize={28}
              fontWeight={500}
              lineHeight={1.4}
              style={{
                width: isMd ? 230 : 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {token?.name}
            </Typography>
          </Stack>
          {/* <LoadingButton
            variant={'contained'}
            loading={!token && !hasToken}
            onClick={() =>
              viewControl.show('EditTokenImage', {
                tokenContract: token?.address,
                imageUrl: '',
                hideCallBack: val => {
                  setImageUrl(val || '')
                }
              })
            }
          >
            Upload Token Image
          </LoadingButton> */}
        </Stack>
        <SectionItem label="Token Information">
          <RowItem direction={isMd ? 'column' : 'row'} label="Contract address">
            <Stack gap={6} direction={'row'} width={'100%'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  'word-wrap': 'break-word'
                }}
                fontFamily={'IBM Plex Sans'}
                width={isMd ? 258 : 'max-content'}
                fontSize={isMd ? 15 : 16}
                fontWeight={400}
                lineHeight={1.4}
                color={'var(--ps-text-100)'}
              >
                {token?.address || '--'}
              </Typography>
              <Tooltip title="Copy address" placement="top">
                <Box>
                  <Copy toCopy={token?.address} />
                </Box>
              </Tooltip>
            </Stack>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Total supply">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {userTotalSupply?.toExact({ groupSeparator: ',' }) || '0'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Token symbol">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
              style={{
                textAlign: isMd ? 'left' : 'right',
                width: isMd ? '100%' : 500,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {token0 ? `${token0?.symbol} / ${token1?.symbol}` : token?.symbol || '--'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} label="Token decimal">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {token?.decimals || '--'}
            </Typography>
          </RowItem>
          <RowItem direction={isMd ? 'column' : 'row'} hasBorderBottom={false} label="Token balance">
            <Typography
              fontFamily={'IBM Plex Sans'}
              fontSize={isMd ? 15 : 16}
              fontWeight={400}
              lineHeight={1.4}
              color={'var(--ps-text-100)'}
            >
              {userTokenBalance?.toExact({ groupSeparator: ',' }) || '0'}
            </Typography>
          </RowItem>
          <Button
            sx={{
              width: '100%'
            }}
            variant={'contained'}
            disabled={userTokenBalance?.toExact() === '0'}
            onClick={() =>
              viewControl.show('Transfer', {
                tokenAddr: token.address
              })
            }
          >
            Transfer
          </Button>
        </SectionItem>

        <SectionItem
          label="Token Locked"
          rightItem={
            <CusButton
              onClick={() => {
                // todo lp
                viewControl.show('TokenLock', {
                  tokenType: tokenType,
                  chainId: NETWORK_CHAIN_ID,
                  token: new Currency(
                    token.chainId,
                    token.address,
                    token.decimals,
                    token.symbol,
                    token.name,
                    token.logo
                  ),
                  LockInfo: {
                    name: data?.tokenName
                  },
                  boxAddress: boxAddress,
                  rKey: Math.random()
                })
              }}
              sx={{ padding: '8px 16px' }}
              variant={'contained'}
            >
              + Lock
            </CusButton>
          }
        >
          <AllBox>
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              sx={{
                cursor: 'pointer'
              }}
              onClick={() => {
                viewControl.show('MyLock', { boxAddress: boxAddress, rKey: Math.random() })
              }}
            >
              <Typography fontFamily={'IBM Plex Sans'} color={'#4e6ef3'} fontSize={isMd ? 13 : 15}>
                All history
              </Typography>
              <BlueArrow />
            </Stack>
          </AllBox>
        </SectionItem>
        <SectionItem
          label="Token Disperse"
          rightItem={
            <CusButton
              onClick={() => {
                viewControl.show('Disperse', {
                  disperseType: 'token',
                  token: new Currency(
                    token.chainId,
                    token.address,
                    token.decimals,
                    token.symbol,
                    token.name,
                    token.logo
                  ),
                  boxAddress: boxAddress,
                  urlChainParam: NETWORK_CHAIN_ID.toString(),
                  rKey: Math.random()
                })
              }}
              sx={{ padding: '8px 16px' }}
              variant={'contained'}
            >
              + Disperse
            </CusButton>
          }
        >
          <AllBox>
            <Stack
              flexDirection={'row'}
              alignItems={'center'}
              sx={{
                cursor: 'pointer'
              }}
              onClick={() => {
                viewControl.show('MyDisperse', { boxAddress: '', rKey: Math.random() })
              }}
            >
              <Typography fontFamily={'IBM Plex Sans'} color={'#4e6ef3'} fontSize={isMd ? 13 : 15}>
                All history
              </Typography>
              <BlueArrow />
            </Stack>
          </AllBox>
        </SectionItem>
      </Stack>
    </BaseDialog>
  )
}

const AllBox = styled(Box)`
  display: flex;
  height: 80px;
  padding: 12px 24px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  background: var(--ps-text-10);
`

const LoadingBox = styled(Box)`
  opacity: 0.5;
  cursor: not-allowed;
`

export default TokenInfo
