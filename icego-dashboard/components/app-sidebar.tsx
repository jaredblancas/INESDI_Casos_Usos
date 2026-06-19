import { SidebarNav } from "@/components/sidebar-nav";

/** Sidebar fijo — visible solo en escritorio (md+). En móvil se usa MobileTopbar. */
export function AppSidebar() {
  return (
    <aside className="hidden h-screen w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
      <SidebarNav />
    </aside>
  );
}
