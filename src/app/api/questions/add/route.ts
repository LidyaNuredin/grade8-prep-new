import { NextResponse } from "next/server";
import { db } from "@/db/mysql";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examType, subject, year, text, options, answer, explanation } = body;

    if (!examType || !subject || !year || !text || !options || !answer || !explanation) {
      return NextResponse.json({ success: false, error: "All input fields are required" }, { status: 400 });
    }

    const joinedOptions = options.join("|||");
    const id = crypto.randomUUID(); 

    const query = `
      INSERT INTO Question (id, examType, subject, year, text, options, answer, explanation, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await db.execute(query, [
      id,
      examType.toLowerCase(),
      subject.toLowerCase(),
      year.toString(),
      text,
      joinedOptions,
      answer,
      explanation
    ]);

    return NextResponse.json({ success: true, message: "Saved perfectly!" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}