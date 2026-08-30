'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

interface LeafletWrapperProps {
  farmerLat: number;
  farmerLng: number;
  centers: SellerCenter[];
  onSelectCenter?: (center: SellerCenter) => void;
}

export default function LeafletWrapper({ farmerLat, farmerLng, centers, onSelectCenter }: LeafletWrapperProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([farmerLat, farmerLng], 10);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(leafletMap.current);
    } else {
      leafletMap.current.setView([farmerLat, farmerLng], 10);
    }

    const map = leafletMap.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Farmer Location Pin (Blue)
    const farmerIcon = L.divIcon({
      className: 'farmer-marker',
      html: `<div style="background-color: #2563eb; color: white; padding: 6px 10px; border-radius: 20px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); font-size: 12px; display: flex; align-items: center; gap: 4px;">👨‍🌾 Your Location</div>`,
      iconSize: [120, 30],
      iconAnchor: [60, 15]
    });

    L.marker([farmerLat, farmerLng], { icon: farmerIcon })
      .addTo(map)
      .bindPopup(`<b>Your Current Search Location</b><br/>Lat: ${farmerLat.toFixed(4)}, Lng: ${farmerLng.toFixed(4)}`);

    // Seller Centers Pins (Green)
    centers.forEach(center => {
      if (!center.latitude || !center.longitude) return;

      const sellerIcon = L.divIcon({
        className: 'seller-marker',
        html: `<div style="background-color: #16a34a; color: white; padding: 6px 12px; border-radius: 20px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 4px;">🏪 ${center.businessName.split(' ')[0]} (${center.distanceKm} km)</div>`,
        iconSize: [140, 30],
        iconAnchor: [70, 15]
      });

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px;">
          <h4 style="margin: 0 0 6px 0; color: #166534; font-size: 15px; font-weight: bold;">${center.businessName}</h4>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #475569;">📍 ${center.address}</p>
          <p style="margin: 0 0 4px 0; font-size: 12px; color: #16a34a; font-weight: 600;">🚗 ${center.distanceKm} km away</p>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #0284c7;">📞 ${center.phone}</p>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}" target="_blank" style="display: inline-block; background-color: #16a34a; color: white; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: bold;">🗺️ Get Directions</a>
        </div>
      `;

      const marker = L.marker([center.latitude, center.longitude], { icon: sellerIcon })
        .addTo(map)
        .bindPopup(popupContent);

      if (onSelectCenter) {
        marker.on('click', () => onSelectCenter(center));
      }
    });

  }, [farmerLat, farmerLng, centers, onSelectCenter]);

  return <div ref={mapRef} className="h-[480px] w-full rounded-2xl shadow-inner border border-slate-200" />;
}
