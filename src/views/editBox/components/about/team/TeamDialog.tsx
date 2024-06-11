import BaseDialog from 'components/Dialog/baseDialog'
import TeamForm from './TeamForm'
const TeamDialog = (value: any) => {
  return (
    <BaseDialog title="Team" minWidth={562}>
      <TeamForm value={value.value} />
    </BaseDialog>
  )
}

export default TeamDialog
