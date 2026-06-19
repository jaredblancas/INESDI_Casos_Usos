"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  Wallet,
  Users,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { SemaforoBadge } from "@/components/semaforo-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer } from "@/lib/motion";
import { formatMoney, formatDateTime } from "@/lib/format";
import { PEDIDOS_CHANGED_EVENT } from "@/lib/realtime";
import type { EstadoPedido } from "@/lib/constants";

interface Resumen {
  kpis: {
    pedidosHoy: number;
    pendientes: number;
    ingresos: number;
    clientes: number;
  };
  actividad: {
    numero_pedido: string;
    cliente: string | null;
    estado: EstadoPedido;
    total: number;
    fecha: string | null;
  }[];
  inventarioCritico: { id: string; nombre: string; stock: number }[];
}

export default function InicioPage() {
  const [data, setData] = useState<Resumen | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/resumen");
        const json = await res.json();
        setData(json);
      } finally {
        setLoading(false);
      }
    }
    load();
    // Refresca KPIs y actividad cuando entra un pedido nuevo (Realtime).
    const onChange = () => load();
    window.addEventListener(PEDIDOS_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(PEDIDOS_CHANGED_EVENT, onChange);
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hola de nuevo 👋"
        subtitle="Así va tu heladería hoy"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Pedidos hoy"
          value={data.kpis.pedidosHoy}
          icon={ShoppingBag}
        />
        <StatCard
          label="Pendientes"
          value={data.kpis.pendientes}
          icon={Clock}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Ingresos confirmados"
          value={formatMoney(data.kpis.ingresos)}
          icon={Wallet}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Clientes"
          value={data.kpis.clientes}
          icon={Users}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="shadow-[var(--shadow-glacier-sm)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Actividad reciente</CardTitle>
            <Link
              href="/pedidos"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Ver todos
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.actividad.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Sin pedidos todavía.
              </p>
            ) : (
              <ul className="divide-y">
                {data.actividad.map((a) => (
                  <li
                    key={a.numero_pedido}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {a.cliente ?? "Cliente"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(a.fecha)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <SemaforoBadge estado={a.estado} />
                      <span className="w-16 text-right text-sm font-semibold tabular-nums">
                        {formatMoney(a.total)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-glacier-sm)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Inventario crítico</CardTitle>
            <Link
              href="/inventario"
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Gestionar
              <ArrowRight className="size-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {data.inventarioCritico.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Todo tu inventario está en buen nivel.
              </p>
            ) : (
              <ul className="space-y-2">
                {data.inventarioCritico.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm dark:border-amber-900 dark:bg-amber-950/30"
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
                      {p.nombre}
                    </span>
                    <span className="font-semibold tabular-nums text-amber-700 dark:text-amber-300">
                      {p.stock === 0 ? "Agotado" : `${p.stock} restantes`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
