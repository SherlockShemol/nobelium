// Webpack require.context
interface RequireContext {
  (id: string): Promise<unknown>
  keys(): string[]
  resolve(id: string): string
  id: string
}

interface NodeRequire {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp,
    mode?: 'sync' | 'lazy' | 'lazy-once' | 'eager' | 'weak'
  ): RequireContext
}

// react-cusdis
declare module 'react-cusdis' {
  import { ComponentType } from 'react'
  
  interface ReactCusdisProps {
    attrs: {
      host: string
      appId: string
      pageId: string
      pageTitle: string
      pageUrl: string
      theme?: string
    }
    lang?: string
  }
  
  export const ReactCusdis: ComponentType<ReactCusdisProps>
}

// use-ackee
declare module 'use-ackee' {
  export default function useAckee(
    pathname: string,
    environment: {
      server: string
      domainId: string
    },
    options?: {
      detailed?: boolean
      ignoreLocalhost?: boolean
      ignoreOwnVisits?: boolean
    }
  ): void
}

// gitalk
declare module 'gitalk/dist/gitalk-component' {
  import { ComponentType } from 'react'
  
  interface GitalkProps {
    options: {
      id: string
      title: string
      clientID: string
      clientSecret: string
      repo: string
      owner: string
      admin: string[]
      distractionFreeMode?: boolean
    }
  }
  
  const GitalkComponent: ComponentType<GitalkProps>
  export default GitalkComponent
}

// react-tweet-embed
declare module 'react-tweet-embed' {
  import { ComponentType } from 'react'
  
  interface TweetEmbedProps {
    tweetId: string
    options?: {
      theme?: 'light' | 'dark'
      align?: 'left' | 'center' | 'right'
      conversation?: 'none' | 'all'
      cards?: 'hidden' | 'visible'
      width?: number
      dnt?: boolean
    }
  }
  
  const TweetEmbed: ComponentType<TweetEmbedProps>
  export default TweetEmbed
}

// Prismjs language components
declare module 'prismjs/components/prism-markup-templating'
declare module 'prismjs/components/prism-markup'
declare module 'prismjs/components/prism-bash'
declare module 'prismjs/components/prism-python'
declare module 'prismjs/components/prism-javascript'
declare module 'prismjs/components/prism-typescript'
declare module 'prismjs/components/prism-css'
declare module 'prismjs/components/prism-json'
declare module 'prismjs/components/prism-yaml'
declare module 'prismjs/components/prism-markdown'
declare module 'prismjs/components/prism-sql'
declare module 'prismjs/components/prism-go'
declare module 'prismjs/components/prism-rust'
declare module 'prismjs/components/prism-docker'
