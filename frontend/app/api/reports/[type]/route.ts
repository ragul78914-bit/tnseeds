import { NextRequest, NextResponse } from 'next/server';
import { ALL_MOCK_SEEDS } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const sellerSeeds = ALL_MOCK_SEEDS.filter(s => s.sellerId === 's_1');
  return NextResponse.json({
    reportType: params.type,
    generatedAt: new Date().toISOString(),
    data: sellerSeeds.map(s => ({
      seedName: s.seedName,
      crop: s.crop,
      variety: s.variety,
      currentStock: s.availableQuantity,
      unit: s.unit,
      sellingPrice: s.sellingPrice,
      stockValue: s.availableQuantity * s.purchasePrice
    }))
  });
}
