import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SELLERS } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email || 'farmer@example.com';

    let role: 'ADMIN' | 'SELLER' | 'FARMER' = 'FARMER';
    let name = 'Ramasamy K (Farmer)';
    let seller = undefined;

    if (email.includes('admin')) {
      role = 'ADMIN';
      name = 'NIXTION Agri Administrator';
    } else if (email.includes('seller') || email.includes('erode') || email.includes('salem')) {
      role = 'SELLER';
      name = 'Sri Lakshmi Seeds Center';
      seller = MOCK_SELLERS[0];
    }

    return NextResponse.json({
      token: 'demo-jwt-token-tnseeds-' + Date.now(),
      _id: 'u_' + role.toLowerCase(),
      name,
      email,
      role,
      seller,
      farmer: {
        _id: 'f_1',
        name: 'Ramasamy K',
        phone: '9789012345',
        district: 'Coimbatore',
        taluk: 'Perur',
        latitude: 11.0168,
        longitude: 76.9558
      }
    });
  } catch (error) {
    return NextResponse.json({ message: 'Login failed' }, { status: 400 });
  }
}
