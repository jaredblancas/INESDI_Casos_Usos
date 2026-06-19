import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { ICEGO_BUSINESS_ID } from "@/lib/constants";

export async function GET() {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("faqs")
    .select("id, business_id, topic, respuesta")
    .eq("business_id", ICEGO_BUSINESS_ID)
    .order("topic");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ faqs: data });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { topic, respuesta } = body ?? {};
  if (!topic || !respuesta) {
    return NextResponse.json(
      { error: "El tema y la respuesta son requeridos" },
      { status: 400 }
    );
  }
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("faqs")
    .insert({ business_id: ICEGO_BUSINESS_ID, topic, respuesta })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ faq: data }, { status: 201 });
}
