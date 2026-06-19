"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/sidebar-nav";

/** Barra superior con menú de hamburguesa — visible solo en móvil (< md). */
export function MobileTopbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el drawer cuando cambia la ruta. Hacerlo aquí (y no en el onClick
  // del enlace) evita que el cierre del Dialog interrumpa la navegación.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 py-2.5 backdrop-blur-md md:hidden">
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Abrir menú" />
          }
        >
          <Menu className="size-5" />
        </DialogPrimitive.Trigger>

        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 duration-300 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
          <DialogPrimitive.Popup className="fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col bg-sidebar text-sidebar-foreground shadow-2xl outline-none duration-300 data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left">
            <DialogPrimitive.Title className="sr-only">
              Menú de navegación
            </DialogPrimitive.Title>
            <SidebarNav onNavigate={() => setOpen(false)} />
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <Link href="/" className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
          <Image
            src="/ICE_GO_LOGO.png"
            alt="ICE-GO"
            width={28}
            height={28}
            className="size-6 object-contain"
            priority
          />
        </span>
        <span className="text-base font-semibold tracking-tight">ICE-GO</span>
      </Link>
    </header>
  );
}
