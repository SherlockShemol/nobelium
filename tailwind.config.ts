import type { Config } from 'tailwindcss'
import { config } from './lib/server/config'
import { FONTS_SANS, FONTS_SERIF } from './consts'

const tailwindConfig: Config = {
  content: ['./pages/**/*.tsx', './components/**/*.tsx', './layouts/**/*.tsx'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        day: {
          DEFAULT: config.lightBackground || '#ffffff'
        },
        night: {
          DEFAULT: config.darkBackground || '#111827'
        },
        klein: {
          DEFAULT: '#002FA7',
          light: '#4d7fff' // 深色模式下使用的亮色变体
        }
      },
      fontFamily: {
        sans: FONTS_SANS,
        serif: FONTS_SERIF,
        noEmoji: [
          '"IBM Plex Sans"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}

export default tailwindConfig
