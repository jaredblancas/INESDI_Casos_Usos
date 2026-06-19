import { Send, Mic } from "lucide-react";
import { CANAL_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CanalBadge({ canal }: { canal: string | null }) {
  const key = (canal ?? "").toLowerCase();
  const cfg = CANAL_CONFIG[key];
  if (!cfg) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  const Icon = key === "voz" ? Mic : Send;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        cfg.chip
      )}
    >
      <Icon className="size-3" />
      {cfg.label}
    </span>
  );
}
