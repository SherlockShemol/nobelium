import 'prismjs/themes/prism.css'
import 'react-notion-x/src/styles.css'
import 'katex/dist/katex.min.css'
import { useEffect, useState } from 'react'
import App from 'next/app'
import '@/styles/globals.css'
import '@/styles/notion.css'
import dynamic from 'next/dynamic'
import loadLocale from '@/assets/i18n'
import { ConfigProvider } from '@/lib/config'
import { LocaleProvider, getInitialLang } from '@/lib/locale'
import { prepareDayjs } from '@/lib/dayjs'
import { ThemeProvider } from '@/lib/theme'
import Scripts from '@/components/Scripts'

const Ackee = dynamic(() => import('@/components/Ackee'), { ssr: false })
const Gtag = dynamic(() => import('@/components/Gtag'), { ssr: false })

export default function MyApp ({ Component, pageProps, config, locale, lang }) {
  const [currentLang, setCurrentLang] = useState(lang)
  const [currentLocale, setCurrentLocale] = useState(locale)

  // Client-side: check localStorage/browser preference on mount
  useEffect(() => {
    const clientLang = getInitialLang(config.lang)
    if (clientLang !== currentLang) {
      loadLocale('basic', clientLang).then(newLocale => {
        setCurrentLang(clientLang)
        setCurrentLocale(newLocale)
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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

MyApp.getInitialProps = async ctx => {
  const config = typeof window === 'object'
    ? await fetch('/api/config').then(res => res.json())
    : await import('@/lib/server/config').then(module => module.clientConfig)

  prepareDayjs(config.timezone)

  // Use config.lang as default for SSR
  const lang = config.lang
  const locale = await loadLocale('basic', lang)

  return {
    ...App.getInitialProps(ctx),
    config,
    locale,
    lang
  }
}
