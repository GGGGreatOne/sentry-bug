import BaseDialog from 'components/Dialog/baseDialog'
import SimpleForm from './SimpleForm'
import { IBoxAboutSectionTypeSimpleValue } from 'state/boxes/type'
interface Props {
  value: IBoxAboutSectionTypeSimpleValue
  index: number
}
const SimpleDialog = ({ value, index }: Props) => {
  return (
    <BaseDialog title={value.title.toUpperCase()}>
      <SimpleForm title={value.title} content={value.content} index={index} />
    </BaseDialog>
  )
}

export default SimpleDialog
