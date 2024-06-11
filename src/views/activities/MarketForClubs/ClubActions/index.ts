export * from './PutOnSellButton'
import { DialogControl } from 'components/Dialog'
import { PutOnSellDialog } from './PutOnSellDialog'
import { CancelSaleDialog } from './CancelSaleDialog'
import { ResultPromptDialog } from './ResultPromptDialog'
import { PurchaseDialog } from './PurchaseDialog'

export const viewControl = new DialogControl({ PutOnSellDialog, CancelSaleDialog, PurchaseDialog, ResultPromptDialog })
