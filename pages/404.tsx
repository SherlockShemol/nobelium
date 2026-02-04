import { useLocale } from '@/lib/locale'
import Container from '@/components/Container'

export default function Page404() {
  const { locale } = useLocale()
  const pageLocale = locale.PAGE as { ERROR_404?: { MESSAGE?: string } }

  return (
    <Container>
      <h1 className="text-5xl text-black dark:text-white text-center">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 text-center">
        {pageLocale?.ERROR_404?.MESSAGE || 'Page not found'}
      </p>
    </Container>
  )
}
