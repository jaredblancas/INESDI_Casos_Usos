import { ESTADO_CONFIG, type EstadoPedido } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SemaforoBadge({ estado }: { estado: EstadoPedido }) {
  const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.CANCELADO;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.chip
      )}
    >
      <span className={cn("size-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
