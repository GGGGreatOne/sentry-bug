import { useFactory } from '../../../plugins/leverage/hook/useFactory'
import { Box, Button, Stack, Typography } from '@mui/material'
import LoadingAnimation from '../../../components/Loading'
import Leverage from 'plugins/leverage/pages'
import { control } from '../../../plugins/leverage/pages/components/dialog/modal'
import React, { useMemo } from 'react'
import { IBoxPluginBasicItemData, IBoxValue } from '../../../state/boxes/type'
// import { useGetClubPluginData } from '../../../hooks/useGetClubPluginDataCallback'
import { useTokens } from 'hooks/useToken'
import { Currency } from 'constants/token'
import EmptyData from 'components/EmptyData'

const Page = ({
  boxContractAdr,
  editing,
  supportedTokenData,
  boxData
}: {
  boxContractAdr: string
  editing: boolean
  boxData: IBoxValue
  supportedTokenData: IBoxPluginBasicItemData[]
}) => {
  const supportedTokenAddresses: string[] = useMemo(() => {
    const _list = new Map()
    for (const item of supportedTokenData) {
      _list.set(item.token0Contract, item.token0Contract)
    }
    return [..._list.keys()].filter(_ => _)
  }, [supportedTokenData])

  const _supportedTokens = useTokens(supportedTokenAddresses)
  const supportedTokens = useMemo(
    () => (_supportedTokens?.filter(i => i) as unknown as Currency[]) || [],
    [_supportedTokens]
  )

  const { allQuantos } = useFactory()
  const boxQuantos = useMemo(() => {
    if (supportedTokens && allQuantos) {
      const tokenList = supportedTokens.map(list => list.address)
      return allQuantos.filter(quanto => tokenList.includes(quanto.tokenT))
    } else return undefined
  }, [supportedTokens, allQuantos])

  if (!allQuantos && supportedTokens)
    return (
      <Box
        sx={{
          display: 'grid',
          placeContent: 'center',
          width: 220,
          height: 220,
          margin: '0 auto'
        }}
      >
        <LoadingAnimation />
      </Box>
    )

  return (
    <>
      {supportedTokens && supportedTokens.length === 0 && (
        <Box sx={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <Stack
            sx={{
              maxWidth: 1200,
              margin: '0 auto !important',
              background: 'var(--ps-neutral2)',
              borderRadius: '12px',
              padding: '32px 40px'
            }}
          >
            <Typography fontSize={28} fontWeight={500}>
              BITLEVERAGE
            </Typography>
            {editing && (
              <Box justifyContent={'center'} alignItems={'center'} sx={{ minHeight: 490, display: 'flex' }}>
                <Box textAlign={'center'}>
                  {supportedTokens?.length === 0 && (
                    <>
                      {allQuantos && allQuantos.length > 0 && (
                        <Button
                          variant="contained"
                          sx={{ width: 'auto', mb: '24px' }}
                          onClick={() =>
                            control.show('SelectToken', {
                              allQuantos: allQuantos,
                              isAddLiquidity: true,
                              boxAddress: boxContractAdr
                            })
                          }
                        >
                          AddLiquidity
                        </Button>
                      )}
                      {(allQuantos?.length === 0 || typeof allQuantos === 'undefined') && (
                        <Button
                          variant="contained"
                          sx={{ width: 'auto', mb: '24px' }}
                          onClick={() =>
                            control.show('CreateLiquidityDialog', {
                              boxAddress: boxContractAdr,
                              allQuantos: allQuantos
                            })
                          }
                        >
                          Create a liquidity
                        </Button>
                      )}
                    </>
                  )}
                  <Typography color={'var(--ps-text-60)'} textAlign={'center'} fontSize={14} fontWeight={400}>
                    Your should {allQuantos && allQuantos.length > 0 ? 'add' : 'create'} a token liquidity first.
                  </Typography>
                </Box>
              </Box>
            )}
            {!editing && supportedTokens.length === 0 && <EmptyData color="var(--ps-text-60)" height={490} />}
          </Stack>
        </Box>
      )}
      {supportedTokens && supportedTokens?.length > 0 && boxQuantos && allQuantos && (
        <Leverage
          allQuantos={allQuantos}
          boxContractAdr={boxContractAdr}
          editing={editing}
          boxQuantos={boxQuantos}
          boxId={boxData.boxBasicInfo.boxId}
        />
      )}
    </>
  )
}

export default Page
