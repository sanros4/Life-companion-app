 
import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Task from '@/src/models/Task';

export async function GET() {
  await connectDB();
  const tasks = await Task.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: tasks });
}

export async function POST(req: Request) {
  await connectDB();
  const { text, date } = await req.json();
  const task = await Task.create({ userId: 'local', text, date });
  return NextResponse.json({ success: true, data: task });
}

export async function PATCH(req: Request) {
  await connectDB();
  const { id, completed } = await req.json();
  const task = await Task.findByIdAndUpdate(id, { completed }, { new: true });
  return NextResponse.json({ success: true, data: task });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await Task.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
