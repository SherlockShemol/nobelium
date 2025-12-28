import FormattedDate from "@/components/FormattedDate";
import { useConfig } from "@/lib/config";
import Link from "next/link";

const BlogPost = ({ post }) => {
  const BLOG = useConfig();

  return (
    <Link href={`${BLOG.path}/${post.slug}`}>
      <article key={post.id} className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
        {/* 分类标签 */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-emerald-500 uppercase tracking-wide">
              {post.tags[0]}
            </span>
            <span className="text-gray-400 dark:text-gray-500">·</span>
            <time className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <FormattedDate date={post.date} />
            </time>
          </div>
        )}
        {/* 无标签时只显示日期 */}
        {(!post.tags || post.tags.length === 0) && (
          <div className="flex items-center gap-1 mb-2">
            <time className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <FormattedDate date={post.date} />
            </time>
          </div>
        )}
        <header>
          <h2 className="text-lg md:text-xl font-medium mb-2 cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </h2>
        </header>
        <main>
          <p className="hidden md:block leading-7 text-gray-600 dark:text-gray-400">
            {post.summary}
          </p>
        </main>
      </article>
    </Link>
  );
};

export default BlogPost;
