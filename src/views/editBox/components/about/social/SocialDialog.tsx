import BaseDialog from 'components/Dialog/baseDialog'
import SocialForm from './SocialForm'
const SocialDialog = (value: any) => {
  return (
    <BaseDialog title="Social Content">
      <SocialForm value={value.value} />
    </BaseDialog>
  )
}

export default SocialDialog
