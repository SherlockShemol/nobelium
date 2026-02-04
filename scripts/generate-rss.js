#!/usr/bin/env node
/**
 * RSS Feed Generator
 * 
 * Generates a static RSS feed (Atom format) at build time.
 * Reads cached Notion data and converts blocks to HTML for full-text feed.
 * 
 * Usage:
 *   node scripts/generate-rss.js
 */

const fs = require('fs')
const path = require('path')
const { Feed } = require('feed')

// Load blog config
const configPath = path.join(process.cwd(), 'blog.config.js')
const configRaw = fs.readFileSync(configPath, 'utf-8')
const config = eval(`((module = { exports }) => { ${configRaw}; return module.exports })()`)

// Cache paths
const CACHE_DIR = path.join(process.cwd(), '.cache')
const POSTS_CACHE_FILE = path.join(CACHE_DIR, 'posts.json')
const BLOCKS_DIR = path.join(CACHE_DIR, 'blocks')

// Output path
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'feed.xml')

/**
 * Convert Notion rich text array to plain text
 */
function richTextToPlain(richText) {
  if (!richText || !Array.isArray(richText)) return ''
  return richText.map(item => item[0] || '').join('')
}

/**
 * Convert Notion rich text array to HTML with formatting
 */
function richTextToHtml(richText) {
  if (!richText || !Array.isArray(richText)) return ''
  
  return richText.map(item => {
    let text = item[0] || ''
    const formats = item[1] || []
    
    // Escape HTML entities
    text = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    
    // Apply formatting
    for (const format of formats) {
      const type = format[0]
      switch (type) {
        case 'b': // bold
          text = `<strong>${text}</strong>`
          break
        case 'i': // italic
          text = `<em>${text}</em>`
          break
        case 's': // strikethrough
          text = `<del>${text}</del>`
          break
        case 'c': // code
          text = `<code>${text}</code>`
          break
        case 'a': // link
          const url = format[1]
          text = `<a href="${url}">${text}</a>`
          break
        case '_': // underline
          text = `<u>${text}</u>`
          break
      }
    }
    
    return text
  }).join('')
}

/**
 * Get block content (title/text property)
 */
function getBlockContent(block) {
  const props = block.properties
  if (!props) return ''
  
  // Try different property names
  if (props.title) return richTextToHtml(props.title)
  if (props.caption) return richTextToHtml(props.caption)
  
  return ''
}

/**
 * Convert a single Notion block to HTML
 */
