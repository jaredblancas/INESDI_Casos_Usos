"use client";

import Image from "next/image";
import Link from "next/link";
import { useId } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  MessageCircleQuestion,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { softSpring } from "@/lib/motion";

const NAV = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/crm", label: "Clientes", icon: Users },
  { href: "/inventario", label: "Inventario", icon: Package },
  { href: "/faqs", label: "FAQs", icon: MessageCircleQuestion },
  { href: "/analytics", label: "Analítica", icon: TrendingUp },
];

/**
 * Contenido del sidebar (logo + navegación + pie). Se reutiliza en el
 * sidebar fijo de escritorio y en el drawer del menú móvil.
 * `onNavigate` cierra el drawer al tocar un enlace en móvil (no-op en desktop).
 */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  // layoutId único por instancia para que el pill animado del sidebar fijo y
  // el del drawer móvil no entren en conflicto cuando ambos están montados.
  const layoutId = useId();

  async function signOut() {
    await fetch("/auth/signout", { method: "POST" });
    onNavigate?.();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col">
      <Link
        href="/"
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
        className="flex items-center gap-2.5 px-5 py-5"
      >
        <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
          <Image
            src="/ICE_GO_LOGO.png"
            alt="ICE-GO"
            width={36}
            height={36}
            className="size-8 object-contain"
            priority
          />
        </span>
        <span className="text-lg font-semibold tracking-tight">ICE-GO</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                // Navegación programática: dentro del drawer (base-ui Dialog)
                // el clic recibe preventDefault, así que el Link no navegaría
                // por sí solo. router.push garantiza la navegación en ambos casos.
                e.preventDefault();
                router.push(href);
              }}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId={`sidebar-active-${layoutId}`}
                  transition={softSpring}
                  className="absolute inset-0 rounded-lg bg-sidebar-primary"
                />
              )}
              <Icon className="relative z-10 size-4" />
              <span className="relative z-10">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          className="flex-1 justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          onClick={signOut}
        >
          <LogOut className="size-4" />
          Cerrar sesión
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
