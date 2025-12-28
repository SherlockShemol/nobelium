import { config } from '@/lib/server/config'

import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import { useConfig } from '@/lib/config'
import { useFilteredPosts } from '@/lib/useFilteredPosts'

const Page = ({ posts, page }) => {
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

export async function getStaticProps (context) {
  const { page } = context.params // Get Current Page No.
  const posts = await getAllPosts({ includePages: false })
  return {
    props: {
      page: parseInt(page), // Current Page
      posts
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: false })
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / config.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
