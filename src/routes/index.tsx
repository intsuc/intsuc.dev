import { createFileRoute } from "@tanstack/react-router"
import { IconMail, IconBrandGithub, IconBrandX } from "@tabler/icons-react"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  return (
    <main className="m-8 sm:m-16 w-min flex flex-col gap-8">
      <h1 className="text-4xl font-mono">intsuc</h1>
      <ul className="flex flex-col gap-2 *:flex *:gap-2 *:font-mono">
        <li>
          <IconMail />
          <a href="mailto:i@intsuc.dev">i@intsuc.dev</a>
        </li>
        <li>
          <IconBrandGithub />
          <a href="https://github.com/intsuc">intsuc</a>
        </li>
        <li>
          <IconBrandX />
          <a href="https://x.com/intsuc">@intsuc</a>
        </li>
      </ul>
    </main>
  )
}
