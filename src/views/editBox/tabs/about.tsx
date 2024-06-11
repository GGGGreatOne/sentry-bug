import { Box, Popper, Stack, Typography, styled, Button, ClickAwayListener } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import DragIcon from 'assets/svg/boxes/dragIcon.svg'
import PenIcon from 'assets/svg/boxes/pen.svg'
import DeleteSvg from 'assets/svg/boxes/delete.svg'
import Draggable from 'components/Draggable'
import ModuleBox from '../components/about/ModuleBox'
import { IBoxAboutSectionTypeName, IBoxesJsonData, IPluginAboutData } from 'state/boxes/type'
import { useEditBoxAboutData } from 'state/boxes/hooks'
import { viewControl } from 'views/editBox/modal'
import Simple from '../components/about/simple'
import useBreakpoint from 'hooks/useBreakpoint'
import React from 'react'

const StyledDeleteSvg = styled(DeleteSvg)(() => ({
  position: 'absolute',
  top: '50%',
  right: -50,
  transform: 'translateY(-50%)',
  cursor: 'pointer',
  '& path': {
    fill: 'var(--ps-neutral4)'
  }
}))

const StyledPenDragIcon = styled(DragIcon)<{ isDragged: boolean }>(({ isDragged }) => ({
  position: 'absolute',
  top: '50%',
  left: -50,
  transform: 'translateY(-50%)',
  cursor: isDragged ? 'grabbing' : 'grab',
  '& path': {
    stroke: 'var(--ps-neutral4)'
  }
}))

