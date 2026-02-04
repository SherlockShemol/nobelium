import { getAllPosts, getAllTagsFromPosts } from '@/lib/notion'
import SearchLayout from '@/layouts/search'
import type { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import type { Post } from '@/types'

interface TagPageProps {
  tags: Record<string, number>
  posts: Post[]
  currentTag: string
}

export default function Tag({ tags, posts, currentTag }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SearchLayout tags={tags} posts={posts} currentTag={currentTag} />
}

export const getStaticProps: GetStaticProps<TagPageProps, { tag: string }> = async ({ params }) => {
  const currentTag = params?.tag
  if (!currentTag) return { notFound: true }

  const allPosts = await getAllPosts({ includePages: false })
  const posts = allPosts || []
  const tags = getAllTagsFromPosts(posts)
  const filteredPosts = posts.filter(
    post => post && post.tags && post.tags.includes(currentTag)
  )
  return {
    props: {
      tags,
      posts: filteredPosts,
      currentTag
    },
    revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts({ includePages: false })
  const tags = getAllTagsFromPosts(posts || [])
  return {
    paths: Object.keys(tags).map(tag => ({ params: { tag } })),
    fallback: true
  }
}
