import React from 'react';
import { ALL_MOCK_SEEDS } from '../../../lib/mockData';
import SeedDetailsClient from './SeedDetailsClient';

export function generateStaticParams() {
  const ids: { id: string }[] = [];
  ALL_MOCK_SEEDS.forEach((seed, index) => {
    ids.push({ id: seed._id });
    ids.push({ id: String(index + 1) });
    ids.push({ id: seed.seedCode });
  });
  return ids;
}

export default function SeedDetailsPage({ params }: { params: { id: string } }) {
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = rawId ? decodeURIComponent(rawId) : 'seed_1';

  return <SeedDetailsClient id={id} />;
}
