import { createFileRoute } from "@tanstack/react-router"
import { IconMail, IconBrandGithub, IconBrandX } from "@tabler/icons-react"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
  return (
    <div className="m-16 w-min flex flex-col gap-4">
      <span className="text-4xl font-mono">intsuc</span>
      <div className="flex flex-col gap-2 *:flex *:gap-2 *:font-mono">
        <div>
          <IconMail />
          <a href="mailto:s@intsuc.dev">s@intsuc.dev</a>
        </div>
        <div>
          <IconBrandGithub />
          <a href="https://github.com/intsuc">intsuc</a>
        </div>
        <div>
          <IconBrandX />
          <a href="https://x.com/intsuc">@intsuc</a>
        </div>
      </div>
    </div>
  )
}
