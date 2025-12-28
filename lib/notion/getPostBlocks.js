import api from '@/lib/server/notion-api'

export async function getPostBlocks (id) {
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
