import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("productos")
    .select("id, business_id, nombre, categoria, precio, stock, disponible")
    .eq("business_id", ICEGO_BUSINESS_ID)
    .order("nombre");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ productos: data });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { nombre, categoria, precio, stock } = body ?? {};
  if (!nombre || precio == null || stock == null) {
    return NextResponse.json(
      { error: "Nombre, precio y stock son requeridos" },
      { status: 400 }
    );
  }
  const supabase = createServerSupabase();
  // No se escribe 'disponible': el trigger trg_sync_disponible lo sincroniza.
  const { data, error } = await supabase
    .from("productos")
    .insert({
      business_id: ICEGO_BUSINESS_ID,
      nombre,
      categoria: categoria ?? null,
      precio: Number(precio),
      stock: Number(stock),
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ producto: data }, { status: 201 });
}
