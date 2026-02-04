/**
 * RSS Feed redirect
 * 
 * Redirects to the static feed.xml generated at build time.
 * This maintains backward compatibility with the /feed URL.
 */

import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Location', '/feed.xml')
  res.statusCode = 301
  res.end()
  return { props: {} }
}

const Feed = () => null
export default Feed
