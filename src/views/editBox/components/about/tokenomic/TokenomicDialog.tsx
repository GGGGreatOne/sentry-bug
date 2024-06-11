import BaseDialog from 'components/Dialog/baseDialog'
import TokenomicForm from './TokenomicForm'
const TokenomicDialog = (value: any) => {
  return (
    <BaseDialog title="Tokenomics">
      <TokenomicForm value={value.value} />
    </BaseDialog>
  )
}

export default TokenomicDialog
