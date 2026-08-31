import { NextResponse } from 'next/server';
import { ALL_MOCK_SEEDS, MOCK_SELLERS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    totalSellers: MOCK_SELLERS.length,
    activeSellers: MOCK_SELLERS.filter(s => s.status === 'ACTIVE').length,
    totalSeeds: ALL_MOCK_SEEDS.length,
    availableStockKg: ALL_MOCK_SEEDS.reduce((acc, s) => acc + s.availableQuantity, 0),
    totalValueInCirculation: 1250000,
    districtsCovered: 5
  });
}
