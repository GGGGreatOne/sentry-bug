import { Box, Stack, Typography } from '@mui/material'
import BaseDialog from 'components/Dialog/baseDialog'
// import AddIcon from '@mui/icons-material/Add'
import HotContent from 'assets/svg/boxes/hotContent.svg'
import SimpleIcon from 'assets/svg/boxes/simple.svg'
import TokenomicIcon from 'assets/svg/boxes/tokenomic.svg'
import RoadmapIcon from 'assets/svg/boxes/roadmap.svg'
import TeamIcon from 'assets/svg/boxes/team.svg'
import ExperienceIcon from 'assets/svg/boxes/experience.svg'
import EducationIcon from 'assets/svg/boxes/education.svg'
import FriendsIcon from 'assets/svg/boxes/friends.svg'
import { IBoxAboutSectionTypeName } from 'state/boxes/type'
import { useMemo, useState } from 'react'
import SimpleForm from './simple/SimpleForm'
import TeamForm from './team/TeamForm'
import { viewControl } from 'views/editBox/modal'
import TokenomicForm from './tokenomic/TokenomicForm'
import RoadmapForm from './roadmap/RoadmapForm'
import SocialForm from './social/SocialForm'
import FriendsForm from './friends/FriendsForm'
import EducationForm from './education/EducationForm'
import ExperienceForm from './experience/ExperienceForm'
import useBreakpoint from 'hooks/useBreakpoint'
import { useUserInfo } from 'state/user/hooks'
import { BoxTypes } from 'api/boxes/type'
const isDisabled = (type: string, data: any) => {
  const result = data.some((item: { type: string }) => item.type === type)
  return result
}
import { CSSTransition } from 'react-transition-group'

