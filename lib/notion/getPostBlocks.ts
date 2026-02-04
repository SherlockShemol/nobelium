import api from '@/lib/server/notion-api'
import { getCachedBlockMap, hasCachedBlockMap } from '@/lib/local'
import type { ExtendedRecordMap } from '@/types'

export async function getPostBlocks(id: string): Promise<ExtendedRecordMap> {
  // In development mode, prefer local cache if available
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev && hasCachedBlockMap(id)) {
    console.log('[Dev Mode] Using local cache for blocks:', id)
    try {
      return getCachedBlockMap(id)
    } catch (err) {
      const error = err as Error
      console.log('[Dev Mode] Failed to read block cache, falling back to Notion API:', error.message)
    }
  }
  
  // Use mock data when NOTION_PAGE_ID is not configured (local development only)
  if (!process.env.NOTION_PAGE_ID) {
    try {
      const { getMockBlockMap } = await import('@/lib/mock')
      return getMockBlockMap(id)
    } catch {
      console.log('[Mock Mode] Mock module not found, returning empty block map')
      return { 
        block: {}, 
        collection: {}, 
        collection_view: {}, 
        collection_query: {}, 
        signed_urls: {},
        notion_user: {}
      } as ExtendedRecordMap
    }
  }

  const pageBlock = await api.getPage(id)
  return pageBlock as unknown as ExtendedRecordMap
}
