import { NextResponse } from "next/server";
import { db } from "@/db/mysql"; // Clean, direct import from our new db folder

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, year, text, options, answer } = body;

    // 1. Validation check
    if (!subject || !year || !text || !options || !answer) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // 2. Format options array into a single string separated by '|||'
    const joinedOptions = options.join("|||");
    const id = crypto.randomUUID(); // Native unique ID generation

    // 3. Insert directly into your local XAMPP MySQL database
    const query = `
      INSERT INTO Question (id, subject, year, text, options, answer, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await db.execute(query, [
      id,
      subject.toLowerCase(),
      year.toString(),
      text,
      joinedOptions,
      answer
    ]);

    return NextResponse.json({ 
      success: true, 
      message: "Question saved directly to MySQL!",
      id 
    });

  } catch (error: any) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}