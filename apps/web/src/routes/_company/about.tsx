import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_company/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_company/about"!</div>
}
