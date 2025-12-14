import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

type BookmarkDoc = {
  _id?: ObjectId;
  name: string;
  url: string;
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
};

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection<BookmarkDoc>("bookmarks").find({}).sort({ name: 1 }).toArray();

    const bookmarks = docs.map((doc) => ({
      id: String(doc._id),
      name: doc.name,
      url: doc.url,
      tags: doc.tags ?? [],
    }));

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error("Failed to load bookmarks", error);
    return NextResponse.json({ error: "Failed to load bookmarks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name : "";
    const url = typeof body?.url === "string" ? body.url : "";
    const tags = Array.isArray(body?.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [];

    if (!name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const db = await getDb();
    const doc: BookmarkDoc = {
      name,
      url,
      tags,
      createdAt: new Date(),
    };
    const result = await db.collection<BookmarkDoc>("bookmarks").insertOne(doc);

    return NextResponse.json({
      bookmark: { id: String(result.insertedId), name, url, tags },
    });
  } catch (error) {
    console.error("Failed to save bookmark", error);
    return NextResponse.json({ error: "Failed to save bookmark" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body?.id;
    const name = typeof body?.name === "string" ? body.name : "";
    const url = typeof body?.url === "string" ? body.url : "";
    const tags = Array.isArray(body?.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [];

    if (!id || !name.trim()) {
      return NextResponse.json({ error: "id and name are required" }, { status: 400 });
    }

    const db = await getDb();
    const _id = new ObjectId(id);
    await db
      .collection<BookmarkDoc>("bookmarks")
      .updateOne({ _id }, { $set: { name, url, tags, updatedAt: new Date() } });

    return NextResponse.json({
      bookmark: { id, name, url, tags },
    });
  } catch (error) {
    console.error("Failed to update bookmark", error);
    return NextResponse.json({ error: "Failed to update bookmark" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }
    const db = await getDb();
    await db.collection("bookmarks").deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete bookmark", error);
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
  }
}
