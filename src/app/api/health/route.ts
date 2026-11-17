import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "SaharaCare MVP",
    stage: "1 - Project Foundation",
    timestamp: new Date().toISOString(),
  });
}
