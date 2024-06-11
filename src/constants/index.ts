import { PaletteMode } from '@mui/material'
import { IClubPluginId, IPluginNameType } from 'state/boxes/type'

export const DEFAULT_THEME: PaletteMode = 'dark'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

type PluginIdMap = {
  [key in IPluginNameType]: IClubPluginId
}
export const getAppPluginId = (name: IPluginNameType) => {
  const list: PluginIdMap = {
    [IPluginNameType.PicWe]: IClubPluginId.PicWe,
    [IPluginNameType.USDX]: IClubPluginId.USDX,
    [IPluginNameType.AllDeFi]: IClubPluginId.AllDeFi,
    [IPluginNameType.MailZero]: IClubPluginId.MailZero,
    [IPluginNameType.Bitswap]: IClubPluginId.BITSWAP,
    [IPluginNameType.Bitleverage]: IClubPluginId.BITLEVERAGE,
    [IPluginNameType.Bitstable]: IClubPluginId.BITSTABLE,
    [IPluginNameType.Bitstaking]: IClubPluginId.BITSTAKING,
    [IPluginNameType.FiveInARow]: IClubPluginId.GOBANG,
    [IPluginNameType.ShisenSho]: IClubPluginId.LINK,
    [IPluginNameType.JigsawPuzzle]: IClubPluginId.PUZZLE,
    [IPluginNameType.BoxStack]: IClubPluginId.BOX,
    [IPluginNameType.FallingBlocks]: IClubPluginId.TETRIS,
    [IPluginNameType.Auction]: IClubPluginId.Auction
  }

  return list[name]
}
