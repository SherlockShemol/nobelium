import type { Post } from '@/types'

export function getAllTagsFromPosts(posts: Post[]): Record<string, number> {
  const taggedPosts = posts.filter(post => post?.tags)
  const tags = [...taggedPosts.map(p => p.tags).flat()].filter((tag): tag is string => !!tag)
  const tagObj: Record<string, number> = {}
  tags.forEach(tag => {
    if (tag in tagObj) {
      tagObj[tag]++
    } else {
      tagObj[tag] = 1
    }
  })
  return tagObj
}
