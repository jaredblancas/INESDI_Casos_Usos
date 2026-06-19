"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  ShoppingBag,
  Wallet,
  Receipt,
  CalendarClock,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { CanalBadge } from "@/components/canal-badge";
import { SemaforoBadge } from "@/components/semaforo-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staggerContainer } from "@/lib/motion";
import { formatMoney, formatDate } from "@/lib/format";
import type { ClienteDetalle } from "@/lib/types";

function iniciales(nombre: string | null): string {
  if (!nombre) return "?";
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function ClienteDetallePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    canal: "",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/clientes/${id}`);
      if (!res.ok) {
        toast.error("Cliente no encontrado");
        router.replace("/crm");
        return;
      }
      const json: ClienteDetalle = await res.json();
      setData(json);
      setForm({
        nombre: json.cliente.nombre ?? "",
        telefono: json.cliente.telefono ?? "",
        email: json.cliente.email ?? "",
        canal: json.cliente.canal ?? "",
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function guardar() {
    setSaving(true);
    const res = await fetch(`/api/clientes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Datos actualizados");
      setEditing(false);
      load();
    } else {
      toast.error("No se pudo guardar");
    }
  }

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const { cliente, stats, pedidos } = data;

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.push("/crm")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a clientes
      </button>

      {/* Perfil */}
      <Card className="shadow-[var(--shadow-glacier-sm)]">
        <CardContent className="flex flex-wrap items-center gap-4 p-5">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {iniciales(cliente.nombre)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-semibold tracking-tight">
              {cliente.nombre ?? "Sin nombre"}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <CanalBadge canal={cliente.canal} />
              <span>{cliente.telefono ?? "Sin teléfono"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard label="Pedidos" value={stats.total_pedidos} icon={ShoppingBag} />
        <StatCard
          label="Total gastado"
          value={formatMoney(stats.total_gastado)}
          icon={Wallet}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          label="Ticket promedio"
          value={formatMoney(stats.ticket_promedio)}
          icon={Receipt}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Último pedido"
          value={formatDate(stats.ultimo_pedido)}
          icon={CalendarClock}
          iconClassName="bg-violet-500/10 text-violet-600 dark:text-violet-400"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Datos editables */}
        <Card className="shadow-[var(--shadow-glacier-sm)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Datos del cliente</CardTitle>
            {editing ? (
              <div className="flex gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      nombre: cliente.nombre ?? "",
                      telefono: cliente.telefono ?? "",
                      email: cliente.email ?? "",
                      canal: cliente.canal ?? "",
                    });
                  }}
                >
                  <X className="size-4" />
                </Button>
                <Button size="icon-sm" onClick={guardar} disabled={saving}>
                  <Check className="size-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                <Pencil className="size-3.5" />
                Editar
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Campo
              label="Nombre"
              editing={editing}
              value={form.nombre}
              display={cliente.nombre}
              onChange={(v) => setForm({ ...form, nombre: v })}
            />
            <Campo
              label="Teléfono"
              editing={editing}
              value={form.telefono}
              display={cliente.telefono}
              onChange={(v) => setForm({ ...form, telefono: v })}
            />
            <Campo
              label="Correo"
              editing={editing}
              value={form.email}
              display={cliente.email}
              onChange={(v) => setForm({ ...form, email: v })}
            />
            <div className="space-y-1.5">
              <Label className="text-muted-foreground">Canal</Label>
              {editing ? (
                <Select
                  value={form.canal || "telegram"}
                  onValueChange={(v) => setForm({ ...form, canal: v ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="telegram">Telegram</SelectItem>
                    <SelectItem value="voz">Voz</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div>
                  <CanalBadge canal={cliente.canal} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historial */}
        <Card className="shadow-[var(--shadow-glacier-sm)]">
          <CardHeader>
            <CardTitle className="text-base">Historial de pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            {pedidos.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Este cliente aún no tiene pedidos.
              </p>
            ) : (
              <ul className="divide-y">
                {pedidos.map((p) => (
                  <li
                    key={p.numero_pedido}
                    className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <SemaforoBadge estado={p.estado} />
                        <span className="text-xs text-muted-foreground">
                          {formatDate(p.fecha_solicitud)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">
                        {p.lineas
                          .map((l) => `${l.producto} ×${l.cantidad}`)
                          .join(" · ")}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold tabular-nums">
                      {formatMoney(p.total)}
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

function Campo({
  label,
  editing,
  value,
  display,
  onChange,
}: {
  label: string;
  editing: boolean;
  value: string;
  display: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground">{label}</Label>
      {editing ? (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <p className="text-sm">{display ?? "—"}</p>
      )}
    </div>
  );
}
