import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import { useConfig } from '@/lib/config'
import { useFilteredPosts } from '@/lib/useFilteredPosts'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import type { Post } from '@/types'

interface BlogProps {
  posts: Post[]
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  const posts = await getAllPosts({ includePages: false })
  return {
    props: {
      posts: posts || []
    },
    revalidate: 60
  }
}

export default function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const config = useConfig()
  const { title, description, postsPerPage } = config
  const filteredPosts = useFilteredPosts(posts)
  
  const postsToShow = filteredPosts.slice(0, postsPerPage)
  const totalPosts = filteredPosts.length
  const showNext = totalPosts > postsPerPage

  return (
    <Container title={title} description={description}>
      {postsToShow.map(post => (
        <BlogPost key={post.id} post={post} />
      ))}
      {showNext && <Pagination page={1} showNext={showNext} />}
    </Container>
  )
}
