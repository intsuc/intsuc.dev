import { HeadContent, Link, Scripts, createRootRoute } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "intsuc",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon.png",
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

function Header() {
  return (
    <nav className="top-0 sticky flex font-mono bg-[#0f0f0f] text-[#bdbdbd] border-b border-[#efefef] *:px-4 *:py-2 *:border-r">
      <Link to="/">
        intsuc
      </Link>
      <Link to="/blog">
        blog
      </Link>
    </nav>
  )
}

function NotFound() {
  return (
    <main className="m-8 sm:m-16 w-min flex flex-col gap-8">
      <h1 className="whitespace-pre text-4xl font-mono">not found</h1>
    </main>
  )
}
