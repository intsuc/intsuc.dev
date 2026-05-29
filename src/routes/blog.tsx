import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { getBlogPosts } from "#/utils/blog"

export const Route = createFileRoute("/blog")({
  loader: () => getBlogPosts(),
  component: BlogLayout,
})

function BlogLayout() {
  return <Outlet />
}

export function BlogIndex() {
  const posts = Route.useLoaderData()

  return (
    <main className="m-8 max-w-2xl sm:m-16 flex flex-col gap-8">
      <h1 className="font-mono text-4xl">blog</h1>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.date}>
            <Link
              className="flex items-end gap-4"
              to="/blog/$year/$month/$day"
              params={{
                year: post.year,
                month: post.month,
                day: post.day,
              }}
            >
              <time className="font-mono text-sm text-[#bdbdbd]" dateTime={post.date}>
                {post.date}
              </time>
              <span className="text-xl">{post.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
