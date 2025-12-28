import { createContext, useContext, useState, useCallback } from 'react'
import loadLocale from '@/assets/i18n'

const LocaleContext = createContext(undefined)

/**
 * Detect browser language preference
 * @returns {'zh-CN' | 'en-US'}
 */
export function detectBrowserLang() {
  if (typeof window === 'undefined') return 'en-US'
  const browserLang = navigator.language || navigator.languages?.[0]
  // Match Chinese variants: zh, zh-CN, zh-TW, zh-HK, etc.
  return browserLang?.startsWith('zh') ? 'zh-CN' : 'en-US'
}

/**
 * Get stored language preference from localStorage
 * @returns {string | null}
 */
export function getStoredLang() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('lang')
}

/**
 * Get initial language based on stored preference or browser detection
 * @param {string} defaultLang - Default language from config
 * @returns {'zh-CN' | 'en-US'}
 */
export function getInitialLang(defaultLang) {
  const storedLang = getStoredLang()
  if (storedLang === 'zh-CN' || storedLang === 'en-US') {
    return storedLang
  }
  return detectBrowserLang()
}

export function LocaleProvider({ initialLang, initialLocale, children }) {
  const [lang, setLang] = useState(initialLang)
  const [locale, setLocale] = useState(initialLocale)

  const switchLang = useCallback(async (newLang) => {
    if (newLang === lang) return
    
    try {
      const newLocale = await loadLocale('basic', newLang)
      setLang(newLang)
      setLocale(newLocale)
      localStorage.setItem('lang', newLang)
    } catch (error) {
      console.error('Failed to load locale:', error)
    }
  }, [lang])

  return (
    <LocaleContext.Provider value={{ locale, lang, switchLang }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  // For backward compatibility, return locale directly if it's the old format
  if (context && context.locale) {
    return context
  }
  return { locale: context, lang: null, switchLang: () => {} }
}
