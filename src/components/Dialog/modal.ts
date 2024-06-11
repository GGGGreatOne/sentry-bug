import { DialogControl } from './DialogControl'
import LastestUpdatesDialog from './components/LastestUpdatesDialog'
import SignLoginDialog from './components/SignLoginDialog'
import SwitchNetworkDialog from './components/SwitchNetworkDialog'

import PendingTipDialog from './components/PendingTipDialog'
import ResultTipDialog from './components/ResultTipDialog'
import SelectTokenDialog from './selectTokenDialog'
export const globalDialogControl = new DialogControl({
  PendingTipDialog,
  ResultTipDialog,
  SelectTokenDialog,
  SignLoginDialog,
  SwitchNetworkDialog,
  LastestUpdatesDialog
})
