import { NextResponse } from 'next/server';
import { MOCK_SELLERS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    _id: 'u_seller1',
    name: 'Sri Lakshmi Seeds',
    email: 'seller@example.com',
    role: 'SELLER',
    seller: MOCK_SELLERS[0]
  });
}
