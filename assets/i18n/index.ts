import type { Locale } from '@/types'

// Pre-defined locale mappings for lazy loading
const localeLoaders: Record<string, () => Promise<Locale>> = {
  'basic/en-US': () => import('./basic/en-US.json').then(m => m.default as Locale),
  'basic/zh-CN': () => import('./basic/zh-CN.json').then(m => m.default as Locale),
  'basic/zh-HK': () => import('./basic/zh-HK.json').then(m => m.default as Locale),
  'basic/zh-TW': () => import('./basic/zh-TW.json').then(m => m.default as Locale),
  'basic/ja-JP': () => import('./basic/ja-JP.json').then(m => m.default as Locale),
  'basic/es-ES': () => import('./basic/es-ES.json').then(m => m.default as Locale),
}

/**
 * Lazy-load lang data
 *
 * @param section - The section of lang data to load
 * @param lang    - The language name
 * @returns The content of a lang JSON
 */
export default async function loadLocale(section: string, lang: string): Promise<Locale> {
  const key = `${section}/${lang}`
  const loader = localeLoaders[key]
  
  if (!loader) {
    console.warn(`[i18n] Locale not found: ${key}, falling back to en-US`)
    return localeLoaders['basic/en-US']()
  }
  
  return loader()
}
