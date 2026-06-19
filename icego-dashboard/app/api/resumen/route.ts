import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";
import type { EstadoPedido } from "@/lib/constants";

type Row = {
  numero_pedido: string | null;
  estado: EstadoPedido;
  cantidad: number;
  fecha_solicitud: string | null;
  productos: { nombre: string; precio: number } | null;
  clientes: { nombre: string | null } | null;
};

export async function GET() {
  const supabase = createServerSupabase();

  const [pedidosRes, productosRes, clientesRes] = await Promise.all([
    supabase
      .from("pedidos")
      .select(
        "numero_pedido, estado, cantidad, fecha_solicitud, productos(nombre, precio), clientes(nombre)"
      )
      .eq("business_id", ICEGO_BUSINESS_ID)
      .order("fecha_solicitud", { ascending: false }),
    supabase
      .from("productos")
      .select("id, nombre, stock, precio")
      .eq("business_id", ICEGO_BUSINESS_ID),
    supabase
      .from("clientes")
      .select("id", { count: "exact", head: true })
      .eq("business_id", ICEGO_BUSINESS_ID),
  ]);

  if (pedidosRes.error)
    return NextResponse.json({ error: pedidosRes.error.message }, { status: 500 });

  const rows = (pedidosRes.data ?? []) as unknown as Row[];

  // Agrupa por numero_pedido (multi-producto).
  const pedidos = new Map<
    string,
    {
      estado: EstadoPedido;
      cliente: string | null;
      fecha: string | null;
      total: number;
    }
  >();
  for (const r of rows) {
    const numero = r.numero_pedido ?? Math.random().toString();
    const precio = r.productos?.precio ?? 0;
    if (!pedidos.has(numero)) {
      pedidos.set(numero, {
        estado: r.estado,
        cliente: r.clientes?.nombre ?? null,
        fecha: r.fecha_solicitud,
        total: 0,
      });
    }
    pedidos.get(numero)!.total += precio * r.cantidad;
  }

  const hoy = new Date().toISOString().slice(0, 10);
  let pedidosHoy = 0;
  let pendientes = 0;
  let ingresos = 0;
  for (const p of pedidos.values()) {
    if (p.fecha?.slice(0, 10) === hoy) pedidosHoy++;
    if (p.estado === "PENDIENTE") pendientes++;
    if (p.estado === "CONFIRMADO" || p.estado === "ENTREGADO") ingresos += p.total;
  }

  const actividad = Array.from(pedidos.entries())
    .slice(0, 6)
    .map(([numero, p]) => ({
      numero_pedido: numero,
      cliente: p.cliente,
      estado: p.estado,
      total: p.total,
      fecha: p.fecha,
    }));

  const inventarioCritico = (productosRes.data ?? [])
    .filter((p) => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .map((p) => ({ id: p.id, nombre: p.nombre, stock: p.stock }));

  return NextResponse.json({
    kpis: {
      pedidosHoy,
      pendientes,
      ingresos,
      clientes: clientesRes.count ?? 0,
    },
    actividad,
    inventarioCritico,
  });
}
