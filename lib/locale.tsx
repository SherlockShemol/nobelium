import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import loadLocale from '@/assets/i18n'
import type { Locale, LocaleContextValue } from '@/types'

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

/**
 * Detect browser language preference (client-side only)
 */
export function detectBrowserLang(): 'zh-CN' | 'en-US' | null {
  if (typeof window === 'undefined') return null
  const browserLang = navigator.language || navigator.languages?.[0]
  // Match Chinese variants: zh, zh-CN, zh-TW, zh-HK, etc.
  return browserLang?.startsWith('zh') ? 'zh-CN' : 'en-US'
}

/**
 * Get stored language preference from localStorage (client-side only)
 */
export function getStoredLang(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('lang')
  } catch {
    return null
  }
}

/**
 * Get client-side language preference (should only be called in useEffect)
 */
export function getClientLang(defaultLang: string): string {
  // Check stored preference first
  const storedLang = getStoredLang()
  if (storedLang === 'zh-CN' || storedLang === 'en-US') {
    return storedLang
  }
  // Fall back to browser detection
  const browserLang = detectBrowserLang()
  if (browserLang) {
    return browserLang
  }
  // Ultimate fallback to config default
  return defaultLang
}

interface LocaleProviderProps {
  initialLang: string
  initialLocale: Locale
  children: ReactNode
}

export function LocaleProvider({ initialLang, initialLocale, children }: LocaleProviderProps) {
  const [lang, setLang] = useState(initialLang)
  const [locale, setLocale] = useState<Locale>(initialLocale)

  const switchLang = useCallback(async (newLang: string) => {
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

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext)
  // For backward compatibility, return locale directly if it's the old format
  if (context && context.locale) {
    return context
  }
  return { locale: context as unknown as Locale, lang: '', switchLang: async () => {} }
}
