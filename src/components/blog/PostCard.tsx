import Image from 'next/image';
import Link from 'next/link';
import { formatPostDate, type BlogPost } from '@/lib/blog';
import { BLOG_LOCALES } from '@/lib/blog-locales';

interface PostCardProps {
  post: BlogPost;
  /** h2 on listing pages; h3 where the cards sit under a section heading. */
  headingLevel?: 'h2' | 'h3';
  /** Loads the cover right away; set it on the first card of a listing, the page's largest picture. */
  priority?: boolean;
}

export function PostCard({ post, headingLevel: Heading = 'h2', priority = false }: PostCardProps) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-glass transition duration-300 hover:-translate-y-1 hover:shadow-glass-lg has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary-teal motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {post.image && (
        <div className="relative aspect-[16/9] bg-primary-forest/5">
          {/* The title already names the link, so the cover is decorative here. */}
          <Image
            src={post.image.src}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="self-start rounded-full bg-primary-teal/10 px-3 py-1 text-xs font-semibold text-primary-forest">
          {post.category.label}
        </p>
        <Heading className="mt-4 text-balance font-display text-xl font-bold leading-snug text-foreground">
          <Link
            href={post.url}
            className="transition-colors after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:text-primary-forest"
          >
            {post.title}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-3 text-[0.9375rem] leading-relaxed text-muted">{post.description}</p>
        <p className="mt-auto pt-5 text-sm text-muted">
          <time dateTime={post.date}>{formatPostDate(post.date, post.locale)}</time>
          <span aria-hidden="true"> · </span>
          {BLOG_LOCALES[post.locale].text.minutesRead(post.readingMinutes)}
        </p>
      </div>
    </article>
  );
}
