 
import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Mood from '@/src/models/Mood';

export async function GET() {
  await connectDB();
  const moods = await Mood.find({}).sort({ createdAt: -1 }).limit(30);
  return NextResponse.json({ success: true, data: moods });
}

export async function POST(req: Request) {
  await connectDB();
  const { mood, note, date } = await req.json();
  const entry = await Mood.create({ userId: 'local', mood, note, date });
  return NextResponse.json({ success: true, data: entry });
}
