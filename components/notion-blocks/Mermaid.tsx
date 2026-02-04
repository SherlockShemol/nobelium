import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import useTheme from '@/lib/theme'
import { getTextContent } from 'notion-utils'

interface MermaidBlock {
  id: string
  properties: {
    title: Parameters<typeof getTextContent>[0]
  }
  [key: string]: unknown
}

interface MermaidProps {
  block: MermaidBlock
}

export default function Mermaid({ block }: MermaidProps) {
  const { dark } = useTheme()

  useEffect(() => {
    mermaid.initialize({ theme: dark ? 'dark' : 'neutral' })
  }, [dark])

  const source = getTextContent(block.properties.title)
  const container = useRef<HTMLDivElement>(null)
  const [svg, setSVG] = useState('')

  useEffect(() => {
    if (!container.current) return
    mermaid.render(`mermaid-${block.id}`, source, container.current)
      .then(({ svg }) => setSVG(svg))
  }, [block, source])

  return (
    <div
      ref={container}
      className="w-full leading-normal flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
