import { getMarkdownTitle, removeLeadingTitleHeading, splitMarkdown } from "./markdown"

export type BlogPost = {
  year: string
  month: string
  day: string
  date: string
  title: string
  content: string
}

const posts = import.meta.glob<string>("../blog/*/*/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
})

export function getBlogPosts() {
  return Object.entries(posts)
    .map(([path, content]) => toBlogPost(path, content))
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function getBlogPost(params: { year: string; month: string; day: string }) {
  return getBlogPosts().find(
    (post) => post.year === params.year && post.month === params.month && post.day === params.day,
  )
}

function toBlogPost(path: string, rawContent: string): BlogPost | null {
  const match = path.match(/^\.\.\/blog\/(\d{4})\/(\d{2})\/(\d{2})\.md$/)
  if (!match) return null

  const [, year = "", month = "", day = ""] = match
  const date = `${year}/${month}/${day}`
  const { body } = splitMarkdown(rawContent)
  const title = getMarkdownTitle(rawContent, date)

  return {
    year,
    month,
    day,
    date,
    title,
    content: removeLeadingTitleHeading(body, title),
  }
}