function blockToHtml(block, blockMap) {
  const type = block.type
  const content = getBlockContent(block)
  
  switch (type) {
    case 'text':
    case 'paragraph':
      return content ? `<p>${content}</p>` : ''
    
    case 'header':
    case 'heading_1':
      return `<h1>${content}</h1>`
    
    case 'sub_header':
    case 'heading_2':
      return `<h2>${content}</h2>`
    
    case 'sub_sub_header':
    case 'heading_3':
      return `<h3>${content}</h3>`
    
    case 'bulleted_list':
    case 'bulleted_list_item':
      return `<li>${content}</li>`
    
    case 'numbered_list':
    case 'numbered_list_item':
      return `<li>${content}</li>`
    
    case 'to_do':
      const checked = block.properties?.checked?.[0]?.[0] === 'Yes'
      return `<li><input type="checkbox" ${checked ? 'checked' : ''} disabled> ${content}</li>`
    
    case 'toggle':
    case 'toggle_nobelium':
      return `<details><summary>${content}</summary></details>`
    
    case 'quote':
      return `<blockquote>${content}</blockquote>`
    
    case 'callout':
      const icon = block.format?.page_icon || ''
      return `<div class="callout">${icon} ${content}</div>`
    
    case 'code':
      const language = block.properties?.language?.[0]?.[0] || ''
      const code = richTextToPlain(block.properties?.title)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      return `<pre><code class="language-${language}">${code}</code></pre>`
    
    case 'image':
      const src = block.properties?.source?.[0]?.[0] || block.format?.display_source || ''
      const caption = richTextToPlain(block.properties?.caption)
      if (!src) return ''
      return `<figure><img src="${src}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
    
    case 'video':
      const videoSrc = block.properties?.source?.[0]?.[0] || block.format?.display_source || ''
      if (!videoSrc) return ''
      return `<p><a href="${videoSrc}">[Video]</a></p>`
    
    case 'embed':
    case 'bookmark':
      const embedUrl = block.properties?.source?.[0]?.[0] || block.format?.display_source || ''
      const embedTitle = richTextToPlain(block.properties?.title) || embedUrl
      if (!embedUrl) return ''
      return `<p><a href="${embedUrl}">${embedTitle}</a></p>`
    
    case 'divider':
      return '<hr />'
    
    case 'table_of_contents':
      return '' // Skip TOC in RSS
    
    case 'column_list':
    case 'column':
      return '' // Will be handled by children
    
    default:
      // For unknown types, try to extract content
      return content ? `<p>${content}</p>` : ''
  }
}

/**
 * Render all blocks in a page to HTML
 */
function renderBlocksToHtml(blockMap, pageId) {
  if (!blockMap || !blockMap.block) return ''
  
  const blocks = blockMap.block
  const pageBlock = blocks[pageId]?.value
  if (!pageBlock) return ''
  
  const contentIds = pageBlock.content || []
  const htmlParts = []
  
  let currentListType = null
  let listItems = []
  
  function flushList() {
    if (listItems.length > 0) {
      const tag = currentListType === 'numbered_list' || currentListType === 'numbered_list_item' ? 'ol' : 'ul'
      htmlParts.push(`<${tag}>${listItems.join('')}</${tag}>`)
      listItems = []
      currentListType = null
    }
  }
  
  for (const blockId of contentIds) {
    const block = blocks[blockId]?.value
    if (!block) continue
    
    const type = block.type
    const html = blockToHtml(block, blockMap)
    
    // Handle list grouping
    if (type === 'bulleted_list' || type === 'bulleted_list_item' || 
        type === 'numbered_list' || type === 'numbered_list_item' ||
        type === 'to_do') {
      if (currentListType && currentListType !== type && 
          !((currentListType.includes('bulleted') && type.includes('bulleted')) ||
            (currentListType.includes('numbered') && type.includes('numbered')))) {
        flushList()
      }
      currentListType = type
      if (html) listItems.push(html)
    } else {
      flushList()
      if (html) htmlParts.push(html)
    }
    
    // Handle nested content (for columns, etc.)
    if (block.content && block.content.length > 0) {
      for (const childId of block.content) {
        const childBlock = blocks[childId]?.value
        if (childBlock) {
          const childHtml = blockToHtml(childBlock, blockMap)
          if (childHtml) {
            if (childBlock.type?.includes('list') || childBlock.type === 'to_do') {
              if (currentListType && !currentListType.includes(childBlock.type.split('_')[0])) {
                flushList()
              }
              currentListType = childBlock.type
              listItems.push(childHtml)
            } else {
              flushList()
              htmlParts.push(childHtml)
            }
          }
        }
      }
    }
  }
  
  flushList()
  
  return htmlParts.join('\n')
}

/**
 * Main function
 */
async function main() {
  console.log('📰 Generating RSS feed...')
  
  // Check if cache exists
  if (!fs.existsSync(POSTS_CACHE_FILE)) {
    console.error('❌ Error: No cached posts found. Run `pnpm sync` first.')
    process.exit(1)
  }
  
  // Load posts
  const posts = JSON.parse(fs.readFileSync(POSTS_CACHE_FILE, 'utf-8'))
  console.log(`📄 Found ${posts.length} posts`)
  
  // Filter published posts (not pages, has slug, published status)
  const publishedPosts = posts.filter(post => {
    // Must have slug
    if (!post.slug) return false
    // Must not be a page type
    if (post.type?.[0] === 'Page') return false
    // Must be published
    if (post.status?.[0] && post.status[0] !== 'Published') return false
    return true
  })
  
  // Sort by date (newest first) and take top 20
  publishedPosts.sort((a, b) => (b.date || 0) - (a.date || 0))
  const feedPosts = publishedPosts.slice(0, 20)
  
  console.log(`📝 Including ${feedPosts.length} posts in feed`)
  
  // Create feed
  const year = new Date().getFullYear()
  const siteUrl = config.link || 'https://example.com'
  const sitePath = config.path || ''
  
  const feed = new Feed({
    title: config.title || 'Blog',
    description: config.description || '',
    id: `${siteUrl}/${sitePath}`,
    link: `${siteUrl}/${sitePath}`,
    language: config.lang || 'en-US',
    favicon: `${siteUrl}/favicon.svg`,
    copyright: `All rights reserved ${year}, ${config.author || 'Author'}`,
    author: {
      name: config.author || 'Author',
      email: config.email || '',
      link: siteUrl
    },
    feedLinks: {
      atom: `${siteUrl}/feed.xml`
    }
  })
  
  // Add posts to feed
  for (const post of feedPosts) {
    let content = ''
    
    // Try to load block content
    const blockFile = path.join(BLOCKS_DIR, `${post.id}.json`)
    if (fs.existsSync(blockFile)) {
      try {
        const blockMap = JSON.parse(fs.readFileSync(blockFile, 'utf-8'))
        content = renderBlocksToHtml(blockMap, post.id)
      } catch (e) {
        console.log(`   ⚠️ Could not render blocks for: ${post.title}`)
      }
    }
    
    // Fallback to summary if no content
    if (!content && post.summary) {
      content = `<p>${post.summary}</p>`
    }
    
    feed.addItem({
      title: post.title || 'Untitled',
      id: `${siteUrl}/${post.slug}`,
      link: `${siteUrl}/${post.slug}`,
      description: post.summary || '',
      content: content,
      date: new Date(post.date || Date.now()),
      author: [{
        name: config.author || 'Author',
        email: config.email || '',
        link: siteUrl
      }]
    })
  }
  
  // Ensure public directory exists
  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }
  
  // Write feed
  const atomXml = feed.atom1()
  fs.writeFileSync(OUTPUT_FILE, atomXml)
  
  console.log(`✅ RSS feed generated: ${OUTPUT_FILE}`)
  console.log(`   - Format: Atom 1.0`)
  console.log(`   - Posts: ${feedPosts.length}`)
}

main().catch(error => {
  console.error('❌ RSS generation failed:', error)
  process.exit(1)
})
