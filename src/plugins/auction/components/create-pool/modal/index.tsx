import { DialogControl } from 'components/Dialog/DialogControl'
import Erc20CreatePoolConfirm from './erc20CreatePoolConfirm'
import CreateErc20StakingConfirm from './createErc20StakingConfirm'
import AddFixedSwapToClub from './addAuctionToClub/addFixedSwapToClub'
import AddStakingToClub from './addAuctionToClub/addStakingToClub'
import ImportWhitelistWithAmountDialog from './ImportWhitelistWithAmountDialog'
const auctionDialogControl = new DialogControl({
  Erc20CreatePoolConfirm,
  CreateErc20StakingConfirm,
  AddFixedSwapToClub,
  AddStakingToClub,
  ImportWhitelistWithAmountDialog
})
export default auctionDialogControl
