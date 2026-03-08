import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/$hotelId/rooms/page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/hotelId/rooms/page"!</div>
}
