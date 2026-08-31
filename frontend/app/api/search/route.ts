import { NextRequest, NextResponse } from 'next/server';
import { searchMockSeeds } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const keyword = searchParams.get('keyword') || '';
  const crop = searchParams.get('crop') || '';
  const variety = searchParams.get('variety') || '';
  const district = searchParams.get('district') || '';
  const availability = searchParams.get('availability') || '';
  const maxDistance = searchParams.get('maxDistance') || '150';
  const farmerLat = searchParams.get('farmerLat') || '11.0168';
  const farmerLng = searchParams.get('farmerLng') || '76.9558';
  const sortBy = searchParams.get('sortBy') || 'distance';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const results = searchMockSeeds({
    keyword,
    crop,
    variety,
    district,
    availability,
    maxDistance,
    farmerLat,
    farmerLng,
    sortBy,
    minPrice,
    maxPrice
  });

  return NextResponse.json(results);
}
