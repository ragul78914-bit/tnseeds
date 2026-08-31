import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SELLERS } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      token: 'demo-jwt-token-registered-' + Date.now(),
      _id: 'u_farmer_new',
      name: body.name || 'New Registered Farmer',
      email: body.email,
      role: body.role || 'FARMER',
      farmer: {
        _id: 'f_new',
        name: body.name || 'New Farmer',
        phone: body.phone || '9876543210',
        district: body.district || 'Coimbatore',
        taluk: 'Coimbatore',
        latitude: 11.0168,
        longitude: 76.9558
      }
    });
  } catch (error) {
    return NextResponse.json({ message: 'Registration failed' }, { status: 400 });
  }
}
