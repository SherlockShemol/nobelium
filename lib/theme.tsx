import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useConfig } from '@/lib/config'

interface ThemeContextValue {
  dark: boolean | null
}

const ThemeContext = createContext<ThemeContextValue>({ dark: true })

interface ThemeProviderProps {
  children: ReactNode
}

/**
 * Custom hook to detect dark mode preference without SSR hydration mismatch.
 * Returns `null` during SSR/initial render, then the actual preference on client.
 */
function usePrefersDark(): boolean | null {
  const [prefersDark, setPrefersDark] = useState<boolean | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setPrefersDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersDark
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { appearance } = useConfig()

  // Use custom hook to avoid react-use SSR warning while still preventing flash
  const prefersDark = usePrefersDark()
  const dark = appearance === 'dark' || (appearance === 'auto' && prefersDark === true)

  useEffect(() => {
    // Only decide color scheme after initial loading, i.e. when `dark` is really representing a
    // media query result
    if (typeof dark === 'boolean') {
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.classList.remove('color-scheme-unset')
    }
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
