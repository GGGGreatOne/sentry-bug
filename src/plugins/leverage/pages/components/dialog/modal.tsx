import { DialogControl } from 'components/Dialog/DialogControl'
import CreateLiquidityDialog from './createLiquidityDialog'
import Confirm from './confirm'
import AddLiquidity from './addLiquidity'
import RemoveLiquidity from './removeLiquidity'
import RewardsClaim from './rewardsClaim'
import EditLong from './editLong'
import EditOrderLong from './editOrderLong'
import CloseOrderLong from './closeOrderLong'
import ConfirmLong from './confirmLong'
import { SelectToken } from './SelectToken'
import UpdatePosition from './UpdatePosition'
export const control = new DialogControl({
  CreateLiquidityDialog,
  Confirm,
  AddLiquidity,
  RemoveLiquidity,
  RewardsClaim,
  EditLong,
  EditOrderLong,
  CloseOrderLong,
  ConfirmLong,

  UpdatePosition,
  SelectToken
})
