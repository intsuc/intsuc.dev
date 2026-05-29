import { createFileRoute } from "@tanstack/react-router"
import { BlogIndex } from "./blog"

export const Route = createFileRoute("/blog/")({
  component: BlogIndex,
})
