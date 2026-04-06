import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import User from '@/src/models/User';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Connection failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const user = await User.create(body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Could not create user' }, { status: 500 });
  }
}
