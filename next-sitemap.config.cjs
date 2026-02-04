// @ts-check
const fs = require('fs')
const path = require('path')

/**
 * Load blog config (supports both .ts and .js)
 * @returns {import('./types/blog-config').BlogConfig}
 */
function loadBlogConfig() {
  const tsPath = path.join(process.cwd(), 'blog.config.ts')
  const jsPath = path.join(process.cwd(), 'blog.config.js')
  
  /** @type {string} */
  let configRaw
  if (fs.existsSync(tsPath)) {
    configRaw = fs.readFileSync(tsPath, 'utf-8')
    // Strip TypeScript-specific syntax for evaluation
    configRaw = configRaw
      .replace(/import\s+type\s+.*?from\s+['"][^'"]+['"];?\s*/g, '')
      .replace(/:\s*BlogConfig/g, '')
      .replace(/export\s+default\s+/, 'module.exports = ')
  } else {
    configRaw = fs.readFileSync(jsPath, 'utf-8')
  }
  
  return eval(`((module = { exports }) => { ${configRaw}; return module.exports })()`)
}

const blogConfig = loadBlogConfig()

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: blogConfig.link,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  generateIndexSitemap: false
  // ...other options
  // https://github.com/iamvishnusankar/next-sitemap#configuration-options
}
