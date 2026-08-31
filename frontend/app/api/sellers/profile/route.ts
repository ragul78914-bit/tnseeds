import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SELLERS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(MOCK_SELLERS[0]);
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ ...MOCK_SELLERS[0], ...body, message: 'Profile updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Update failed' }, { status: 400 });
  }
}