const Page = ({
  draftInfo,
  editing,
  data
}: {
  draftInfo: IBoxesJsonData | null | undefined
  editing: boolean
  data: Array<IPluginAboutData<IBoxAboutSectionTypeName>>
}) => {
  const isMd = useBreakpoint('md')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [indexNum, setIndexNum] = useState<number | undefined>(undefined)
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined
  const handleDelete = (event: React.MouseEvent<HTMLElement>, index: number) => {
    if (index === indexNum) {
      setAnchorEl(anchorEl ? null : event.currentTarget)
    } else {
      setAnchorEl(event.currentTarget)
    }
  }
  const { updateBoxAboutSortCallback } = useEditBoxAboutData()
  const updateSort = async (arr: IPluginAboutData<IBoxAboutSectionTypeName>[]) => {
    await updateBoxAboutSortCallback(arr)
    setDraggableItems(arr)
  }
  const [draggableItems, setDraggableItems] = useState(data)

  useEffect(() => {
    setDraggableItems(data)
  }, [data])

  useEffect(() => {
    if (draftInfo?.listingStatus) {
      const _data = data?.map(item => ({ ...item, disabled: true }))
      setDraggableItems(_data)
    }
  }, [data, draftInfo?.listingStatus])

  const emptyBox = (data: IPluginAboutData<any>) => {
    const { value, type } = data

    switch (type) {
      case IBoxAboutSectionTypeName.SIMPLE:
        if (value.content) {
          break
        }
      case IBoxAboutSectionTypeName.TOKENOMIC:
        if (value.totalSupply) {
          break
        }
      case IBoxAboutSectionTypeName.ROADMAP:
        if (value.roadmapItem?.length) {
          break
        }
      case IBoxAboutSectionTypeName.SOCIAL_CONTENT:
        if (value.socialItem?.length) {
          break
        }
      case IBoxAboutSectionTypeName.EDUCATION:
      case IBoxAboutSectionTypeName.EXPERIENCE:
        if (value.experienceItem?.length) {
          break
        }
      case IBoxAboutSectionTypeName.TEAM:
      case IBoxAboutSectionTypeName.FRIENDS:
        if (value.teamItem?.length) {
          break
        }
      default:
        return <Simple text="No content." />
    }

    return <ModuleBox data={data} />
  }

  const handleEdit = (value: IPluginAboutData<IBoxAboutSectionTypeName>, index: number) => {
    const data = JSON.parse(JSON.stringify(value))

    if (value.type === IBoxAboutSectionTypeName.SIMPLE) {
      data.index = index
    }
    if (value.type === IBoxAboutSectionTypeName.SIMPLE) {
      viewControl.show('SimpleDialog', data)
    } else if (value.type === IBoxAboutSectionTypeName.SOCIAL_CONTENT) {
      viewControl.show('SocialDialog', data)
    } else if (value.type === IBoxAboutSectionTypeName.TOKENOMIC) {
      viewControl.show('TokenomicDialog', data)
    } else if (value.type === IBoxAboutSectionTypeName.ROADMAP) {
      viewControl.show('RoadmapDialog', data)
    } else if (value.type === IBoxAboutSectionTypeName.TEAM) {
      viewControl.show('TeamDialog', data)
    } else if (value.type === IBoxAboutSectionTypeName.EDUCATION) {
      viewControl.show('EducationDialog', data)
    } else if (value.type === IBoxAboutSectionTypeName.EXPERIENCE) {
      viewControl.show('ExperienceDialog', data)
    } else {
      viewControl.show('FriendsDialog', data)
    }
  }

  const toAddItem = useCallback(() => {
    if (draftInfo?.listingStatus) return
    viewControl.show('AddSection', { data: data })
  }, [data, draftInfo?.listingStatus])
  return (
    <Stack direction={'column'} spacing={isMd ? 16 : 24} justifyContent={'center'}>
      {editing && (
        <Stack
          sx={{
            maxWidth: 924,
            margin: '0 auto !important',
            borderRadius: '12px',
            padding: isMd ? '12px 24px' : '32px 40px',
            color: 'var(--ps-text-100)',
            fontSize: isMd ? 13 : 20,
            lineHeight: isMd ? '13px' : '26px',
            width: '100%',
            textAlign: 'center',
            fontWeight: 500,
            cursor: 'pointer',
            backgroundColor: 'var(--ps-neutral2)'
          }}
          onClick={toAddItem}
        >
          + ADD A SECTION
        </Stack>
      )}
      <Stack width={'100%'} justifyContent={'center'}>
        <Draggable
          itemList={draggableItems}
          setItemList={arr => {
            updateSort(arr)
          }}
          parentItem={({ children, props }) => (
            <Stack
              {...(editing && props)}
              width={'100%'}
              sx={{ maxWidth: 924, margin: '0 auto !important' }}
              spacing={isMd ? 16 : 24}
            >
              {children}
            </Stack>
          )}
          childItem={({ value, index, isDragged, props }) => (
            <Stack
              gap={24}
              {...(editing && props)}
              sx={{
                position: 'relative',
                backgroundColor: 'var(--ps-neutral2)',
                padding: isMd ? '24px 16px' : '32px 40px',
                borderRadius: '12px',
                maxWidth: 924,
                width: '100%',
                listStyle: 'none'
              }}
            >
              <Stack
                direction={'row'}
                alignItems={'flex-start'}
                justifyContent={'space-between'}
                sx={{
                  position: 'relative',
                  width: '100%',
                  listStyle: 'none'
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: isMd ? 15 : 20,
                    color: 'var(--pss-text-100)',
                    fontWeight: 500,
                    lineHeight: isMd ? '19.5px' : '26px',
                    marginRight: 20,
                    wordBreak: 'break-word'
                  }}
                >
                  {value.type === IBoxAboutSectionTypeName.SIMPLE
                    ? value.value.title.toUpperCase()
                    : value.type === IBoxAboutSectionTypeName.TOKENOMIC
                      ? 'TOKENOMICS'
                      : value.type}
                </Typography>
                {editing && (
                  <Box
                    mt={isMd ? 2 : 5}
                    sx={{
                      '& svg': {
                        transform: isMd ? 'scale(.8)' : 'scale(1)',
                        cursor: 'pointer',
                        '& path': {
                          fill: theme => theme.palette.text.primary
                        }
                      }
                    }}
                  >
                    <PenIcon
                      onClick={() => {
                        if (draftInfo?.listingStatus) return
                        if (index !== undefined) {
                          handleEdit(value, index)
                        }
                      }}
                    />
                  </Box>
                )}
              </Stack>
              {emptyBox(value)}
              {editing && draggableItems.length > 1 && (
                <StyledPenDragIcon tabIndex={-1} data-movable-handle isDragged={isDragged} />
              )}
              {editing && !isMd && draggableItems.length > 1 && (
                <StyledDeleteSvg
                  onClick={(event: React.MouseEvent<HTMLElement>) => {
                    if (draftInfo?.listingStatus) return
                    if (index !== undefined) {
                      setIndexNum(index)
                      handleDelete(event, index)
                    }
                  }}
                />
              )}
              <Popper placement="right" id={id} open={open} anchorEl={anchorEl}>
                <ClickAwayListener
                  onClickAway={() => {
                    setAnchorEl(null)
                  }}
                >
                  <Stack
                    flexDirection={'column'}
                    alignItems={'center'}
                    sx={{ margin: '0 10px', p: 20, bgcolor: 'var(--ps-text-primary)', borderRadius: 12 }}
                  >
                    <Typography variant="body2">Please confirm whether to delete!</Typography>
                    <Stack
                      gap={16}
                      flexDirection={'row'}
                      justifyContent={isMd ? 'center' : 'flex-end'}
                      sx={{
                        '& button': {
                          marginTop: isMd ? 16 : 20,
                          width: 70,
                          height: isMd ? 36 : 20,
                          fontSize: isMd ? 12 : 13,
                          fontWeight: 500
                        }
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setAnchorEl(null)
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          if (indexNum !== undefined) {
                            const arr = [...draggableItems]
                            arr.splice(indexNum, 1)
                            setAnchorEl(null)
                            updateSort(arr)
                          }
                        }}
                      >
                        Confirm
                      </Button>
                    </Stack>
                  </Stack>
                </ClickAwayListener>
              </Popper>
            </Stack>
          )}
        />
      </Stack>
    </Stack>
  )
}
export default Page