const AddSection = (data: any) => {
  const isMd = useBreakpoint('md')
  const { box } = useUserInfo()
  const SectionType = useMemo(() => {
    if (box?.boxType === BoxTypes.PROJECT) {
      return [
        {
          name: 'Customize Content',
          icon: SimpleIcon,
          type: IBoxAboutSectionTypeName.SIMPLE,
          disabled: false
        },
        {
          name: 'Social Content',
          icon: HotContent,
          type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
          disabled: isDisabled(IBoxAboutSectionTypeName.SOCIAL_CONTENT, data.data)
        },
        {
          name: 'Tokenomics',
          icon: TokenomicIcon,
          type: IBoxAboutSectionTypeName.TOKENOMIC,
          disabled: isDisabled(IBoxAboutSectionTypeName.TOKENOMIC, data.data)
        },
        {
          name: 'Roadmap',
          icon: RoadmapIcon,
          type: IBoxAboutSectionTypeName.ROADMAP,
          disabled: isDisabled(IBoxAboutSectionTypeName.ROADMAP, data.data)
        },
        {
          name: 'Team',
          icon: TeamIcon,
          type: IBoxAboutSectionTypeName.TEAM,
          disabled: isDisabled(IBoxAboutSectionTypeName.TEAM, data.data)
        }
      ]
    }
    return [
      {
        name: 'Customize Content',
        icon: SimpleIcon,
        type: IBoxAboutSectionTypeName.SIMPLE,
        disabled: false
      },
      {
        name: 'Social Content',
        icon: HotContent,
        type: IBoxAboutSectionTypeName.SOCIAL_CONTENT,
        disabled: isDisabled(IBoxAboutSectionTypeName.SOCIAL_CONTENT, data.data)
      },
      {
        name: 'Experience',
        icon: ExperienceIcon,
        type: IBoxAboutSectionTypeName.EXPERIENCE,
        disabled: isDisabled(IBoxAboutSectionTypeName.EXPERIENCE, data.data)
      },
      {
        name: 'Education',
        icon: EducationIcon,
        type: IBoxAboutSectionTypeName.EDUCATION,
        disabled: isDisabled(IBoxAboutSectionTypeName.EDUCATION, data.data)
      },
      {
        name: 'Friends',
        icon: FriendsIcon,
        type: IBoxAboutSectionTypeName.FRIENDS,
        disabled: isDisabled(IBoxAboutSectionTypeName.FRIENDS, data.data)
      }
    ]
  }, [box?.boxType, data.data])
  const [title, setTitle] = useState<string>('ADD A SECTION')
  const [tab, setTab] = useState<string>('section')
  const handleSection = (type: IBoxAboutSectionTypeName) => {
    if (type === IBoxAboutSectionTypeName.SIMPLE) {
      setTitle('Customize Content')
      setTab(IBoxAboutSectionTypeName.SIMPLE)
    } else if (type === IBoxAboutSectionTypeName.SOCIAL_CONTENT) {
      setTitle('Social Content')
      setTab(IBoxAboutSectionTypeName.SOCIAL_CONTENT)
    } else if (type === IBoxAboutSectionTypeName.TOKENOMIC) {
      setTitle('Tokenomics')
      setTab(IBoxAboutSectionTypeName.TOKENOMIC)
    } else if (type === IBoxAboutSectionTypeName.ROADMAP) {
      setTitle('Roadmap')
      setTab(IBoxAboutSectionTypeName.ROADMAP)
    } else if (type === IBoxAboutSectionTypeName.TEAM) {
      setTitle('Team')
      setTab(IBoxAboutSectionTypeName.TEAM)
    } else if (type === IBoxAboutSectionTypeName.EXPERIENCE) {
      setTitle('Experience')
      setTab(IBoxAboutSectionTypeName.EXPERIENCE)
    } else if (type === IBoxAboutSectionTypeName.EDUCATION) {
      setTitle('Education')
      setTab(IBoxAboutSectionTypeName.EDUCATION)
    } else {
      setTitle('Friends')
      setTab(IBoxAboutSectionTypeName.FRIENDS)
    }
  }
  const handleCancel = () => {
    setTab('section')
    setTitle('ADD A SECTION')
  }
  const handleHide = () => {
    viewControl.hide('AddSection')
    setTimeout(function () {
      handleCancel()
    }, 500)
  }
  return (
    <BaseDialog title={title} onClose={handleHide} minWidth={562}>
      <CSSTransition in={tab === 'section'} timeout={300} classNames="createStepLeft-transition" unmountOnExit>
        <>
          {tab === 'section' && (
            <Box
              gap={isMd ? 11 : 16}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                marginBottom: isMd ? 0 : 32
              }}
            >
              {SectionType.map((item, index) => {
                return (
                  <Stack
                    width={index === SectionType.length - 1 ? '100%' : '48%'}
                    key={index}
                    gap={16}
                    alignItems={'center'}
                    flexDirection={'column'}
                    sx={{
                      padding: '24px 0',
                      background: 'var(--ps-neutral2)',
                      opacity: item.disabled ? 0.4 : 1,
                      borderRadius: 8,
                      cursor: item.disabled ? 'not-allowed' : 'pointer',
                      ':hover': {
                        background: item.disabled ? '' : 'var(--ps-text-10)'
                      }
                    }}
                    onClick={() => {
                      if (!item.disabled) {
                        handleSection(item.type)
                      }
                    }}
                  >
                    {<item.icon />}
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: isMd ? 13 : 15,
                        fontWeight: 500,
                        lineHeight: isMd ? '13px' : '15px',
                        color: 'var(--ps-text-100)'
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Stack>
                )
              })}
            </Box>
          )}
        </>
      </CSSTransition>
      <CSSTransition in={tab !== 'section'} timeout={300} classNames="createStepRight-transition" unmountOnExit>
        <>
          {tab === IBoxAboutSectionTypeName.SIMPLE && (
            <SimpleForm index={data.data.length} onCancel={handleCancel} onHide={handleHide} />
          )}
          {tab === IBoxAboutSectionTypeName.TEAM && <TeamForm onCancel={handleCancel} onHide={handleHide} />}
          {tab === IBoxAboutSectionTypeName.TOKENOMIC && <TokenomicForm onCancel={handleCancel} onHide={handleHide} />}
          {tab === IBoxAboutSectionTypeName.ROADMAP && <RoadmapForm onCancel={handleCancel} onHide={handleHide} />}
          {tab === IBoxAboutSectionTypeName.SOCIAL_CONTENT && (
            <SocialForm onCancel={handleCancel} onHide={handleHide} />
          )}
          {tab === IBoxAboutSectionTypeName.EDUCATION && <EducationForm onCancel={handleCancel} onHide={handleHide} />}
          {tab === IBoxAboutSectionTypeName.EXPERIENCE && (
            <ExperienceForm onCancel={handleCancel} onHide={handleHide} />
          )}
          {tab === IBoxAboutSectionTypeName.FRIENDS && <FriendsForm onCancel={handleCancel} onHide={handleHide} />}
        </>
      </CSSTransition>

      {/* <Button
        variant="contained"
        size="large"
        sx={{
          width: '100%'
        }}
      >
        <AddIcon sx={{ fontSize: 19, marginRight: 5 }} />
        <Typography
          variant="h5"
          sx={{
            fontSize: 15,
            fontWeight: 500,
            lineHeight: '15px',
            color: 'var(--ps-text-primary)'
          }}
        >
          Add Section
        </Typography>
      </Button> */}
    </BaseDialog>
  )
}

export default AddSection
