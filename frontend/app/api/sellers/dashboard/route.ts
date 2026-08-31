import { NextResponse } from 'next/server';
import { MOCK_SELLERS, ALL_MOCK_SEEDS } from '@/lib/mockData';

export async function GET() {
  const sellerSeeds = ALL_MOCK_SEEDS.filter(s => s.sellerId === 's_1');
  const totalStockUnits = sellerSeeds.reduce((sum, s) => sum + s.availableQuantity, 0);
  const stockValue = sellerSeeds.reduce((sum, s) => sum + (s.availableQuantity * s.purchasePrice), 0);
  const lowStockAlerts = sellerSeeds.filter(s => s.stockStatus === 'LOW_STOCK').length;

  return NextResponse.json({
    seller: MOCK_SELLERS[0],
    totalProducts: sellerSeeds.length,
    activeProducts: sellerSeeds.length,
    totalStockUnits,
    lowStockAlerts,
    outOfStockCount: 0,
    stockValue,
    recentTransactions: [
      {
        _id: 'txn_1',
        transactionNo: 'TXN-20260827-0001',
        date: new Date().toISOString(),
        seedName: 'Maize Hybrid 520',
        type: 'PURCHASE',
        quantity: 300,
        unit: 'kg',
        price: 340,
        supplier: 'Syngenta Seeds India'
      },
      {
        _id: 'txn_2',
        transactionNo: 'TXN-20260827-0002',
        date: new Date(Date.now() - 86400000).toISOString(),
        seedName: 'Paddy CR 1009 Sub 1',
        type: 'SALE',
        quantity: 50,
        unit: 'kg',
        price: 65,
        supplier: 'Direct Farmer Sale'
      }
    ]
  });
}
