import { Stack } from '@mui/material'
import { ReactNode } from 'react'
import { List, RenderItemParams, RenderListParams, arrayMove } from 'react-movable'

export interface ComponentProps {
  itemList: any[]
  setItemList: (items: any[]) => void
  childItem: (params: RenderItemParams<any>) => ReactNode
  parentItem: (params: RenderListParams) => ReactNode
}

export default function Page({ itemList, setItemList, childItem, parentItem }: ComponentProps) {
  return (
    <Stack>
      <List
        values={itemList}
        onChange={({ oldIndex, newIndex }) => setItemList(arrayMove(itemList, oldIndex, newIndex))}
        renderList={parentItem}
        renderItem={childItem}
      />
    </Stack>
  )
}
