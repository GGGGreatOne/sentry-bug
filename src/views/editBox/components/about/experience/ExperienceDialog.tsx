import BaseDialog from 'components/Dialog/baseDialog'
import ExperienceForm from './ExperienceForm'
const ExperienceDialog = (value: any) => {
  return (
    <BaseDialog title="Experience">
      <ExperienceForm value={value.value} />
    </BaseDialog>
  )
}

export default ExperienceDialog
