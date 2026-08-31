import { NextResponse } from 'next/server';

const MOCK_TRANSACTIONS = [
  {
    _id: 'txn_1',
    transactionNo: 'TXN-20260827-0001',
    date: new Date().toISOString(),
    seedId: 'seed_1',
    seedName: 'Maize Hybrid 520',
    type: 'PURCHASE',
    quantity: 300,
    unit: 'kg',
    price: 340,
    oldStock: 0,
    newStock: 300,
    batchNumber: 'BATCH-TN-202601',
    expiryDate: '2027-02-28',
    invoiceNo: 'INV-2024-1001',
    supplier: 'National Seed Corporation'
  },
  {
    _id: 'txn_2',
    transactionNo: 'TXN-20260827-0002',
    date: new Date(Date.now() - 86400000).toISOString(),
    seedId: 'seed_2',
    seedName: 'Paddy CR 1009 Sub 1',
    type: 'SALE',
    quantity: 50,
    unit: 'kg',
    price: 65,
    oldStock: 300,
    newStock: 250,
    batchNumber: 'BATCH-TN-202602',
    expiryDate: '2027-03-31',
    invoiceNo: 'SALE-2024-1002',
    supplier: 'Farmer Direct'
  }
];

export async function GET() {
  return NextResponse.json(MOCK_TRANSACTIONS);
}
