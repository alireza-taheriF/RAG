import { NextResponse } from "next/server";
import { ask, getEngine, RAG_CONFIGS } from "@/rag/engine";

export async function POST(request: Request) {
  let body: { query?: string; configId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنهٔ JSON نامعتبر است." }, { status: 400 });
  }
  const query = body.query?.trim() ?? "";
  if (query.length < 3) {
    return NextResponse.json({ error: "سؤال باید حداقل سه نویسه باشد." }, { status: 400 });
  }
  if (query.length > 500) {
    return NextResponse.json({ error: "سؤال خیلی بلند است." }, { status: 400 });
  }
  const result = ask(query, body.configId ?? "hybrid-k6");
  return NextResponse.json({ result, configs: RAG_CONFIGS });
}

export async function GET() {
  const engine = getEngine();
  return NextResponse.json({
    configs: RAG_CONFIGS,
    documents: new Set(engine.chunks.map((c) => c.docId)).size,
    chunks: engine.chunks.length,
  });
}
