export const ICEGO_BUSINESS_ID =
  process.env.ICEGO_BUSINESS_ID ?? "11111111-1111-1111-1111-111111111111";

export type EstadoPedido =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "ENTREGADO"
  | "RECHAZADO"
  | "CANCELADO";

// Semáforo de estados. `dot` = color del punto, `chip` = clases del chip
// (low-contrast, según DESIGN.md: informar sin "semáforo agresivo").
export const ESTADO_CONFIG: Record<
  EstadoPedido,
  { label: string; dot: string; chip: string }
> = {
  PENDIENTE: {
    label: "Pendiente",
    dot: "bg-amber-400",
    chip: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  },
  CONFIRMADO: {
    label: "Confirmado",
    dot: "bg-sky-500",
    chip: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  },
  ENTREGADO: {
    label: "Entregado",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  },
  RECHAZADO: {
    label: "Rechazado",
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
  },
  CANCELADO: {
    label: "Cancelado",
    dot: "bg-slate-400",
    chip: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
  },
};

// Canal de entrada del cliente (Telegram / Voz).
export const CANAL_CONFIG: Record<string, { label: string; chip: string }> = {
  telegram: {
    label: "Telegram",
    chip: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900",
  },
  voz: {
    label: "Voz",
    chip: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900",
  },
};
