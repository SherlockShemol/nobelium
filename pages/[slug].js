import { clientConfig } from '@/lib/server/config'

import { useRouter } from 'next/router'
import { useMemo } from 'react'
import cn from 'classnames'
import { getAllPosts, getPostBlocks } from '@/lib/notion'
import { useLocale } from '@/lib/locale'
import { useConfig } from '@/lib/config'
import { createHash } from 'crypto'
import Container from '@/components/Container'
import Post from '@/components/Post'
import Comments from '@/components/Comments'

/**
 * Select the appropriate post based on current language
 * @param {Array} posts - All posts with the same slug (different language versions)
 * @param {string} lang - Current language
 * @returns {Object} - The post matching the current language, or the first available
 */
function useLocalizedPost(posts, lang) {
  return useMemo(() => {
    if (!posts || posts.length === 0) return null
    if (posts.length === 1) return posts[0]
    
    // Find post matching current language
    const localizedPost = posts.find(post => {
      const postLangs = post.lang
      if (!postLangs || postLangs.length === 0) return false
      return postLangs.includes(lang)
    })
    
    // Return localized post or fallback to first post
    return localizedPost || posts[0]
  }, [posts, lang])
}

export default function BlogPost ({ posts, blockMaps, emailHash }) {
  const router = useRouter()
  const BLOG = useConfig()
  const { locale, lang } = useLocale()
  
  // Select the appropriate post based on current language
  const post = useLocalizedPost(posts, lang)
  const blockMap = post ? blockMaps[post.id] : null

  // TODO: It would be better to render something
  if (router.isFallback || !post) return null

  const fullWidth = post.fullWidth ?? false

  return (
    <Container
      layout="blog"
      title={post.title}
      description={post.summary}
      slug={post.slug}
      // date={new Date(post.publishedAt).toISOString()}
      type="article"
      fullWidth={fullWidth}
    >
      <Post
        post={post}
        blockMap={blockMap}
        emailHash={emailHash}
        fullWidth={fullWidth}
      />

      {/* Back and Top */}
      <div
        className={cn(
          'px-4 flex justify-between font-medium text-gray-500 dark:text-gray-400 my-5',
          fullWidth ? 'md:px-24' : 'mx-auto max-w-2xl'
        )}
      >
        <a>
          <button
            onClick={() => router.push(BLOG.path || '/')}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ← {locale.POST.BACK}
          </button>
        </a>
        <a>
          <button
            onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })}
            className="mt-2 cursor-pointer hover:text-black dark:hover:text-gray-100"
          >
            ↑ {locale.POST.TOP}
          </button>
        </a>
      </div>

      <Comments frontMatter={post} />
    </Container>
  )
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: true })
  // Get unique slugs (there might be multiple posts with same slug for different languages)
  const uniqueSlugs = [...new Set(posts.map(row => row.slug))]
  return {
    paths: uniqueSlugs.map(slug => `${clientConfig.path}/${slug}`),
    fallback: true
  }
}

export async function getStaticProps ({ params: { slug } }) {
  const allPosts = await getAllPosts({ includePages: true })
  // Get all posts with this slug (could be multiple language versions)
  const posts = allPosts.filter(t => t.slug === slug)

  if (!posts || posts.length === 0) return { notFound: true }

  // Fetch block maps for all language versions
  const blockMaps = {}
  for (const post of posts) {
    blockMaps[post.id] = await getPostBlocks(post.id)
  }
  
  const emailHash = createHash('md5')
    .update(clientConfig.email)
    .digest('hex')
    .trim()
    .toLowerCase()

  return {
    props: { posts, blockMaps, emailHash },
    revalidate: 1
  }
}
