/**
 * Mock module stub for production builds
 * 
 * This file exists to satisfy webpack's module resolution during build.
 * In production (when NOTION_PAGE_ID is set), these functions are never called.
 * For local development with actual mock data, this file is replaced by gitignored version.
 */

import type { Post, ExtendedRecordMap } from '@/types'

interface GetMockPostsOptions {
  includePages?: boolean
}

export function getMockPosts({ includePages: _includePages = false }: GetMockPostsOptions = {}): Post[] {
  console.warn('[Mock] getMockPosts called but mock data not available')
  return []
}

export function getMockBlockMap(_postId: string): ExtendedRecordMap {
  console.warn('[Mock] getMockBlockMap called but mock data not available')
  return {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    signed_urls: {},
    notion_user: {}
  } as ExtendedRecordMap
}
