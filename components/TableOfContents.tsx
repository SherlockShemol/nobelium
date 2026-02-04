import { getPageTableOfContents } from 'notion-utils'
import cn from 'classnames'
import type { ExtendedRecordMap } from '@/types'
import type { CSSProperties } from 'react'

interface TableOfContentsProps {
  blockMap: ExtendedRecordMap
  className?: string
  style?: CSSProperties
}

interface BlockRecord {
  value: {
    parent_id: string
    [key: string]: unknown
  }
}

export default function TableOfContents({ blockMap, className, style }: TableOfContentsProps) {
  const collectionId = Object.keys(blockMap.collection)[0]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blockRecords = Object.values(blockMap.block) as any[]
  const pageBlock = blockRecords.find((block: BlockRecord) => block.value.parent_id === collectionId)
  
  if (!pageBlock) return null
  
  const page = pageBlock.value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes = getPageTableOfContents(page as any, blockMap as any)

  if (!nodes.length) return null

  /**
   * Scroll to target heading block
   */
  function scrollTo(id: string) {
    id = id.replaceAll('-', '')
    const target = document.querySelector(`.notion-block-${id}`)
    if (!target) return
    // `65` is the height of expanded nav
    // TODO: Remove the magic number
    const top = document.documentElement.scrollTop + target.getBoundingClientRect().top - 65
    document.documentElement.scrollTo({
      top,
      behavior: 'smooth'
    })
  }

  return (
    <aside
      className={cn(className, 'pl-4 text-sm text-zinc-700/70 dark:text-neutral-400')}
      style={style}
    >
      {nodes.map(node => (
        <div key={node.id}>
          <a
            data-target-id={node.id}
            className="block py-1 hover:text-black dark:hover:text-white cursor-pointer transition duration-100"
            style={{ paddingLeft: (node.indentLevel * 24) + 'px' }}
            onClick={() => scrollTo(node.id)}
          >
            {node.text}
          </a>
        </div>
      ))}
    </aside>
  )
}
