import BaseDialog from 'components/Dialog/baseDialog'
import FriendsForm from './FriendsForm'
const FriendsDialog = (value: any) => {
  return (
    <BaseDialog title="Friends" minWidth={562}>
      <FriendsForm value={value.value} />
    </BaseDialog>
  )
}

export default FriendsDialog
