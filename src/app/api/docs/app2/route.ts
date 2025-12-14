import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const DOC_ID = "app2-doc";

type DocRecord = {
  _id: string;
  html?: string;
  updatedAt?: Date;
};

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection<DocRecord>("docs").findOne({ _id: DOC_ID });
    return NextResponse.json({ html: doc?.html ?? "" });
  } catch (error) {
    console.error("Failed to load app2 doc", error);
    return NextResponse.json({ error: "Failed to load document" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const html = body?.html;

    if (typeof html !== "string") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const db = await getDb();
    await db
      .collection<DocRecord>("docs")
      .updateOne({ _id: DOC_ID }, { $set: { html, updatedAt: new Date() } }, { upsert: true });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save app2 doc", error);
    return NextResponse.json({ error: "Failed to save document" }, { status: 500 });
  }
}
