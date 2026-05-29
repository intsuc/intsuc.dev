import { createFileRoute, notFound } from "@tanstack/react-router"
import { getBlogPost } from "#/utils/blog"
import { renderMarkdown } from "#/utils/markdown"

export const Route = createFileRoute("/blog/$year/$month/$day")({
  loader: ({ params }) => {
    const post = getBlogPost(params)
    if (!post) throw notFound()

    return {
      ...post,
      html: renderMarkdown(post.content),
    }
  },
  component: BlogPost,
})

function BlogPost() {
  const post = Route.useLoaderData()

  return (
    <main className="m-8 max-w-3xl sm:m-16">
      <article className="mt-8">
        <header className="mb-10">
          <time className="mt-3 block font-mono text-sm text-[#bdbdbd]" dateTime={post.date}>
            {post.date}
          </time>
          <h1 className="text-4xl">{post.title}</h1>
        </header>
        <div className="markdown-content" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  )
}
