import { Frame, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import React from "react"

export function NavPersonnalsPosts({
  posts,
}: {
  posts: {
    title: string
    id: number
  }[]
}) {
  const { isMobile } = useSidebar()
  const [showAllPosts, setShowAllPosts] = React.useState(false)
  
  // delete un post
  const handleDelete = () => {
    console.log('delete')
  }

  // Gestion des posts à afficher
  const visiblePosts = showAllPosts ? posts : posts.slice(0, 5)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your Posts</SidebarGroupLabel>
      <SidebarMenu>
        {visiblePosts.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link to={`/post/${item.id}`}>
                <Frame />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <Link to={`/post/edit/${item.id}`}>
                  <DropdownMenuItem>
                    <Pencil className="text-muted-foreground" />
                    <span>Edit Post</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={handleDelete}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Post</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}

        {/* Bouton "Voir plus" si plus de 5 posts */}
        {posts.length > 5 && (
          <SidebarMenuItem>
            <SidebarMenuButton
              className="text-sidebar-foreground/70"
              onClick={() => setShowAllPosts((prev) => !prev)}
            >
              <MoreHorizontal className="text-sidebar-foreground/70" />
              <span>{showAllPosts ? "Voir moins" : "Voir plus"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}