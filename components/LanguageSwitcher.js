import { useLocale } from '@/lib/locale'

export default function LanguageSwitcher() {
  const { lang, switchLang } = useLocale()

  return (
    <div className="flex items-center text-sm ml-4">
      <button
        onClick={() => switchLang('en-US')}
        className={`transition-colors duration-200 ${
          lang === 'en-US'
            ? 'text-gray-900 dark:text-gray-100 font-medium'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="mx-1 text-gray-300 dark:text-gray-600">/</span>
      <button
        onClick={() => switchLang('zh-CN')}
        className={`transition-colors duration-200 ${
          lang === 'zh-CN'
            ? 'text-gray-900 dark:text-gray-100 font-medium'
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
        aria-label="切换到中文"
      >
        中
      </button>
    </div>
  )
}
