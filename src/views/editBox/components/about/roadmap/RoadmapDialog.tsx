import BaseDialog from 'components/Dialog/baseDialog'
import RoadmapForm from './RoadmapForm'
const RoadmapDialog = (value: any) => {
  return (
    <BaseDialog title="Roadmap">
      <RoadmapForm value={value.value} />
    </BaseDialog>
  )
}

export default RoadmapDialog
