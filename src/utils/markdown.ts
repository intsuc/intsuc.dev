type FrontMatter = Record<string, string>

export function splitMarkdown(content: string) {
  const normalized = content.replace(/\r\n?/g, "\n")
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/)

  if (!match) {
    return { frontMatter: {}, body: normalized }
  }

  return {
    frontMatter: parseFrontMatter(match[1] ?? ""),
    body: normalized.slice(match[0].length),
  }
}

export function renderMarkdown(content: string) {
  const lines = content.replace(/\r\n?/g, "\n").split("\n")
  const html: Array<string> = []
  let paragraph: Array<string> = []
  let listItems: Array<string> = []
  let codeLines: Array<string> | null = null

  const flushParagraph = () => {
    if (paragraph.length === 0) return
    html.push(`<p>${renderInline(paragraph.join(" "))}</p>`)
    paragraph = []
  }

  const flushList = () => {
    if (listItems.length === 0) return
    html.push(`<ul>${listItems.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`)
    listItems = []
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith("```")) {
      if (codeLines) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`)
        codeLines = null
      } else {
        flushParagraph()
        flushList()
        codeLines = []
      }
      continue
    }

    if (codeLines) {
      codeLines.push(line)
      continue
    }

    if (trimmed === "") {
      flushParagraph()
      flushList()
      continue
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1]?.length ?? 1
      html.push(`<h${level}>${renderInline(heading[2] ?? "")}</h${level}>`)
      continue
    }

    const listItem = trimmed.match(/^[-*]\s+(.+)$/)
    if (listItem) {
      flushParagraph()
      listItems.push(listItem[1] ?? "")
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  if (codeLines) {
    html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`)
  }

  flushParagraph()
  flushList()

  return html.join("\n")
}

export function getMarkdownTitle(content: string, fallback: string) {
  const { frontMatter, body } = splitMarkdown(content)
  if (frontMatter.title) return frontMatter.title

  const heading = body.match(/^#\s+(.+)$/m)
  if (heading?.[1]) return stripInlineMarkdown(heading[1]).trim()

  return fallback
}

export function removeLeadingTitleHeading(content: string, title: string) {
  const normalized = content.replace(/\r\n?/g, "\n")
  const heading = normalized.match(/^\s*#\s+(.+?)[ \t]*(?:\n|$)/)

  if (!heading?.[1]) return normalized
  if (stripInlineMarkdown(heading[1]).trim() !== title.trim()) return normalized

  return normalized.slice(heading[0].length).replace(/^\n+/, "")
}

function parseFrontMatter(content: string): FrontMatter {
  return Object.fromEntries(
    content
      .split("\n")
      .map((line) => line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/))
      .filter((match): match is RegExpMatchArray => Boolean(match))
      .map((match) => [match[1] ?? "", trimQuotes(match[2] ?? "")]),
  )
}

function renderInline(content: string) {
  const links: Array<string> = []
  const contentWithLinks = content.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    (match, text: string, href: string) => {
      if (!isSafeHref(href)) return match

      const index = links.length
      links.push(`<a href="${escapeAttribute(href)}">${renderInlineWithoutLinks(text)}</a>`)
      return `\u0000LINK_${index}\u0000`
    },
  )

  return renderInlineWithoutLinks(contentWithLinks).replace(
    /\u0000LINK_(\d+)\u0000/g,
    (_, index: string) => links[Number(index)] ?? "",
  )
}

function renderInlineWithoutLinks(content: string) {
  let html = escapeHtml(content)

  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/_([^_]+)_/g, "<em>$1</em>")

  return html
}

function stripInlineMarkdown(content: string) {
  return content
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
}

function isSafeHref(href: string) {
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  )
}

function escapeHtml(content: string) {
  return content
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function escapeAttribute(content: string) {
  return escapeHtml(content).replaceAll("`", "&#96;")
}

function trimQuotes(content: string) {
  return content.replace(/^["']|["']$/g, "")
}
