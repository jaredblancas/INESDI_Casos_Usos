"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { PEDIDOS_CHANGED_EVENT } from "@/lib/realtime";

/**
 * Escucha en vivo los pedidos nuevos vía Supabase Realtime (postgres_changes
 * INSERT sobre la tabla `pedidos`). Se monta una sola vez en el layout del
 * dashboard, así que avisa esté donde esté el operador.
 *
 * Un pedido multi-producto inserta varias filas que comparten `numero_pedido`;
 * con un debounce se agrupan para mostrar UN solo aviso por pedido.
 *
 * El evento solo actúa como "ping": al recibirlo dispara un CustomEvent de
 * ventana que las páginas de pedidos escuchan para re-leer los datos por la API
 * (manteniendo el patrón BFF; Realtime no transporta los datos que se muestran).
 */
export function RealtimeOrders() {
  const router = useRouter();
  const pending = useRef<Set<string>>(new Set());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createBrowserSupabase();

    function flush() {
      const count = pending.current.size;
      pending.current.clear();
      timer.current = null;
      if (count === 0) return;

      toast.success(
        count === 1 ? "🛎️ Nuevo pedido recibido" : `🛎️ ${count} pedidos nuevos`,
        {
          description: "Entró por el chatbot o el canal de voz.",
          action: { label: "Ver", onClick: () => router.push("/pedidos") },
        }
      );

      window.dispatchEvent(new CustomEvent(PEDIDOS_CHANGED_EVENT));
    }

    const channel = supabase
      .channel("pedidos-nuevos")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "pedidos" },
        (payload) => {
          const row = payload.new as { numero_pedido?: string | null };
          pending.current.add(row?.numero_pedido ?? `row-${Date.now()}`);
          if (timer.current) clearTimeout(timer.current);
          timer.current = setTimeout(flush, 1000);
        }
      )
      .subscribe();

    return () => {
      if (timer.current) clearTimeout(timer.current);
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
