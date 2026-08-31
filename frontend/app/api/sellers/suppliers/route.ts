import { NextRequest, NextResponse } from 'next/server';

const MOCK_SUPPLIERS = [
  { _id: 'sup_1', name: 'National Seed Corporation Ltd', contact: 'K. Rajendran', phone: '9842100001', city: 'Chennai', seedsCount: 12 },
  { _id: 'sup_2', name: 'TNAU Seed Production Unit', contact: 'Dr. S. Sundaram', phone: '9842100002', city: 'Coimbatore', seedsCount: 8 },
  { _id: 'sup_3', name: 'Syngenta India Pvt Ltd', contact: 'M. Anand', phone: '9842100003', city: 'Pune / Salem', seedsCount: 6 },
  { _id: 'sup_4', name: 'Rasi Seeds Pvt Ltd', contact: 'V. Prakash', phone: '9842100004', city: 'Attur, Salem', seedsCount: 5 }
];

export async function GET() {
  return NextResponse.json(MOCK_SUPPLIERS);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSupplier = {
      _id: 'sup_' + Date.now(),
      name: body.name || 'New Supplier',
      contact: body.contact || 'Contact Person',
      phone: body.phone || '9876543210',
      city: body.city || 'Tamil Nadu',
      seedsCount: 0
    };
    return NextResponse.json(newSupplier, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add supplier' }, { status: 400 });
  }
}
