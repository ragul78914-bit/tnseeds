import { NextResponse } from 'next/server';

const MOCK_AUDIT_LOGS = [
  {
    _id: 'log_1',
    action: 'PRICE_UPDATE',
    entity: 'Maize Hybrid 520',
    user: 'Sri Lakshmi Seeds',
    timestamp: new Date().toISOString(),
    details: 'Selling price updated to ₹420/kg'
  },
  {
    _id: 'log_2',
    action: 'STOCK_RESTOCK',
    entity: 'Bt Cotton Rasi 659',
    user: 'Green Farm Agri Center',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Added 200 packets to inventory'
  },
  {
    _id: 'log_3',
    action: 'NEW_SEED_ADDED',
    entity: 'Paddy CO 51 Hybrid',
    user: 'Tamil Agro Depot',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'Certified Hybrid Seed SKU registered'
  }
];

export async function GET() {
  return NextResponse.json(MOCK_AUDIT_LOGS);
}
