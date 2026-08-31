import { NextResponse } from 'next/server';
import { MOCK_CROPS, MOCK_CATEGORIES, MOCK_DISTRICTS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({
    crops: MOCK_CROPS,
    categories: MOCK_CATEGORIES,
    districts: MOCK_DISTRICTS
  });
}
