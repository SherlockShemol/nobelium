import { getAllPosts, getAllTagsFromPosts } from '@/lib/notion'
import SearchLayout from '@/layouts/search'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import type { Post } from '@/types'

interface SearchProps {
  tags: Record<string, number>
  posts: Post[]
}

export default function Search({ tags, posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <SearchLayout tags={tags} posts={posts} />
}

export const getStaticProps: GetStaticProps<SearchProps> = async () => {
  const posts = await getAllPosts({ includePages: false })
  const tags = getAllTagsFromPosts(posts || [])
  return {
    props: {
      tags,
      posts: posts || []
    },
    revalidate: 60
  }
}
