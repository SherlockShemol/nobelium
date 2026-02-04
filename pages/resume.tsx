import dynamic from 'next/dynamic'
import Container from '@/components/Container'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'
import type { SupportedLang } from '@/types'

// 动态导入 PdfViewer 组件，禁用 SSR
const PdfViewer = dynamic(() => import('@/components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-gray-200"></div>
      <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
    </div>
  )
})

// 简历更新时间 - 请在更新 PDF 后修改此日期
const RESUME_UPDATED_DATE: Record<SupportedLang, string> = {
  'en-US': 'December 28, 2025',
  'zh-CN': '2025年12月28日',
  'zh-TW': '2025年12月28日',
  'zh-HK': '2025年12月28日',
  'ja-JP': '2025年12月28日',
  'es-ES': '28 de diciembre de 2025'
}

export default function Resume() {
  const BLOG = useConfig()
  const { locale, lang } = useLocale()

  // 根据语言选择 PDF 文件
  const pdfFile = lang === 'en-US' ? '/resumes/resume_en.pdf' : '/resumes/resume_zh.pdf'
  const downloadText = lang === 'en-US' ? 'Download PDF' : '下载 PDF'
  const updatedText = lang === 'en-US' ? 'Updated on' : '更新于'
  const updatedDate = RESUME_UPDATED_DATE[lang as SupportedLang] || RESUME_UPDATED_DATE['zh-CN']

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
            {updatedText} {updatedDate}
          </span>
        </div>

        {/* PDF 查看器 */}
        <PdfViewer file={pdfFile} />

        {/* 下载按钮 */}
        <div className="mt-4">
          <a
            href={pdfFile}
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
            {downloadText}
          </a>
        </div>
      </div>
    </Container>
  )
}
