import { useMemo } from 'react'
import { useLocale } from '@/lib/locale'

/**
 * Filter posts by current language
 * @param {Array} posts - All posts from Notion
 * @returns {Array} - Filtered posts matching current language
 */
export function useFilteredPosts(posts) {
  const { lang } = useLocale()

  const filteredPosts = useMemo(() => {
    if (!posts || !Array.isArray(posts)) return []
    
    return posts.filter(post => {
      // lang is a multi-select field, so it's an array
      const postLangs = post.lang
      
      // If post has no lang field, show it in all languages (backward compatibility)
      if (!postLangs || postLangs.length === 0) {
        return true
      }
      
      // Check if the current language is in the post's lang array
      return postLangs.includes(lang)
    })
  }, [posts, lang])

  return filteredPosts
}
