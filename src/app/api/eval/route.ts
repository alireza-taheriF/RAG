import { NextResponse } from "next/server";
import { compactHarness, runHarness, type CompactHarness } from "@/rag/harness";

let cached: CompactHarness | null = null;

function run() {
  cached = compactHarness(runHarness());
  return cached;
}

export async function GET() {
  return NextResponse.json(cached ?? run());
}

export async function POST() {
  return NextResponse.json(run());
}
