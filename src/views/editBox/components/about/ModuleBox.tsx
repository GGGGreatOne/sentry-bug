import { Box } from '@mui/material'
import Simple from './simple'
import Team from './team'
// import p3 from 'assets/images/home/p3.png'
import Tokenomic from './tokenomic'
import Roadmap from './roadmap'
import Social from './social'
import Experience from './experience'
import Education from './education'
import Friends from './friends'
import { IBoxAboutSectionTypeName, IPluginAboutData } from 'state/boxes/type'
import useBreakpoint from 'hooks/useBreakpoint'

const ModuleBox = ({ data }: { data: IPluginAboutData<any> }) => {
  const isMd = useBreakpoint('md')
  return (
    <Box>
      {data.type === IBoxAboutSectionTypeName.SIMPLE && data.value && (
        <Simple
          text={data.value.content}
          sx={{
            fontWeight: 500,
            lineHeight: 1.4,
            fontStyle: 'normal',
            wordBreak: 'break-word',
            fontSize: isMd ? 12 : 15
          }}
        />
      )}
      {data.type === IBoxAboutSectionTypeName.SOCIAL_CONTENT && <Social data={data.value} />}
      {data.type === IBoxAboutSectionTypeName.TOKENOMIC && <Tokenomic data={data.value} />}
      {data.type === IBoxAboutSectionTypeName.ROADMAP && <Roadmap data={data.value} />}
      {data.type === IBoxAboutSectionTypeName.TEAM && <Team data={data.value} />}
      {data.type === IBoxAboutSectionTypeName.EDUCATION && <Education data={data.value} />}
      {data.type === IBoxAboutSectionTypeName.EXPERIENCE && <Experience data={data.value} />}
      {data.type === IBoxAboutSectionTypeName.FRIENDS && <Friends data={data.value} />}
    </Box>
  )
}

export default ModuleBox
