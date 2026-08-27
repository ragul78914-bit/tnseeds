'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface SellerCenter {
  _id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  availableSeeds?: any[];
}

interface MapViewProps {
  farmerLat: number;
  farmerLng: number;
  centers: SellerCenter[];
  onSelectCenter?: (center: SellerCenter) => void;
}

// Dynamically load Leaflet components without SSR
const LeafletContainer = dynamic(() => import('./LeafletWrapper'), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 font-medium">
      📍 Loading Interactive Agriculture Seed Center Map...
    </div>
  )
});

export default function MapView(props: MapViewProps) {
  return <LeafletContainer {...props} />;
}
