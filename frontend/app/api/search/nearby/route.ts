import { NextRequest, NextResponse } from 'next/server';
import { getMockNearbyCenters } from '@/lib/mockData';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const farmerLat = parseFloat(searchParams.get('farmerLat') || '11.0168');
  const farmerLng = parseFloat(searchParams.get('farmerLng') || '76.9558');
  const maxDistance = parseFloat(searchParams.get('maxDistance') || '50');

  const data = getMockNearbyCenters(farmerLat, farmerLng, maxDistance);
  return NextResponse.json(data);
}
