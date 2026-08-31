import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newTxn = {
      _id: 'txn_' + Date.now(),
      transactionNo: `TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      seedId: body.seedId,
      type: body.type || 'PURCHASE',
      quantity: parseFloat(body.quantity || '10'),
      unit: 'kg',
      price: parseFloat(body.price || '100'),
      batchNumber: body.batchNumber || 'BATCH-2026',
      expiryDate: body.expiryDate || '2027-01-01',
      invoiceNo: body.invoiceNo || 'INV-MANUAL',
      supplier: body.supplier || 'Vendor'
    };

    return NextResponse.json(newTxn, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Transaction record failed' }, { status: 400 });
  }
}
