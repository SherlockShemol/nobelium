import BLOG from '../../blog.config'
import type { BlogConfig } from '@/types'

const config: BlogConfig = BLOG

// If we need to strip out some private fields
const clientConfig: BlogConfig = config

export { config, clientConfig }
