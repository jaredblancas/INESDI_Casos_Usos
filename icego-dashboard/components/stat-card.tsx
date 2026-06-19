"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  iconClassName?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  iconClassName,
}: StatCardProps) {
  return (
    <motion.div variants={fadeUp}>
      <Card className="flex flex-row items-center gap-4 p-5 shadow-[var(--shadow-glacier-sm)]">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary",
            iconClassName
          )}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-2xl font-semibold tracking-tight">
            {value}
          </p>
          {hint && (
            <p className="truncate text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
