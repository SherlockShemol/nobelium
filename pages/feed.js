/**
 * RSS Feed redirect
 * 
 * Redirects to the static feed.xml generated at build time.
 * This maintains backward compatibility with the /feed URL.
 */

export async function getServerSideProps({ res }) {
  res.setHeader('Location', '/feed.xml')
  res.statusCode = 301
  res.end()
  return { props: {} }
}

const feed = () => null
export default feed
