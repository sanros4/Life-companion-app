import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import JournalEntry from '@/src/models/JournalEntry';

export async function GET() {
  await connectDB();
  const entries = await JournalEntry.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: entries });
}

export async function POST(req: Request) {
  await connectDB();
  const { title, content, mood, date } = await req.json();
  const entry = await JournalEntry.create({ userId: 'local', title, content, mood, date });
  return NextResponse.json({ success: true, data: entry });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await JournalEntry.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
