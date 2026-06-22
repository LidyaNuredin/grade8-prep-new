import { NextResponse } from "next/server";
import { db } from "@/db/mysql";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const examType = searchParams.get("examType");
    const subject = searchParams.get("subject");
    const year = searchParams.get("year");

    if (!examType || !subject || !year) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    const [rows] = await db.execute(
      "SELECT id, examType, subject, year, text, options, answer, explanation FROM Question WHERE examType = ? AND subject = ? AND year = ? ORDER BY createdAt ASC",
      [examType.toLowerCase(), subject.toLowerCase(), year.toString()]
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}