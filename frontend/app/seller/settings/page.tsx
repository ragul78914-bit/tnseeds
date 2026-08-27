'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import MapView from '../../../components/MapView';
import { Store, MapPin, Save, CheckCircle2 } from 'lucide-react';

export default function SellerSettingsPage() {
  const { user } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Coimbatore');
  const [taluk, setTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('641001');
  const [latitude, setLatitude] = useState(11.0168);
  const [longitude, setLongitude] = useState(76.9558);
  const [licenseNo, setLicenseNo] = useState('');
  const [openingHours, setOpeningHours] = useState('8:00 AM - 8:00 PM');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchApi('/auth/me')
      .then(res => {
        if (res.seller) {
          const s = res.seller;
          setBusinessName(s.businessName || '');
          setOwnerName(s.ownerName || '');
          setPhone(s.phone || '');
          setAddress(s.address || '');
          setDistrict(s.district || 'Coimbatore');
          setTaluk(s.taluk || '');
          setVillage(s.village || '');
          setPincode(s.pincode || '641001');
          setLatitude(s.latitude || 11.0168);
          setLongitude(s.longitude || 76.9558);
          setLicenseNo(s.licenseNo || '');
          setOpeningHours(s.openingHours || '8:00 AM - 8:00 PM');
        }
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');

    try {
      await fetchApi('/sellers/profile', {
        method: 'PUT',
        body: JSON.stringify({
          businessName, ownerName, phone, address, district, taluk, village, pincode,
          latitude, longitude, licenseNo, openingHours
        })
      });

      setSuccess('✅ Store location & profile updated successfully!');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const sellerCenter = [{
    _id: user?.seller?._id || 's_1',
    businessName: businessName || 'My Seed Center',
    ownerName,
    phone,
    address,
    district,
    latitude,
    longitude,
    distanceKm: 0
  }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
          ⚙️ Seller Store Profile & Map Location
        </h1>
        <p className="text-xs text-slate-500">
          Update business coordinates so nearby farmers can find your store location and get turn-by-turn directions
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Form */}
        <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">Business Information</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block font-bold text-slate-700 mb-1">Business / Store Name *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Taluk</label>
                <input
                  type="text"
                  value={taluk}
                  onChange={(e) => setTaluk(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block font-bold text-slate-700 mb-1">GPS Latitude *</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">GPS Longitude *</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Save Profile & Update Map Location
            </button>

          </form>
        </div>

        {/* Map Preview */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            📍 Store Location Map Pin Preview
          </h3>
          <MapView farmerLat={latitude} farmerLng={longitude} centers={sellerCenter} />
        </div>

      </div>

    </div>
  );
}
