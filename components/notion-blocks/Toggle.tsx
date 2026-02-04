import { Text } from 'react-notion-x'
import cn from 'classnames'
import { ReactNode } from 'react'

interface ToggleBlock {
  format?: {
    block_color?: string
  }
  properties?: {
    title?: unknown
  }
  [key: string]: unknown
}

interface ToggleProps {
  block: ToggleBlock
  children?: ReactNode
}

export default function Toggle({ block, children }: ToggleProps) {
  return (
    <details className={cn(
      'nobelium-block nobelium-toggle',
      { 'nobelium-toggle-empty': !children },
      block.format?.block_color && `notion-${block.format.block_color}`
    )}>
      <summary className="relative">
        <span className="nobelium-toggle-triangle">
          <svg viewBox="0 0 100 100">
            <polygon points="5.9,88.2 50,11.8 94.1,88.2" />
          </svg>
        </span>
        <span className="nobelium-toggle-title">
          {/* @ts-expect-error - react-notion-x types are complex */}
          <Text value={block.properties?.title} block={block} />
        </span>
      </summary>
      {children && (
        <div className="nobelium-toggle-content">
          {children}
        </div>
      )}
    </details>
  )
}
