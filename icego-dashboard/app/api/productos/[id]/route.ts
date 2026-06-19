import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const update: Record<string, unknown> = {};
  for (const k of ["nombre", "categoria", "precio", "stock"] as const) {
    if (body[k] !== undefined) update[k] = body[k];
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
  }
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("productos")
    .update(update)
    .eq("business_id", ICEGO_BUSINESS_ID)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("productos")
    .delete()
    .eq("business_id", ICEGO_BUSINESS_ID)
    .eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
