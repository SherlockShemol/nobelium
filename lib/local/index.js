/**
 * Local Cache Reader
 * 
 * Reads cached Notion data from .cache directory for local development.
 */

import fs from 'fs'
import path from 'path'

const CACHE_DIR = path.join(process.cwd(), '.cache')
const POSTS_CACHE_FILE = path.join(CACHE_DIR, 'posts.json')
const BLOCKS_DIR = path.join(CACHE_DIR, 'blocks')

/**
 * Check if the local cache exists
 */
export function hasCachedPosts() {
  return fs.existsSync(POSTS_CACHE_FILE)
}

/**
 * Check if a specific block cache exists
 */
export function hasCachedBlockMap(postId) {
  const blockFile = path.join(BLOCKS_DIR, `${postId}.json`)
  return fs.existsSync(blockFile)
}

/**
 * Get all posts from local cache
 * @param {{ includePages: boolean }} options
 * @returns {Array} Array of post objects
 */
export function getCachedPosts({ includePages = false } = {}) {
  if (!hasCachedPosts()) {
    throw new Error(
      '[Local Cache] No cached posts found. Run `pnpm sync` to sync from Notion.'
    )
  }
  
  try {
    const content = fs.readFileSync(POSTS_CACHE_FILE, 'utf-8')
    const posts = JSON.parse(content)
    
    console.log('[Local Cache] Loaded', posts.length, 'posts from cache')
    
    return posts
  } catch (error) {
    throw new Error(`[Local Cache] Failed to read posts cache: ${error.message}`)
  }
}

/**
 * Get block map for a specific post from local cache
 * @param {string} postId - The post ID (not slug)
 * @returns {Object} Block map object
 */
export function getCachedBlockMap(postId) {
  const blockFile = path.join(BLOCKS_DIR, `${postId}.json`)
  
  if (!fs.existsSync(blockFile)) {
    throw new Error(
      `[Local Cache] No cached blocks for post ${postId}. Run \`pnpm sync --force\` to sync all blocks.`
    )
  }
  
  try {
    const content = fs.readFileSync(blockFile, 'utf-8')
    const blockMap = JSON.parse(content)
    
    return blockMap
  } catch (error) {
    throw new Error(`[Local Cache] Failed to read block cache for ${postId}: ${error.message}`)
  }
}

/**
 * Get cache status for debugging
 */
export function getCacheStatus() {
  const status = {
    postsExists: hasCachedPosts(),
    postsCount: 0,
    blocksCount: 0,
    lastModified: null
  }
  
  if (status.postsExists) {
    try {
      const content = fs.readFileSync(POSTS_CACHE_FILE, 'utf-8')
      const posts = JSON.parse(content)
      status.postsCount = posts.length
      
      const stats = fs.statSync(POSTS_CACHE_FILE)
      status.lastModified = stats.mtime
    } catch (e) {
      // Ignore errors
    }
  }
  
  if (fs.existsSync(BLOCKS_DIR)) {
    try {
      const files = fs.readdirSync(BLOCKS_DIR)
      status.blocksCount = files.filter(f => f.endsWith('.json')).length
    } catch (e) {
      // Ignore errors
    }
  }
  
  return status
}
