import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import SelfCare from '@/src/models/SelfCare';

export async function GET() {
  await connectDB();
  const today = new Date().toISOString().split('T')[0];
  const items = await SelfCare.find({ date: today }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const item = await SelfCare.create({ userId: 'local', ...body });
  return NextResponse.json({ success: true, data: item });
}

export async function PATCH(req: Request) {
  await connectDB();
  const { id, completed } = await req.json();
  const item = await SelfCare.findByIdAndUpdate(id, { completed }, { new: true });
  return NextResponse.json({ success: true, data: item });
}

export async function DELETE(req: Request) {
  await connectDB();
  const { id } = await req.json();
  await SelfCare.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
