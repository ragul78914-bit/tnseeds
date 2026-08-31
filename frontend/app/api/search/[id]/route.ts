import { NextRequest, NextResponse } from 'next/server';
import { getMockSeedById } from '@/lib/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const farmerLat = parseFloat(searchParams.get('farmerLat') || '11.0168');
  const farmerLng = parseFloat(searchParams.get('farmerLng') || '76.9558');

  const seed = getMockSeedById(params.id, farmerLat, farmerLng);

  if (!seed) {
    return NextResponse.json({ message: 'Seed not found' }, { status: 404 });
  }

  return NextResponse.json(seed);
}
