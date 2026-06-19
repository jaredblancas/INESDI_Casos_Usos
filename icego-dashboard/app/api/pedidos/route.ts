import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";
import type { PedidoAgrupado, EstadoPedido } from "@/lib/types";

type Row = {
  id: string;
  numero_pedido: string | null;
  estado: EstadoPedido;
  cantidad: number;
  cliente_id: string | null;
  hora_recogida: string | null;
  rejection_reason: string | null;
  fecha_solicitud: string | null;
  productos: { nombre: string; precio: number } | null;
  clientes: { nombre: string | null } | null;
};

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("pedidos")
    .select(
      "id, numero_pedido, estado, cantidad, cliente_id, hora_recogida, rejection_reason, fecha_solicitud, productos(nombre, precio), clientes(nombre)"
    )
    .eq("business_id", ICEGO_BUSINESS_ID)
    .order("fecha_solicitud", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Multi-producto: varias filas comparten numero_pedido → agrupar en 1 pedido.
  const map = new Map<string, PedidoAgrupado>();
  for (const row of (data ?? []) as unknown as Row[]) {
    const numero = row.numero_pedido ?? row.id;
    const precio = row.productos?.precio ?? 0;
    if (!map.has(numero)) {
      map.set(numero, {
        numero_pedido: numero,
        estado: row.estado,
        cliente_id: row.cliente_id,
        cliente_nombre: row.clientes?.nombre ?? null,
        hora_recogida: row.hora_recogida,
        rejection_reason: row.rejection_reason,
        fecha_solicitud: row.fecha_solicitud,
        total: 0,
        lineas: [],
      });
    }
    const grp = map.get(numero)!;
    grp.lineas.push({
      producto: row.productos?.nombre ?? "—",
      cantidad: row.cantidad,
      precio,
    });
    grp.total += precio * row.cantidad;
  }

  return NextResponse.json({ pedidos: Array.from(map.values()) });
}
