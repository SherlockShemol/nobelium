import api from '@/lib/server/notion-api'
import { getMockBlockMap } from '@/lib/mock'

export async function getPostBlocks (id) {
  // Use mock data when NOTION_PAGE_ID is not configured
  if (!process.env.NOTION_PAGE_ID) {
    return getMockBlockMap(id)
  }

  const pageBlock = await api.getPage(id)
  return pageBlock
}
