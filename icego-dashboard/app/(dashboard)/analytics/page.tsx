"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { TrendingUp, CheckCircle2, PackageCheck, Percent } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { staggerContainer } from "@/lib/motion";

interface AnalyticsData {
  demanda: { nombre: string; unidades: number }[];
  embudo: { etapa: string; valor: number }[];
  motivos: { motivo: string; total: number }[];
  resumen: {
    recibidos: number;
    confirmados: number;
    entregados: number;
    tasaConversion: number;
  };
}

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--popover-foreground)",
  fontSize: "0.8rem",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/analytics");
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } catch {
        toast.error("No pudimos cargar la analítica");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analítica de demanda"
        subtitle="Qué se pide, qué se concreta y por qué se cae un pedido"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          label="Pedidos recibidos"
          value={data.resumen.recibidos}
          icon={TrendingUp}
        />
        <StatCard
          label="Confirmados"
          value={data.resumen.confirmados}
          icon={CheckCircle2}
          iconClassName="bg-sky-500/10 text-sky-600 dark:text-sky-400"
        />
        <StatCard
          label="Entregados"
          value={data.resumen.entregados}
          icon={PackageCheck}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Tasa de conversión"
          value={`${data.resumen.tasaConversion}%`}
          icon={Percent}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-glacier-sm)]">
          <CardHeader>
            <CardTitle className="text-base">Productos más pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={data.demanda}
                layout="vertical"
                margin={{ left: 12, right: 16 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  type="number"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="nombre"
                  width={110}
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                />
                <Bar
                  dataKey="unidades"
                  fill="var(--chart-1)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-[var(--shadow-glacier-sm)]">
          <CardHeader>
            <CardTitle className="text-base">Embudo de conversión</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data.embudo} margin={{ left: 0, right: 16 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="etapa"
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "var(--accent)", opacity: 0.4 }}
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                  {data.embudo.map((_, i) => (
                    <Cell key={i} fill={`var(--chart-${i + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-[var(--shadow-glacier-sm)]">
        <CardHeader>
          <CardTitle className="text-base">Motivos de rechazo</CardTitle>
        </CardHeader>
        <CardContent>
          {data.motivos.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Todavía no hay pedidos rechazados. 🎉
            </p>
          ) : (
            <ul className="space-y-3">
              {data.motivos.map((m) => {
                const max = data.motivos[0].total || 1;
                const pct = Math.round((m.total / max) * 100);
                return (
                  <li key={m.motivo} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{m.motivo}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {m.total}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
