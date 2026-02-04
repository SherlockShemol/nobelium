import { createElement as h, ReactNode, ComponentType } from 'react'
import dynamic from 'next/dynamic'
import { NotionRenderer as Renderer } from 'react-notion-x'
import { getTextContent } from 'notion-utils'
import { FONTS_SANS, FONTS_SERIF } from '@/consts'
import { useConfig } from '@/lib/config'
import Toggle from '@/components/notion-blocks/Toggle'
import type { ExtendedRecordMap } from '@/types'

interface BlockWithType {
  type: string
  id?: string
  properties?: {
    language?: Parameters<typeof getTextContent>[0]
    title?: unknown
  }
  format?: {
    block_color?: string
  }
  [key: string]: unknown
}

interface CodeBlockProps {
  block: BlockWithType
  [key: string]: unknown
}

interface TweetProps {
  id: string
}

interface ToggleBlockProps {
  block: BlockWithType
  children?: ReactNode
}

// Lazy-load some heavy components & override the renderers of some block types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<string, ComponentType<any>> = {
  /* Lazy-load */

  // Code block
  Code: dynamic(async () => {
    return function CodeSwitch(props: CodeBlockProps) {
      switch (getTextContent(props.block.properties?.language)) {
        case 'Mermaid':
          return h(
            dynamic(() => {
              return import('@/components/notion-blocks/Mermaid').then(module => module.default)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }, { ssr: false }) as ComponentType<any>,
            props
          )
        default:
          return h(
            dynamic(() => {
              return import('react-notion-x/build/third-party/code').then(async module => {
                // Core prismjs syntax - only load commonly used languages
                await Promise.all([
                  import('prismjs/components/prism-markup-templating'),
                  import('prismjs/components/prism-markup'),
                  import('prismjs/components/prism-bash'),
                  import('prismjs/components/prism-python'),
                  import('prismjs/components/prism-javascript'),
                  import('prismjs/components/prism-typescript'),
                  import('prismjs/components/prism-css'),
                  import('prismjs/components/prism-json'),
                  import('prismjs/components/prism-yaml'),
                  import('prismjs/components/prism-markdown'),
                  import('prismjs/components/prism-sql'),
                  import('prismjs/components/prism-go'),
                  import('prismjs/components/prism-rust'),
                  import('prismjs/components/prism-docker'),
                ])
                return module.Code
              })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as ComponentType<any>,
            props
          )
      }
    }
  }),
  // Database block
  Collection: dynamic(() => {
    return import('react-notion-x/build/third-party/collection').then(module => module.Collection)
  }),
  // Equation block & inline variant
  Equation: dynamic(() => {
    return import('react-notion-x/build/third-party/equation').then(module => module.Equation)
  }),
  // PDF (Embed block)
  Pdf: dynamic(() => {
    return import('react-notion-x/build/third-party/pdf').then(module => module.Pdf)
  }, { ssr: false }),
  // Tweet block
  Tweet: dynamic(() => {
    return import('react-tweet-embed').then(module => {
      const TweetEmbed = module.default
      return function Tweet({ id }: TweetProps) {
        return <TweetEmbed tweetId={id} options={{ theme: 'dark' }} />
      }
    })
  }),

  /* Overrides */

  toggle_nobelium: ({ block, children }: ToggleBlockProps) => (
    <Toggle block={block}>{children}</Toggle>
  )
}

const mapPageUrl = (id: string): string => `https://www.notion.so/${id.replace(/-/g, '')}`

interface NotionRendererProps {
  recordMap: ExtendedRecordMap
  fullPage?: boolean
  darkMode?: boolean | null
}

/**
 * Notion page renderer
 *
 * A wrapper of react-notion-x/NotionRenderer with predefined `components` and `mapPageUrl`
 */
export default function NotionRenderer(props: NotionRendererProps) {
  const config = useConfig()

  const fontMap: Record<string, string[]> = {
    'sans-serif': FONTS_SANS,
    'serif': FONTS_SERIF
  }
  const font = fontMap[config.font]

  // Mark block types to be custom rendered by appending a suffix
  if (props.recordMap) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const blockRecords = Object.values(props.recordMap.block) as any[]
    for (const record of blockRecords) {
      const block = record?.value
      if (block?.type === 'toggle') {
        block.type += '_nobelium'
      }
    }
  }

  return (
    <>
      <style jsx global>
        {`
        .notion {
          --notion-font: ${font};
        }
        `}
      </style>
      <Renderer
        components={components}
        mapPageUrl={mapPageUrl}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recordMap={props.recordMap as any}
        fullPage={props.fullPage}
        darkMode={props.darkMode ?? false}
      />
    </>
  )
}
