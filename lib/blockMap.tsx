import { createContext, useContext, ReactNode } from 'react'
import type { ExtendedRecordMap, Block } from '@/types'

interface BlockValue {
  value: Block & {
    type: string
    parent_id: string
  }
}

interface BlockMapContextValue extends ExtendedRecordMap {
  pageId?: string
}

interface BlockMapProviderProps {
  blockMap: ExtendedRecordMap
  children: ReactNode
}

const BlockMapContext = createContext<BlockMapContextValue>({} as BlockMapContextValue)

export function BlockMapProvider({ blockMap, children }: BlockMapProviderProps) {
  const collectionId = Object.keys(blockMap.collection)[0]
  const blockValues = Object.values(blockMap.block) as BlockValue[]
  const pageBlock = blockValues.find(
    block => block.value.type === 'page' && block.value.parent_id === collectionId
  )
  const pageId = pageBlock?.value.id

  const blockMapAltered: BlockMapContextValue = {
    ...blockMap,
    pageId,
  }

  return (
    <BlockMapContext.Provider value={blockMapAltered}>
      {children}
    </BlockMapContext.Provider>
  )
}

export default function useBlockMap(): BlockMapContextValue {
  return useContext(BlockMapContext)
}
