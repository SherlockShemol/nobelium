export interface NavLocale {
  INDEX: string
  ABOUT: string
  FRIENDS: string
  RSS: string
  SEARCH: string
  RESUME: string
}

export interface PostLocale {
  BACK: string
  TOP: string
}

export interface PaginationLocale {
  PREV: string
  NEXT: string
}

export interface Locale {
  NAV: NavLocale
  POST: PostLocale
  PAGINATION: PaginationLocale
  [key: string]: unknown
}

export interface LocaleContextValue {
  locale: Locale
  lang: string
  switchLang: (lang: string) => Promise<void>
}
