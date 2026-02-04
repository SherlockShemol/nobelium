import { config } from '@/lib/server/config'

import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import { useConfig } from '@/lib/config'
import { useFilteredPosts } from '@/lib/useFilteredPosts'
import type { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next'
import type { Post } from '@/types'

interface PageProps {
  posts: Post[]
  page: number
}

const Page = ({ posts, page }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { postsPerPage } = useConfig()
  const filteredPosts = useFilteredPosts(posts)
  
  const postsToShow = filteredPosts.slice(
    postsPerPage * (page - 1),
    postsPerPage * page
  )
  const totalPosts = filteredPosts.length
  const showNext = page * postsPerPage < totalPosts

  return (
    <Container>
      {postsToShow &&
        postsToShow.map(post => <BlogPost key={post.id} post={post} />)}
      <Pagination page={page} showNext={showNext} />
    </Container>
  )
}

export const getStaticProps: GetStaticProps<PageProps, { page: string }> = async (context) => {
  const { page } = context.params ?? { page: '1' }
  const posts = await getAllPosts({ includePages: false })
  return {
    props: {
      page: parseInt(page, 10), // Current Page
      posts: posts || []
    },
    revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts({ includePages: false })
  const totalPosts = posts?.length ?? 0
  const totalPages = Math.ceil(totalPosts / config.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
