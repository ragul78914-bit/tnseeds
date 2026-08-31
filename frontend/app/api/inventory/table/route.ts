import { NextResponse } from 'next/server';
import { ALL_MOCK_SEEDS } from '@/lib/mockData';

export async function GET() {
  const sellerSeeds = ALL_MOCK_SEEDS.filter(s => s.sellerId === 's_1');
  const inventoryList = sellerSeeds.map(s => ({
    _id: `inv_${s._id}`,
    seedId: s._id,
    seedCode: s.seedCode,
    seedName: s.seedName,
    crop: s.crop,
    variety: s.variety,
    unit: s.unit,
    packSize: s.packSize,
    purchasePrice: s.purchasePrice,
    sellingPrice: s.sellingPrice,
    currentStock: s.availableQuantity,
    minStockLevel: s.minStockLevel,
    status: s.stockStatus,
    stockValue: s.availableQuantity * s.purchasePrice,
    lastUpdated: new Date().toISOString()
  }));

  return NextResponse.json(inventoryList);
}
