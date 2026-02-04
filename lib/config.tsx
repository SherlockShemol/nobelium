import { createContext, useContext, ReactNode } from 'react'
import type { BlogConfig } from '@/types'

const ConfigContext = createContext<BlogConfig | undefined>(undefined)

interface ConfigProviderProps {
  value: BlogConfig
  children: ReactNode
}

export function ConfigProvider({ value, children }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig(): BlogConfig {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
