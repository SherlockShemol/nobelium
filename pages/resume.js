import Container from '@/components/Container'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'

// 简历更新时间 - 请在更新 PDF 后修改此日期
const RESUME_UPDATED_DATE = '2024年12月28日'

export default function Resume () {
  const BLOG = useConfig()
  const { locale } = useLocale()

  return (
    <Container
      title={`${locale.NAV.RESUME} - ${BLOG.title}`}
      description={`${BLOG.author} 的个人简历`}
    >
      <div className="flex flex-col items-center w-full">
        {/* 标题和更新时间 */}
        <div className="flex items-center justify-between w-full mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {locale.NAV.RESUME}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            更新于 {RESUME_UPDATED_DATE}
          </span>
        </div>

        {/* PDF 查看器 */}
        <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
          <iframe
            src="/resume.pdf"
            className="w-full"
            style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
            title="Resume PDF"
          />
        </div>

        {/* 下载按钮 */}
        <div className="mt-4">
          <a
            href="/resume.pdf"
            download
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            下载 PDF
          </a>
        </div>
      </div>
    </Container>
  )
}
