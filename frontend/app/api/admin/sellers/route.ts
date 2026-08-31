import { NextResponse } from 'next/server';
import { ALL_MOCK_SEEDS, MOCK_SELLERS } from '@/lib/mockData';

export async function GET() {
  const sellersWithCount = MOCK_SELLERS.map(s => ({
    ...s,
    seedsCount: ALL_MOCK_SEEDS.filter(seed => seed.sellerId === s._id).length
  }));
  return NextResponse.json(sellersWithCount);
}
