import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useMedia } from 'react-use'
import { useConfig } from '@/lib/config'

interface ThemeContextValue {
  dark: boolean | null
}

const ThemeContext = createContext<ThemeContextValue>({ dark: true })

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { appearance } = useConfig()

  // `defaultState` should normally be a boolean. But it causes initial loading flashes in slow
  // rendering. Setting it to `undefined` so that we can differentiate the initial loading phase
  const prefersDark = useMedia('(prefers-color-scheme: dark)', undefined)
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
