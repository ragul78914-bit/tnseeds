import { NextRequest, NextResponse } from 'next/server';
import { ALL_MOCK_SEEDS, MOCK_SELLERS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(ALL_MOCK_SEEDS);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSeed = {
      _id: 'seed_' + (ALL_MOCK_SEEDS.length + 1),
      seedCode: `SEED-${(ALL_MOCK_SEEDS.length + 1).toString().padStart(6, '0')}`,
      seedName: body.seedName || 'New Hybrid Seed',
      crop: body.crop || 'Paddy',
      category: body.category || 'Hybrid Seed',
      variety: body.variety || 'HYV Hybrid',
      hybridName: body.hybridName || body.seedName,
      brand: body.brand || 'TN Certified',
      unit: body.unit || 'kg',
      packSize: body.packSize || '1 kg',
      purchasePrice: parseFloat(body.purchasePrice || '100'),
      sellingPrice: parseFloat(body.sellingPrice || '150'),
      availableQuantity: parseFloat(body.openingQuantity || '100'),
      minStockLevel: parseFloat(body.minStockLevel || '20'),
      supplier: body.supplier || 'National Seed Corporation',
      description: body.description || 'Certified high-yield hybrid seed.',
      suitableSeason: body.suitableSeason || 'All Season',
      recommendedRegion: 'Tamil Nadu',
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
      stockStatus: 'AVAILABLE',
      sellerId: 's_1',
      seller: MOCK_SELLERS[0],
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(newSeed, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create seed' }, { status: 400 });
  }
}
