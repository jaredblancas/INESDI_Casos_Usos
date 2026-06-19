"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Users, Megaphone, Receipt, Search, Plus, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { CanalBadge } from "@/components/canal-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { staggerContainer } from "@/lib/motion";
import { formatMoney } from "@/lib/format";
import { CANAL_CONFIG } from "@/lib/constants";
import type { ClienteConStats } from "@/lib/types";

function iniciales(nombre: string | null): string {
  if (!nombre) return "?";
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function CrmPage() {
  const [clientes, setClientes] = useState<ClienteConStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    canal: "telegram",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/clientes");
      const json = await res.json();
      setClientes(json.clientes ?? []);
    } catch {
      toast.error("No pudimos cargar los clientes");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const resumen = useMemo(() => {
    const total = clientes.length;
    const totalPedidos = clientes.reduce((a, c) => a + c.total_pedidos, 0);
    const totalGastado = clientes.reduce((a, c) => a + c.total_gastado, 0);
    const canales = clientes.reduce<Record<string, number>>((acc, c) => {
      const k = (c.canal ?? "—").toLowerCase();
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});
    const principal = Object.entries(canales).sort((a, b) => b[1] - a[1])[0];
    const canalLabel = principal
      ? CANAL_CONFIG[principal[0]]?.label ?? "—"
      : "—";
    const canalPct = principal && total ? Math.round((principal[1] / total) * 100) : 0;
    return {
      total,
      canalLabel,
      canalPct,
      ticket: totalPedidos ? totalGastado / totalPedidos : 0,
    };
  }, [clientes]);

  const visibles = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        (c.nombre ?? "").toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        (c.telefono ?? "").toLowerCase().includes(q)
    );
  }, [clientes, query]);

  async function crear() {
    if (!form.nombre.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Cliente agregado");
      setOpen(false);
      setForm({ nombre: "", telefono: "", email: "", canal: "telegram" });
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error ?? "No se pudo crear el cliente");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        subtitle="Quién te compra, por qué canal y cuánto vale cada relación"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, correo o teléfono"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-72 pl-9"
          />
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="size-4" />
                Nuevo cliente
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Teléfono</Label>
                  <Input
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Canal</Label>
                  <Select
                    value={form.canal}
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
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Correo</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={crear} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cliente"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard label="Clientes totales" value={resumen.total} icon={Users} />
        <StatCard
          label="Canal principal"
          value={resumen.canalLabel}
          hint={resumen.total ? `${resumen.canalPct}% de tus clientes` : undefined}
          icon={Megaphone}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
        <StatCard
          label="Ticket promedio"
          value={formatMoney(resumen.ticket)}
          icon={Receipt}
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />
      </motion.div>

      <Card className="overflow-hidden p-0 shadow-[var(--shadow-glacier-sm)]">
        {loading ? (
          <div className="space-y-3 p-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Cliente</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead className="text-right">Pedidos</TableHead>
                <TableHead className="text-right">Total gastado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibles.map((c) => (
                <TableRow
                  key={c.id}
                  className="group cursor-pointer transition-colors hover:bg-accent"
                >
                  <TableCell>
                    <Link
                      href={`/crm/${c.id}`}
                      className="flex items-center gap-3"
                    >
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {iniciales(c.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{c.nombre ?? "Sin nombre"}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.telefono ?? "—"}
                  </TableCell>
                  <TableCell>
                    <CanalBadge canal={c.canal} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {c.email ?? "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {c.total_pedidos}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {formatMoney(c.total_gastado)}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/crm/${c.id}`}
                      className="flex justify-end text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                    >
                      <ChevronRight className="size-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {visibles.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-sm text-muted-foreground"
                  >
                    No encontramos clientes con esa búsqueda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
