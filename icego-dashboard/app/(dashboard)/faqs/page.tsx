"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { staggerContainer, fadeUp } from "@/lib/motion";
import type { Faq } from "@/lib/types";

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState({ topic: "", respuesta: "" });

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/faqs");
      const json = await res.json();
      setFaqs(json.faqs ?? []);
    } catch {
      toast.error("No pudimos cargar las preguntas");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function nueva() {
    setEditing(null);
    setForm({ topic: "", respuesta: "" });
    setOpen(true);
  }
  function editar(f: Faq) {
    setEditing(f);
    setForm({ topic: f.topic, respuesta: f.respuesta });
    setOpen(true);
  }

  async function guardar() {
    if (!form.topic.trim() || !form.respuesta.trim()) {
      toast.error("El tema y la respuesta son requeridos");
      return;
    }
    setSaving(true);
    const url = editing ? `/api/faqs/${editing.id}` : "/api/faqs";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      toast.success(editing ? "Pregunta actualizada" : "Pregunta agregada");
      setOpen(false);
      load();
    } else {
      const j = await res.json().catch(() => ({}));
      toast.error(j.error ?? "No se pudo guardar");
    }
  }

  async function eliminar(f: Faq) {
    if (!confirm(`¿Eliminar la pregunta "${f.topic}"?`)) return;
    const res = await fetch(`/api/faqs/${f.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Pregunta eliminada");
      setFaqs((prev) => prev.filter((x) => x.id !== f.id));
    } else {
      toast.error("No se pudo eliminar");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preguntas frecuentes"
        subtitle="Lo que tu chatbot responde a los clientes"
      >
        <Button onClick={nueva}>
          <Plus className="size-4" />
          Nueva pregunta
        </Button>
      </PageHeader>

      <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <p className="text-muted-foreground">
          Tu chatbot consulta estas respuestas en tiempo real. Cada cambio que
          guardes aquí se aplica de inmediato en las conversaciones.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Aún no has agregado preguntas. Crea la primera para tu chatbot.
        </p>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2"
        >
          {faqs.map((f) => (
            <motion.div key={f.id} variants={fadeUp}>
              <Card className="group h-full shadow-[var(--shadow-glacier-sm)] transition-shadow hover:shadow-[var(--shadow-glacier-md)]">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <CardTitle className="text-base">{f.topic}</CardTitle>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => editar(f)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => eliminar(f)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {f.respuesta}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar pregunta" : "Nueva pregunta"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Tema</Label>
              <Input
                placeholder="Ej. Horario de atención"
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Respuesta</Label>
              <Textarea
                rows={4}
                placeholder="Lo que el chatbot dirá al cliente"
                value={form.respuesta}
                onChange={(e) => setForm({ ...form, respuesta: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={guardar} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
