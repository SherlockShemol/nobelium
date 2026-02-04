# TypeScript 迁移清单

本文档详细列出了将 Nobelium 项目从 JavaScript 迁移到 TypeScript 的完整步骤。请按照清单顺序执行，每完成一步请检查项目是否仍然可以正常运行。

## 目录

1. [阶段 0: 准备工作](#阶段-0-准备工作)
2. [阶段 1: 基础设施配置](#阶段-1-基础设施配置)
3. [阶段 2: 核心类型定义](#阶段-2-核心类型定义)
4. [阶段 3: 工具库迁移](#阶段-3-工具库迁移)
5. [阶段 4: 组件迁移](#阶段-4-组件迁移)
6. [阶段 5: 页面迁移](#阶段-5-页面迁移)
7. [阶段 6: 严格模式和清理](#阶段-6-严格模式和清理)
8. [回滚策略](#回滚策略)

---

## 阶段 0: 准备工作

### 0.1 创建备份分支

```bash
git checkout -b backup/pre-typescript-migration
git push origin backup/pre-typescript-migration
git checkout main
git checkout -b feature/typescript-migration
```

### 0.2 确保当前项目可正常运行

- [ ] 运行 `pnpm dev` 确认开发环境正常
- [ ] 运行 `pnpm build` 确认构建成功
- [ ] 运行 `pnpm lint` 确认无严重 lint 错误

---

## 阶段 1: 基础设施配置

### 1.1 安装 TypeScript 相关依赖

```bash
pnpm add -D typescript @types/react @types/react-dom @types/node
pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

**检查点**: 依赖安装成功，无报错

### 1.2 创建 tsconfig.json

创建文件 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/data/*": ["data/*"],
      "@/layouts/*": ["layouts/*"],
      "@/lib/*": ["lib/*"],
      "@/styles/*": ["styles/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.js",
    "**/*.jsx"
  ],
  "exclude": ["node_modules"]
}
```

### 1.3 创建 next-env.d.ts

创建文件 `next-env.d.ts`:

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

### 1.4 更新 .eslintrc.json

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "warn"
  },
  "overrides": [
    {
      "files": ["*.js", "*.jsx"],
      "rules": {
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
}
```

### 1.5 删除 jsconfig.json

迁移完成后删除，因为 tsconfig.json 已包含相同配置。

**检查点**: 
- [ ] 运行 `pnpm dev` 仍然正常
- [ ] 运行 `pnpm build` 仍然正常

---

## 阶段 2: 核心类型定义

### 2.1 创建类型目录结构

```bash
mkdir -p types
```

### 2.2 创建核心类型文件

创建 `types/index.ts`:

```typescript
// 重新导出所有类型
export * from './blog-config'
export * from './post'
export * from './locale'
export * from './notion'
```

### 2.3 创建 BlogConfig 类型

创建 `types/blog-config.ts`:

```typescript
export interface SEOConfig {
  keywords?: string[]
  googleSiteVerification?: string
}

export interface AckeeConfig {
  tracker: string
  dataAckeeServer: string
  domainId: string
}

export interface GAConfig {
  measurementId: string
}

export interface AnalyticsConfig {
  provider: '' | 'ga' | 'ackee'
  ackeeConfig: AckeeConfig
  gaConfig: GAConfig
}

export interface GitalkConfig {
  repo: string
  owner: string
  admin: string[]
  clientID: string
  clientSecret: string
  distractionFreeMode: boolean
}

export interface UtterancesConfig {
  repo: string
}

export interface CusdisConfig {
  appId: string
  host: string
  scriptSrc: string
}

export interface CommentConfig {
  provider: '' | 'gitalk' | 'utterances' | 'cusdis'
  gitalkConfig: GitalkConfig
  utterancesConfig: UtterancesConfig
  cusdisConfig: CusdisConfig
}

export type SupportedLang = 'en-US' | 'zh-CN' | 'zh-HK' | 'zh-TW' | 'ja-JP' | 'es-ES'
export type Appearance = 'light' | 'dark' | 'auto'
export type FontStyle = 'sans-serif' | 'serif'

export interface BlogConfig {
  title: string
  author: string
  email: string
  link: string
  description: string
  lang: SupportedLang
  timezone: string
  appearance: Appearance
  font: FontStyle
  lightBackground: string
  darkBackground: string
  path: string
  since: number
  postsPerPage: number
  sortByDate: boolean
  showAbout: boolean
  showArchive: boolean
  autoCollapsedNavBar: boolean
  ogImageGenerateURL: string
  socialLink: string
  seo: SEOConfig
  notionPageId: string | undefined
  notionAccessToken: string | undefined
  analytics: AnalyticsConfig
  comment: CommentConfig
  isProd: boolean
}
```

### 2.4 创建 Post 类型

创建 `types/post.ts`:

```typescript
export interface PostDate {
  start_date?: string
}

export interface PostAuthor {
  id: string
  first_name?: string
  last_name?: string
  profile_photo?: string
}

export interface Post {
  id: string
  title: string
  slug: string
  summary?: string
  date: number // Unix timestamp
  type: string[]
  status?: string[]
  tags?: string[]
  lang?: string[]
  fullWidth?: boolean
  author?: PostAuthor[]
}

export interface PostWithBlocks extends Post {
  blockMap: ExtendedRecordMap
}

// Re-export from notion-types for convenience
import type { ExtendedRecordMap } from 'notion-types'
export type { ExtendedRecordMap }
```

### 2.5 创建 Locale 类型

创建 `types/locale.ts`:

```typescript
export interface NavLocale {
  INDEX: string
  ABOUT: string
  FRIENDS: string
  RSS: string
  SEARCH: string
  RESUME: string
}

export interface PostLocale {
  BACK: string
  TOP: string
}

export interface PaginationLocale {
  PREV: string
  NEXT: string
}

export interface Locale {
  NAV: NavLocale
  POST: PostLocale
  PAGINATION: PaginationLocale
  [key: string]: unknown
}

export interface LocaleContextValue {
  locale: Locale
  lang: string
  switchLang: (lang: string) => Promise<void>
}
```

### 2.6 创建 Notion 扩展类型

创建 `types/notion.ts`:

```typescript
import type { ExtendedRecordMap, Block, Collection } from 'notion-types'

export type { ExtendedRecordMap, Block, Collection }

// Notion API response types
export interface NotionPageResponse {
  block: Record<string, { value: Block }>
  collection: Record<string, { value: Collection }>
  collection_query: CollectionQuery
}

export interface CollectionQuery {
  [collectionId: string]: {
    [viewId: string]: {
      blockIds?: string[]
      collection_group_results?: {
        blockIds?: string[]
      }
    }
  }
}

// Schema types
export interface NotionPropertySchema {
  name: string
  type: 'title' | 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'person' | 'file' | 'checkbox' | 'url' | 'email' | 'phone_number' | 'formula' | 'relation' | 'rollup' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by'
}

export type NotionSchema = Record<string, NotionPropertySchema>

// Block map type for individual posts
export type BlockMap = ExtendedRecordMap
```

### 2.7 创建第三方库类型声明

创建 `types/third-party.d.ts`:

```typescript
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

// assets/i18n
declare module '@/assets/i18n' {
  import type { Locale } from '@/types/locale'
  export default function loadLocale(section: string, lang: string): Promise<Locale>
}
```

**检查点**:
- [ ] 类型文件创建完成，无语法错误
- [ ] `pnpm dev` 仍然正常

---

## 阶段 3: 工具库迁移

### 迁移顺序

按照依赖关系，从底层到上层迁移：

```
Level 0 (无依赖):
├── consts.js → consts.ts
├── lib/cjk.js → lib/cjk.ts
├── lib/cusdisLang.js → lib/cusdisLang.ts
├── lib/gtag.js → lib/gtag.ts
└── lib/blockMap.js → lib/blockMap.ts

Level 1 (仅依赖外部库):
├── lib/dayjs.js → lib/dayjs.ts
├── lib/fonts.js → lib/fonts.ts
└── lib/server/notion-api.js → lib/server/notion-api.ts

Level 2 (依赖 Level 0-1):
├── lib/config.js → lib/config.ts
├── lib/theme.js → lib/theme.ts
├── lib/locale.js → lib/locale.ts
└── lib/server/config.js → lib/server/config.ts

Level 3 (依赖 Level 0-2):
├── lib/notion/getAllPageIds.js → lib/notion/getAllPageIds.ts
├── lib/notion/getPageProperties.js → lib/notion/getPageProperties.ts
├── lib/notion/filterPublishedPosts.js → lib/notion/filterPublishedPosts.ts
├── lib/notion/getAllTagsFromPosts.js → lib/notion/getAllTagsFromPosts.ts
├── lib/notion/getMetadata.js → lib/notion/getMetadata.ts
├── lib/notion/getPostBlocks.js → lib/notion/getPostBlocks.ts
└── lib/local/index.js → lib/local/index.ts

Level 4 (依赖 Level 0-3):
├── lib/notion/getAllPosts.js → lib/notion/getAllPosts.ts
├── lib/notion.js → lib/notion.ts
├── lib/mock/index.js → lib/mock/index.ts
└── lib/useFilteredPosts.js → lib/useFilteredPosts.ts
```

### 3.1 Level 0 文件迁移

#### 3.1.1 consts.js → consts.ts

```typescript
export const FONTS_SANS: string[] = [
  'var(--font-oppo-sans)',
  '"OPPO Sans"',
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Noto Sans"',
  '"Helvetica Neue"',
  'Helvetica',
  'Arial',
  'sans-serif'
]

export const FONTS_SERIF: string[] = [
  'var(--font-oppo-sans)',
  '"OPPO Sans"',
  'ui-serif',
  'Georgia',
  '"Noto Serif CJK SC"',
  '"Songti SC"',
  'SimSun',
  'serif'
]
```

- [ ] 重命名 `consts.js` → `consts.ts`
- [ ] 更新代码
- [ ] 验证 `pnpm dev`

#### 3.1.2 lib/cjk.js → lib/cjk.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

#### 3.1.3 lib/cusdisLang.js → lib/cusdisLang.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

#### 3.1.4 lib/gtag.js → lib/gtag.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

#### 3.1.5 lib/blockMap.js → lib/blockMap.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

### 3.2 Level 1 文件迁移

#### 3.2.1 lib/dayjs.js → lib/dayjs.ts

```typescript
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export function prepareDayjs(tz: string): void {
  dayjs.tz.setDefault(tz)
}

export default dayjs
```

- [ ] 重命名 `lib/dayjs.js` → `lib/dayjs.ts`
- [ ] 更新代码
- [ ] 验证 `pnpm dev`

#### 3.2.2 lib/fonts.js → lib/fonts.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

#### 3.2.3 lib/server/notion-api.js → lib/server/notion-api.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

### 3.3 Level 2 文件迁移

#### 3.3.1 lib/config.js → lib/config.ts

```typescript
import { createContext, useContext, ReactNode } from 'react'
import type { BlogConfig } from '@/types'

const ConfigContext = createContext<BlogConfig | undefined>(undefined)

interface ConfigProviderProps {
  value: BlogConfig
  children: ReactNode
}

export function ConfigProvider({ value, children }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig(): BlogConfig {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
```

- [ ] 重命名 `lib/config.js` → `lib/config.ts`
- [ ] 更新代码
- [ ] 验证 `pnpm dev`

#### 3.3.2 lib/theme.js → lib/theme.ts

```typescript
import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useMedia } from 'react-use'
import { useConfig } from '@/lib/config'

interface ThemeContextValue {
  dark: boolean | null
}

const ThemeContext = createContext<ThemeContextValue>({ dark: true })

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { appearance } = useConfig()
  const prefersDark = useMedia('(prefers-color-scheme: dark)', null)
  const dark = appearance === 'dark' || (appearance === 'auto' && prefersDark)

  useEffect(() => {
    if (typeof dark === 'boolean') {
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.classList.remove('color-scheme-unset')
    }
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
```

- [ ] 重命名 `lib/theme.js` → `lib/theme.ts`
- [ ] 更新代码
- [ ] 验证 `pnpm dev`

#### 3.3.3 lib/locale.js → lib/locale.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

#### 3.3.4 lib/server/config.js → lib/server/config.ts

```typescript
import type { BlogConfig } from '@/types'

// 动态导入 blog.config (在迁移 blog.config.ts 后使用)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
const { resolve } = require('path')

const raw = fs.readFileSync(resolve(process.cwd(), 'blog.config.js'), 'utf-8')
const config = eval(`((module = { exports }) => { ${raw}; return module.exports })()`) as BlogConfig

export const clientConfig: BlogConfig = config
export { config }
```

**注意**: 此文件需要在 blog.config.ts 迁移后进一步更新

- [ ] 重命名 `lib/server/config.js` → `lib/server/config.ts`
- [ ] 更新代码
- [ ] 验证 `pnpm dev`

### 3.4 Level 3 文件迁移

#### 3.4.1 lib/notion/getAllPageIds.js → lib/notion/getAllPageIds.ts

```typescript
import { idToUuid } from 'notion-utils'
import type { CollectionQuery } from '@/types/notion'

export default function getAllPageIds(
  collectionQuery: CollectionQuery,
  viewId?: string
): string[] {
  const views = Object.values(collectionQuery)[0]
  let pageIds: string[] = []
  
  if (viewId) {
    const vId = idToUuid(viewId)
    pageIds = views[vId]?.blockIds || []
  } else {
    const pageSet = new Set<string>()
    Object.values(views).forEach(view => {
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id))
    })
    pageIds = [...pageSet]
  }
  
  return pageIds
}
```

- [ ] 重命名并更新
- [ ] 验证 `pnpm dev`

#### 3.4.2 lib/notion/getPageProperties.js → lib/notion/getPageProperties.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

#### 3.4.3 lib/notion/filterPublishedPosts.js → lib/notion/filterPublishedPosts.ts

```typescript
import type { Post } from '@/types'

interface FilterOptions {
  posts: Post[]
  includePages: boolean
}

export default function filterPublishedPosts({ 
  posts, 
  includePages 
}: FilterOptions): Post[] {
  if (!posts || !posts.length) return []
  
  return posts
    .filter(post =>
      includePages
        ? post?.type?.[0] === 'Post' || post?.type?.[0] === 'Page'
        : post?.type?.[0] === 'Post'
    )
    .filter(post =>
      post.title &&
      post.slug &&
      post?.status?.[0] === 'Published' &&
      post.date <= Date.now()
    )
}
```

- [ ] 重命名并更新
- [ ] 验证 `pnpm dev`

#### 3.4.4 其他 Level 3 文件

- [ ] lib/notion/getAllTagsFromPosts.ts
- [ ] lib/notion/getMetadata.ts
- [ ] lib/notion/getPostBlocks.ts
- [ ] lib/local/index.ts

### 3.5 Level 4 文件迁移

- [ ] lib/notion/getAllPosts.ts
- [ ] lib/notion.ts
- [ ] lib/mock/index.ts
- [ ] lib/useFilteredPosts.ts

### 3.6 blog.config.js → blog.config.ts

```typescript
import type { BlogConfig } from '@/types'

const BLOG: BlogConfig = {
  title: "Shemol's Blog",
  author: 'Shemol',
  email: 'shemol106@gmail.com',
  link: 'https://shemol.tech',
  description: 'Sneak through holes and climb over fences.',
  lang: 'en-US',
  timezone: 'Asia/Shanghai',
  appearance: 'auto',
  font: 'serif',
  lightBackground: '#ffffff',
  darkBackground: '#18181B',
  path: '',
  since: 2022,
  postsPerPage: 7,
  sortByDate: false,
  showAbout: true,
  showArchive: true,
  autoCollapsedNavBar: false,
  ogImageGenerateURL: 'https://og-image-craigary.vercel.app',
  socialLink: 'https://vnil.de/users/Shemol',
  seo: {
    keywords: ['Blog', 'Website', 'Notion'],
    googleSiteVerification: ''
  },
  notionPageId: process.env.NOTION_PAGE_ID,
  notionAccessToken: process.env.NOTION_ACCESS_TOKEN,
  analytics: {
    provider: '',
    ackeeConfig: {
      tracker: '',
      dataAckeeServer: '',
      domainId: ''
    },
    gaConfig: {
      measurementId: ''
    }
  },
  comment: {
    provider: '',
    gitalkConfig: {
      repo: '',
      owner: '',
      admin: [],
      clientID: '',
      clientSecret: '',
      distractionFreeMode: false
    },
    utterancesConfig: {
      repo: ''
    },
    cusdisConfig: {
      appId: '',
      host: 'https://cusdis.com',
      scriptSrc: 'https://cusdis.com/js/cusdis.es.js'
    }
  },
  isProd: process.env.VERCEL_ENV === 'production'
}

export default BLOG
```

- [ ] 重命名 `blog.config.js` → `blog.config.ts`
- [ ] 更新 lib/server/config.ts 使用直接导入
- [ ] 验证 `pnpm dev`

### 3.7 assets/i18n/index.js → assets/i18n/index.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

### 3.8 layouts/search.js → layouts/search.ts

- [ ] 重命名并添加类型
- [ ] 验证 `pnpm dev`

**阶段 3 检查点**:
- [ ] 所有 lib/ 文件迁移完成
- [ ] `pnpm dev` 正常运行
- [ ] `pnpm build` 成功

---

## 阶段 4: 组件迁移

### 迁移顺序

```
Level 0 (无内部组件依赖):
├── components/Ackee.js → components/Ackee.tsx
├── components/Gtag.js → components/Gtag.tsx
├── components/Vercel.js → components/Vercel.tsx
├── components/Utterances.js → components/Utterances.tsx
├── components/FormattedDate.js → components/FormattedDate.tsx
├── components/TagItem.js → components/TagItem.tsx
├── components/Tags.js → components/Tags.tsx
├── components/Pagination.js → components/Pagination.tsx
├── components/BlogPost.js → components/BlogPost.tsx
├── components/LanguageSwitcher.js → components/LanguageSwitcher.tsx
├── components/TableOfContents.js → components/TableOfContents.tsx
├── components/PdfViewer.js → components/PdfViewer.tsx
├── components/Scripts.js → components/Scripts.tsx
└── components/notion-blocks/
    ├── Mermaid.js → Mermaid.tsx
    └── Toggle.js → Toggle.tsx

Level 1 (依赖 Level 0):
├── components/NotionRenderer.js → components/NotionRenderer.tsx
├── components/Comments.js → components/Comments.tsx
├── components/Footer.js → components/Footer.tsx
└── components/Header.js → components/Header.tsx

Level 2 (依赖 Level 0-1):
├── components/Post.js → components/Post.tsx
└── components/Container.js → components/Container.tsx
```

### 4.1 Level 0 组件迁移

#### 4.1.1 components/FormattedDate.tsx

```tsx
import { useConfig } from '@/lib/config'
import dayjs from '@/lib/dayjs'

interface FormattedDateProps {
  date: number | string | Date
}

export default function FormattedDate({ date }: FormattedDateProps) {
  const BLOG = useConfig()
  // ... 其余实现
}
```

逐个迁移以下组件：

- [ ] components/Ackee.tsx
- [ ] components/Gtag.tsx
- [ ] components/Vercel.tsx
- [ ] components/Utterances.tsx
- [ ] components/FormattedDate.tsx
- [ ] components/TagItem.tsx
- [ ] components/Tags.tsx
- [ ] components/Pagination.tsx
- [ ] components/BlogPost.tsx
- [ ] components/LanguageSwitcher.tsx
- [ ] components/TableOfContents.tsx
- [ ] components/PdfViewer.tsx
- [ ] components/Scripts.tsx
- [ ] components/notion-blocks/Mermaid.tsx
- [ ] components/notion-blocks/Toggle.tsx

### 4.2 Level 1 组件迁移

- [ ] components/NotionRenderer.tsx
- [ ] components/Comments.tsx
- [ ] components/Footer.tsx
- [ ] components/Header.tsx

### 4.3 Level 2 组件迁移

#### 4.3.1 components/Post.tsx

```tsx
import Image from 'next/image'
import cn from 'classnames'
import { useConfig } from '@/lib/config'
import useTheme from '@/lib/theme'
import FormattedDate from '@/components/FormattedDate'
import TagItem from '@/components/TagItem'
import NotionRenderer from '@/components/NotionRenderer'
import TableOfContents from '@/components/TableOfContents'
import type { Post as PostType, ExtendedRecordMap } from '@/types'

interface PostProps {
  post: PostType
  blockMap: ExtendedRecordMap
  emailHash: string
  fullWidth?: boolean
}

export default function Post({ post, blockMap, emailHash, fullWidth = false }: PostProps) {
  const BLOG = useConfig()
  const { dark } = useTheme()
  // ... 其余实现
}
```

- [ ] components/Post.tsx
- [ ] components/Container.tsx

**阶段 4 检查点**:
- [ ] 所有组件迁移完成
- [ ] 移除所有 PropTypes 导入
- [ ] `pnpm dev` 正常运行
- [ ] `pnpm build` 成功

---

## 阶段 5: 页面迁移

### 迁移顺序

```
├── pages/404.js → pages/404.tsx
├── pages/_document.js → pages/_document.tsx
├── pages/_app.js → pages/_app.tsx
├── pages/api/config.js → pages/api/config.ts
├── pages/feed.js → pages/feed.tsx
├── pages/index.js → pages/index.tsx
├── pages/search.js → pages/search.tsx
├── pages/resume.js → pages/resume.tsx
├── pages/[slug].js → pages/[slug].tsx
├── pages/page/[page].js → pages/page/[page].tsx
└── pages/tag/[tag].js → pages/tag/[tag].tsx
```

### 5.1 简单页面

- [ ] pages/404.tsx
- [ ] pages/api/config.ts

### 5.2 核心页面

#### 5.2.1 pages/_document.tsx

```tsx
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

- [ ] pages/_document.tsx

#### 5.2.2 pages/_app.tsx

```tsx
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { ConfigProvider } from '@/lib/config'
import { LocaleProvider, getClientLang } from '@/lib/locale'
import { ThemeProvider } from '@/lib/theme'
import type { BlogConfig, Locale } from '@/types'
// ... 其余导入

export default function MyApp({ Component, pageProps }: AppProps) {
  // ... 实现
}
```

- [ ] pages/_app.tsx

### 5.3 数据获取页面

#### 5.3.1 pages/index.tsx

```tsx
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import type { Post } from '@/types'

interface HomeProps {
  posts: Post[]
  page: number
  totalPages: number
}

export default function Home({ 
  posts, 
  page, 
  totalPages 
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // ... 实现
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // ... 实现
}
```

逐个迁移：

- [ ] pages/index.tsx
- [ ] pages/search.tsx
- [ ] pages/resume.tsx
- [ ] pages/feed.tsx

### 5.4 动态路由页面

#### 5.4.1 pages/[slug].tsx

```tsx
import type { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import type { Post, ExtendedRecordMap } from '@/types'

interface BlogPostProps {
  posts: Post[]
  blockMaps: Record<string, ExtendedRecordMap>
  emailHash: string
}

export default function BlogPost({ 
  posts, 
  blockMaps, 
  emailHash 
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // ... 实现
}

export const getStaticPaths: GetStaticPaths = async () => {
  // ... 实现
}

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  // ... 实现
}
```

- [ ] pages/[slug].tsx
- [ ] pages/page/[page].tsx
- [ ] pages/tag/[tag].tsx

**阶段 5 检查点**:
- [ ] 所有页面迁移完成
- [ ] `pnpm dev` 正常运行
- [ ] `pnpm build` 成功
- [ ] 所有页面功能正常

---

## 阶段 6: 严格模式和清理

### 6.1 启用严格模式

更新 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    // ... 其他选项
  }
}
```

- [ ] 启用 strict: true
- [ ] 修复所有类型错误

### 6.2 移除不再需要的依赖

```bash
pnpm remove prop-types
```

- [ ] 移除 prop-types
- [ ] 确认无其他未使用依赖

### 6.3 删除旧文件

- [ ] 删除 jsconfig.json

### 6.4 脚本文件 (可选迁移)

这些脚本文件可以保持为 .js，因为它们由 Node.js 直接运行：

- scripts/sync-notion.js
- scripts/generate-rss.js

如果需要迁移，需要配置 ts-node 或使用 tsx 运行器。

### 6.5 配置文件 (保持 .js)

以下配置文件通常保持为 .js：

- next.config.js
- tailwind.config.js
- postcss.config.js
- next-sitemap.config.js

### 6.6 最终检查

- [ ] 运行 `pnpm lint` 无错误
- [ ] 运行 `pnpm build` 成功
- [ ] 运行 `pnpm dev` 所有功能正常
- [ ] 检查所有页面渲染正常
- [ ] 检查评论功能正常
- [ ] 检查语言切换正常
- [ ] 检查主题切换正常

---

## 回滚策略

### 如果迁移过程中出现严重问题

1. **单文件回滚**：
   ```bash
   git checkout HEAD -- path/to/file.js
   # 删除对应的 .ts/.tsx 文件
   ```

2. **阶段回滚**：
   ```bash
   # 查看提交历史
   git log --oneline
   # 回滚到某个阶段完成的提交
   git reset --hard <commit-hash>
   ```

3. **完全回滚**：
   ```bash
   git checkout backup/pre-typescript-migration
   ```

### 每个阶段完成后

建议在每个阶段完成后创建一个提交：

```bash
git add .
git commit -m "chore: TypeScript migration - Phase X completed"
```

---

## 文件迁移总览

### 需要从 .js 重命名为 .ts/.tsx 的文件 (共 44 个)

| 文件路径 | 迁移难度 | 优先级 |
|---------|---------|-------|
| **类型定义 (新建)** | | |
| types/index.ts | 低 | P0 |
| types/blog-config.ts | 中 | P0 |
| types/post.ts | 中 | P0 |
| types/locale.ts | 低 | P0 |
| types/notion.ts | 中 | P0 |
| types/third-party.d.ts | 中 | P0 |
| **工具库 (20 个)** | | |
| consts.ts | 低 | P1 |
| lib/cjk.ts | 低 | P1 |
| lib/cusdisLang.ts | 低 | P1 |
| lib/gtag.ts | 低 | P1 |
| lib/blockMap.ts | 低 | P1 |
| lib/dayjs.ts | 低 | P1 |
| lib/fonts.ts | 低 | P1 |
| lib/server/notion-api.ts | 中 | P1 |
| lib/config.ts | 中 | P1 |
| lib/theme.ts | 中 | P1 |
| lib/locale.ts | 中 | P1 |
| lib/server/config.ts | 高 | P1 |
| lib/notion/getAllPageIds.ts | 中 | P1 |
| lib/notion/getPageProperties.ts | 高 | P1 |
| lib/notion/filterPublishedPosts.ts | 中 | P1 |
| lib/notion/getAllTagsFromPosts.ts | 低 | P1 |
| lib/notion/getMetadata.ts | 中 | P1 |
| lib/notion/getPostBlocks.ts | 中 | P1 |
| lib/local/index.ts | 中 | P1 |
| lib/notion/getAllPosts.ts | 高 | P1 |
| lib/notion.ts | 低 | P1 |
| lib/mock/index.ts | 低 | P1 |
| lib/useFilteredPosts.ts | 中 | P1 |
| blog.config.ts | 中 | P1 |
| assets/i18n/index.ts | 中 | P1 |
| layouts/search.ts | 低 | P1 |
| **组件 (17 个)** | | |
| components/Ackee.tsx | 低 | P2 |
| components/Gtag.tsx | 低 | P2 |
| components/Vercel.tsx | 低 | P2 |
| components/Utterances.tsx | 低 | P2 |
| components/FormattedDate.tsx | 低 | P2 |
| components/TagItem.tsx | 低 | P2 |
| components/Tags.tsx | 低 | P2 |
| components/Pagination.tsx | 低 | P2 |
| components/BlogPost.tsx | 中 | P2 |
| components/LanguageSwitcher.tsx | 中 | P2 |
| components/TableOfContents.tsx | 中 | P2 |
| components/PdfViewer.tsx | 中 | P2 |
| components/Scripts.tsx | 低 | P2 |
| components/notion-blocks/Mermaid.tsx | 中 | P2 |
| components/notion-blocks/Toggle.tsx | 低 | P2 |
| components/NotionRenderer.tsx | 高 | P2 |
| components/Comments.tsx | 中 | P2 |
| components/Footer.tsx | 低 | P2 |
| components/Header.tsx | 高 | P2 |
| components/Post.tsx | 中 | P2 |
| components/Container.tsx | 中 | P2 |
| **页面 (11 个)** | | |
| pages/404.tsx | 低 | P3 |
| pages/api/config.ts | 低 | P3 |
| pages/_document.tsx | 低 | P3 |
| pages/_app.tsx | 高 | P3 |
| pages/index.tsx | 中 | P3 |
| pages/search.tsx | 中 | P3 |
| pages/resume.tsx | 低 | P3 |
| pages/feed.tsx | 中 | P3 |
| pages/[slug].tsx | 高 | P3 |
| pages/page/[page].tsx | 中 | P3 |
| pages/tag/[tag].tsx | 中 | P3 |

### 保持 .js 的文件 (共 6 个)

| 文件路径 | 原因 |
|---------|------|
| next.config.js | Next.js 配置文件 |
| tailwind.config.js | Tailwind 配置文件 |
| postcss.config.js | PostCSS 配置文件 |
| next-sitemap.config.js | Sitemap 配置文件 |
| scripts/sync-notion.js | Node.js 脚本 |
| scripts/generate-rss.js | Node.js 脚本 |

---

## 常见问题解决

### Q: 遇到 "Cannot find module" 错误

确保：
1. 路径别名在 tsconfig.json 中正确配置
2. 导入语句使用正确的扩展名（或省略扩展名）

### Q: 类型 'X' 不能分配给类型 'Y'

检查：
1. 类型定义是否正确
2. 是否需要使用类型断言 `as`
3. 是否需要添加可选属性 `?`

### Q: 'props' 隐式具有 'any' 类型

为组件添加 Props 接口：

```tsx
interface MyComponentProps {
  title: string
  count?: number
}

function MyComponent({ title, count = 0 }: MyComponentProps) {
  // ...
}
```

### Q: 第三方库没有类型定义

1. 检查是否有 `@types/xxx` 包
2. 在 `types/third-party.d.ts` 中添加声明

---

## 进度追踪

| 阶段 | 状态 | 完成日期 |
|-----|------|---------|
| 阶段 0: 准备工作 | ⬜ 未开始 | |
| 阶段 1: 基础设施 | ⬜ 未开始 | |
| 阶段 2: 类型定义 | ⬜ 未开始 | |
| 阶段 3: 工具库迁移 | ⬜ 未开始 | |
| 阶段 4: 组件迁移 | ⬜ 未开始 | |
| 阶段 5: 页面迁移 | ⬜ 未开始 | |
| 阶段 6: 严格模式 | ⬜ 未开始 | |

---

**最后更新**: 2026-02-04
