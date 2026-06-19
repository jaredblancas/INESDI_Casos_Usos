"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Clock, PackageCheck, Inbox } from "lucide-react";
import { SemaforoBadge } from "@/components/semaforo-badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ESTADO_CONFIG, type EstadoPedido } from "@/lib/constants";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PEDIDOS_CHANGED_EVENT } from "@/lib/realtime";
import type { PedidoAgrupado } from "@/lib/types";

const FILTROS: ("TODOS" | EstadoPedido)[] = [
  "TODOS",
  "PENDIENTE",
  "CONFIRMADO",
  "ENTREGADO",
  "RECHAZADO",
  "CANCELADO",
];

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<PedidoAgrupado[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<"TODOS" | EstadoPedido>("TODOS");
  const [updating, setUpdating] = useState<string | null>(null);

  async function load({ silent = false }: { silent?: boolean } = {}) {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/pedidos");
      const json = await res.json();
      setPedidos(json.pedidos ?? []);
    } catch {
      if (!silent) toast.error("No pudimos cargar los pedidos");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // Refresca la lista en vivo cuando RealtimeOrders detecta un pedido nuevo.
    const onChange = () => load({ silent: true });
    window.addEventListener(PEDIDOS_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(PEDIDOS_CHANGED_EVENT, onChange);
  }, []);

  async function cambiarEstado(numero: string, estado: EstadoPedido) {
    setUpdating(numero);
    const res = await fetch(`/api/pedidos/${encodeURIComponent(numero)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    });
    setUpdating(null);
    if (res.ok) {
      toast.success(
        estado === "ENTREGADO" ? "Pedido entregado" : "Pedido actualizado"
      );
      setPedidos((prev) =>
        prev.map((p) => (p.numero_pedido === numero ? { ...p, estado } : p))
      );
    } else {
      toast.error("No se pudo actualizar el pedido");
    }
  }

  const visibles =
    filtro === "TODOS" ? pedidos : pedidos.filter((p) => p.estado === filtro);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pedidos"
        subtitle="Sigue cada pedido desde que entra hasta que el cliente lo recoge"
      >
        <Select
          value={filtro}
          onValueChange={(v) => setFiltro(v as typeof filtro)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTROS.map((f) => (
              <SelectItem key={f} value={f}>
                {f === "TODOS"
                  ? "Todos los estados"
                  : ESTADO_CONFIG[f as EstadoPedido].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : visibles.length === 0 ? (
        <EmptyPedidos />
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visibles.map((p) => (
            <motion.div key={p.numero_pedido} variants={fadeUp}>
              <Card className="relative gap-0 overflow-hidden py-0 shadow-[var(--shadow-glacier-sm)] transition-shadow hover:shadow-[var(--shadow-glacier-md)]">
                <div
                  className={cn(
                    "h-1 w-full",
                    ESTADO_CONFIG[p.estado]?.dot ?? "bg-muted"
                  )}
                />
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {p.cliente_nombre ?? "Cliente"}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {p.numero_pedido}
                      </p>
                    </div>
                    <SemaforoBadge estado={p.estado} />
                  </div>

                  <ul className="space-y-0.5 text-sm text-muted-foreground">
                    {p.lineas.map((l, j) => (
                      <li key={j} className="flex justify-between gap-2">
                        <span className="truncate">{l.producto}</span>
                        <span className="shrink-0 tabular-nums">
                          ×{l.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between border-t pt-3 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="size-3.5" />
                      {p.hora_recogida ?? "Sin hora"}
                    </span>
                    <span className="font-semibold tabular-nums">
                      {formatMoney(p.total)}
                    </span>
                  </div>

                  {p.estado === "RECHAZADO" && p.rejection_reason && (
                    <p className="rounded-md bg-rose-50 px-2.5 py-1.5 text-xs text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                      {p.rejection_reason}
                    </p>
                  )}

                  {p.estado === "CONFIRMADO" && (
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={updating === p.numero_pedido}
                      onClick={() =>
                        cambiarEstado(p.numero_pedido, "ENTREGADO")
                      }
                    >
                      <PackageCheck className="size-4" />
                      Marcar como entregado
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function EmptyPedidos() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Inbox className="size-6" />
      </div>
      <div>
        <p className="font-medium">Nada por aquí todavía</p>
        <p className="text-sm text-muted-foreground">
          Los pedidos de este estado aparecerán en esta vista.
        </p>
      </div>
    </div>
  );
}
