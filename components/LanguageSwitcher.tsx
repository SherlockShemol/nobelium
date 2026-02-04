import { useState, useRef, useEffect } from 'react'
import { useLocale } from '@/lib/locale'

interface Language {
  code: string
  label: string
  short: string
}

const languages: Language[] = [
  { code: 'en-US', label: 'English', short: 'EN' },
  { code: 'zh-CN', label: '中文', short: '中' }
]

export default function LanguageSwitcher() {
  const { lang, switchLang } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLang = languages.find(l => l.code === lang) || languages[0]

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleSelect = (langCode: string) => {
    switchLang(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative ml-4" ref={dropdownRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
        aria-label="切换语言"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{currentLang.short}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 py-1 min-w-[100px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50"
          role="listbox"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelect(language.code)}
              className={`w-full px-3 py-1.5 text-left text-sm transition-colors duration-200 ${
                lang === language.code
                  ? 'text-gray-900 dark:text-gray-100 font-medium bg-gray-50 dark:bg-gray-700'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              role="option"
              aria-selected={lang === language.code}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
