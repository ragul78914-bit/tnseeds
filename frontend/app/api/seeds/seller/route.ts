import { NextResponse } from 'next/server';
import { ALL_MOCK_SEEDS } from '@/lib/mockData';

export async function GET() {
  const sellerSeeds = ALL_MOCK_SEEDS.filter(s => s.sellerId === 's_1');
  return NextResponse.json(sellerSeeds);
}
