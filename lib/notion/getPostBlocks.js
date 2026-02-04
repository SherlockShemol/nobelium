import api from '@/lib/server/notion-api'
import { getCachedBlockMap, hasCachedBlockMap } from '@/lib/local'

export async function getPostBlocks (id) {
  // In development mode, prefer local cache if available
  const isDev = process.env.NODE_ENV === 'development'
  
  if (isDev && hasCachedBlockMap(id)) {
    console.log('[Dev Mode] Using local cache for blocks:', id)
    try {
      return getCachedBlockMap(id)
    } catch (e) {
      console.log('[Dev Mode] Failed to read block cache, falling back to Notion API:', e.message)
    }
  }
  
  // Use mock data when NOTION_PAGE_ID is not configured (local development only)
  if (!process.env.NOTION_PAGE_ID) {
    try {
      const { getMockBlockMap } = await import('@/lib/mock')
      return getMockBlockMap(id)
    } catch (e) {
      console.log('[Mock Mode] Mock module not found, returning empty block map')
      return { block: {}, collection: {}, collection_view: {}, collection_query: {}, signed_urls: {} }
    }
  }

  const pageBlock = await api.getPage(id)
  return pageBlock
}
