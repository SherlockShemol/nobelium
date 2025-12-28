import 'prismjs/themes/prism.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.min.css'
import { useEffect, useState } from 'react'
import '@/styles/globals.css'
import '@/styles/notion.css'
import dynamic from 'next/dynamic'
import loadLocale from '@/assets/i18n'
import { ConfigProvider } from '@/lib/config'
import { LocaleProvider, getInitialLang } from '@/lib/locale'
import { prepareDayjs } from '@/lib/dayjs'
import { ThemeProvider } from '@/lib/theme'
import Scripts from '@/components/Scripts'
import blogConfig from '@/blog.config'

const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })

// Load config at module level (build time) - this is static and doesn't change at runtime
const staticConfig = blogConfig

export default function MyApp ({ Component, pageProps }) {
  const [config] = useState(staticConfig)
  const [currentLang, setCurrentLang] = useState(staticConfig.lang)
  const [currentLocale, setCurrentLocale] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // Client-side initialization: load locale and prepare dayjs
  useEffect(() => {
    const initApp = async () => {
      // Prepare dayjs with timezone
      prepareDayjs(staticConfig.timezone)
      
      // Get client-side language preference
      const clientLang = getInitialLang(staticConfig.lang)
      
      // Load locale
      const locale = await loadLocale('basic', clientLang)
      
      setCurrentLang(clientLang)
      setCurrentLocale(locale)
      setIsReady(true)
    }
    
    initApp()
  }, [])

  // Show nothing until locale is loaded to prevent hydration issues
  if (!isReady) {
    return null
  }

  return (
    <ConfigProvider value={config}>
      <Scripts />
      <LocaleProvider initialLang={currentLang} initialLocale={currentLocale}>
        <ThemeProvider>
          <>
            {process.env.VERCEL_ENV === 'production' && config?.analytics?.provider === 'ackee' && (
              <Ackee
                ackeeServerUrl={config.analytics.ackeeConfig.dataAckeeServer}
                ackeeDomainId={config.analytics.ackeeConfig.domainId}
              />
            )}
            {process.env.VERCEL_ENV === 'production' && config?.analytics?.provider === 'ga' && <Gtag />}
            <Component {...pageProps} />
          </>
        </ThemeProvider>
      </LocaleProvider>
    </ConfigProvider>
  )
}
