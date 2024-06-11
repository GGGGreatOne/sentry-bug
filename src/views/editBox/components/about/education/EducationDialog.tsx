import BaseDialog from 'components/Dialog/baseDialog'
import EducationForm from './EducationForm'
const EducationDialog = (value: any) => {
  return (
    <BaseDialog title="Education">
      <EducationForm value={value.value} />
    </BaseDialog>
  )
}

export default EducationDialog
