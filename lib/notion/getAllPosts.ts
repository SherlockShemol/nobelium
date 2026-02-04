import { config as BLOG } from '@/lib/server/config'
import { idToUuid } from 'notion-utils'
import dayjs from '@/lib/dayjs'
import api from '@/lib/server/notion-api'
import getAllPageIds from './getAllPageIds'
import getPageProperties from './getPageProperties'
import filterPublishedPosts from './filterPublishedPosts'
import { getCachedPosts, hasCachedPosts } from '@/lib/local'
import type { Post, NotionSchema, CollectionQuery } from '@/types'

interface GetAllPostsOptions {
  includePages?: boolean
}

interface BlockRecord {
  value: {
    type?: string
    format?: {
      page_full_width?: boolean
    }
    created_time?: number
    properties?: Record<string, unknown>
    [key: string]: unknown
  }
}

interface CollectionRecord {
  value: {
    schema?: NotionSchema
    [key: string]: unknown
  }
}

/**
 * Get all posts from Notion
 */
export async function getAllPosts({ includePages = false }: GetAllPostsOptions = {}): Promise<Post[] | null> {
  // In development mode, prefer local cache if available
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev && hasCachedPosts()) {
    console.log('[Dev Mode] Using local cache for posts')
    try {
      const allPosts = getCachedPosts({ includePages })
      const posts = filterPublishedPosts({ posts: allPosts, includePages })
      
      // Sort by date
      if (BLOG.sortByDate) {
        posts.sort((a, b) => b.date - a.date)
      }
      return posts
    } catch (err) {
      const e = err as Error
      console.log('[Dev Mode] Failed to read cache, falling back to Notion API:', e.message)
    }
  }
  
  // Use mock data when NOTION_PAGE_ID is not configured (local development only)
  if (!process.env.NOTION_PAGE_ID) {
    console.log('[Mock Mode] Using local mock data - no NOTION_PAGE_ID configured')
    try {
      const { getMockPosts } = await import('@/lib/mock')
      return getMockPosts({ includePages })
    } catch {
      console.log('[Mock Mode] Mock module not found, returning empty posts')
      return []
    }
  }

  const id = idToUuid(process.env.NOTION_PAGE_ID)

  const response = await api.getPage(id)

  const collectionValues = Object.values(response.collection) as unknown as CollectionRecord[]
  const collection = collectionValues[0]?.value
  const collectionQuery = response.collection_query as unknown as CollectionQuery
  const block = response.block as unknown as Record<string, BlockRecord>
  const schema = collection?.schema as NotionSchema

  const rawMetadata = block[id]?.value

  // Check Type
  if (
    rawMetadata?.type !== 'collection_view_page' &&
    rawMetadata?.type !== 'collection_view'
  ) {
    console.log(`pageId "${id}" is not a database`)
    return null
  } else {
    // Construct Data
    const pageIds = getAllPageIds(collectionQuery)
    const data: Post[] = []
    for (let i = 0; i < pageIds.length; i++) {
      const pageId = pageIds[i]
      const properties = await getPageProperties(pageId, block as Parameters<typeof getPageProperties>[1], schema)
      
      if (!properties) continue

      // Add fullwidth to properties
      const fullWidth = block[pageId]?.value?.format?.page_full_width ?? false
      // Convert date (with timezone) to unix milliseconds timestamp
      const dateValue = properties.date as { start_date?: string } | undefined
      const date = (
        dateValue?.start_date
          ? dayjs.tz(dateValue.start_date)
          : dayjs(block[pageId]?.value?.created_time)
      ).valueOf()

      const post: Post = {
        id: properties.id as string,
        title: properties.title as string,
        slug: properties.slug as string,
        summary: properties.summary as string | undefined,
        date,
        type: properties.type as string[],
        status: properties.status as string[] | undefined,
        tags: properties.tags as string[] | undefined,
        lang: properties.lang as string[] | undefined,
        fullWidth
      }

      data.push(post)
    }

    // remove all the the items doesn't meet requirements
    const posts = filterPublishedPosts({ posts: data, includePages })

    // Sort by date
    if (BLOG.sortByDate) {
      posts.sort((a, b) => b.date - a.date)
    }
    return posts
  }
}
