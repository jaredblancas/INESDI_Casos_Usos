"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Minus, Trash2, PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Producto } from "@/lib/types";

function stockChip(stock: number) {
  if (stock <= 0)
    return {
      label: "Agotado",
      cls: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
    };
  if (stock <= 5)
    return {
      label: "Stock bajo",
      cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
    };
  return {
    label: "Disponible",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  };
}

export default function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [form, setForm] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    stock: "",
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/productos");
      const json = await res.json();
      setProductos(json.productos ?? []);
    } catch {
      toast.error("No pudimos cargar el inventario");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function ajustarStock(p: Producto, delta: number) {
    const nuevo = Math.max(0, p.stock + delta);
    if (nuevo === p.stock) return;
    setBusy(p.id);
    // Optimista: el trigger de la BD recalcula 'disponible'.
    setProductos((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, stock: nuevo, disponible: nuevo > 0 } : x
      )
    );
    const res = await fetch(`/api/productos/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: nuevo }),
    });
    setBusy(null);
    if (!res.ok) {
      toast.error("No se pudo ajustar el stock");
      load();
    }
  }

  async function crear() {
    if (!form.nombre.trim() || form.precio === "" || form.stock === "") {
      toast.error("Nombre, precio y stock son requeridos");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: form.nombre,
        categoria: form.categoria || null,
        precio: Number(form.precio),
        stock: Number(form.stock),
      }),
    });
    setSaving(false);
    if (res.ok) {
      toast.success("Producto agregado");
      setOpen(false);
      setForm({ nombre: "", categoria: "", precio: "", stock: "" });
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error ?? "No se pudo crear el producto");
    }
  }

  async function eliminar(p: Producto) {
    if (!confirm(`¿Eliminar "${p.nombre}" del inventario?`)) return;
    const res = await fetch(`/api/productos/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Producto eliminado");
      setProductos((prev) => prev.filter((x) => x.id !== p.id));
    } else {
      toast.error("No se pudo eliminar");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventario"
        subtitle="Tus sabores, sus precios y cuánto te queda de cada uno"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <PackagePlus className="size-4" />
                Nuevo producto
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo producto</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Nombre</Label>
                <Input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Categoría</Label>
                <Input
                  value={form.categoria}
                  onChange={(e) =>
                    setForm({ ...form, categoria: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Precio</Label>
                  <Input
                    type="number"
                    value={form.precio}
                    onChange={(e) =>
                      setForm({ ...form, precio: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={crear} disabled={saving}>
                {saving ? "Guardando..." : "Guardar producto"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

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
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {productos.map((p) => {
                const chip = stockChip(p.stock);
                return (
                  <TableRow key={p.id} className="hover:bg-accent">
                    <TableCell className="font-medium">{p.nombre}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.categoria ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatMoney(p.precio)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          disabled={busy === p.id || p.stock <= 0}
                          onClick={() => ajustarStock(p, -1)}
                        >
                          <Minus className="size-3.5" />
                        </Button>
                        <span className="w-8 text-center tabular-nums">
                          {p.stock}
                        </span>
                        <Button
                          size="icon-sm"
                          variant="outline"
                          disabled={busy === p.id}
                          onClick={() => ajustarStock(p, 1)}
                        >
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          chip.cls
                        )}
                      >
                        {chip.label}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => eliminar(p)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
