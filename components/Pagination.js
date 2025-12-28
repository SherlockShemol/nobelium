import Link from 'next/link'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'

const Pagination = ({ page, showNext }) => {
  const BLOG = useConfig()
  const { locale } = useLocale()
  const currentPage = +page
  let additionalClassName = 'justify-between'
  if (currentPage === 1 && showNext) additionalClassName = 'justify-end'
  if (currentPage !== 1 && !showNext) additionalClassName = 'justify-start'
  return (
    <div
      className={`flex font-medium text-black dark:text-gray-100 ${additionalClassName}`}
    >
      {currentPage !== 1 && (
        <Link
          href={
            currentPage - 1 === 1
              ? `${BLOG.path || '/'}`
              : `/page/${currentPage - 1}`
          }
        >
          <button rel="prev" className="block cursor-pointer hover:text-klein dark:hover:text-klein-light transition-colors duration-200">
            ← {locale.PAGINATION.PREV}
          </button>
        </Link>
      )}
      {showNext && (
        <Link href={`/page/${currentPage + 1}`}>
          <button rel="next" className="block cursor-pointer hover:text-klein dark:hover:text-klein-light transition-colors duration-200">
            {locale.PAGINATION.NEXT} →
          </button>
        </Link>
      )}
    </div>
  )
}

export default Pagination
