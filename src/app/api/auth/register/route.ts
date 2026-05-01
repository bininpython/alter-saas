import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function POST(req: Request) {
  try {
    const { email, password, name, whatsapp } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        whatsapp,
      },
    });

    const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: "30d" });
    return NextResponse.json({ token, user: { id: user.id, name, email } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
