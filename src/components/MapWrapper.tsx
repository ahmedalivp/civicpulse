"use client";

import dynamic from 'next/dynamic';

// Next.js dynamic import strictly within a Client component boundary
const DynamicMap = dynamic<{ issues?: any[] }>(() => import('./Map').then(mod => mod.default as any), {
    ssr: false,
    loading: () => <p className="map-placeholder">Loading Map...</p>
});

export default function MapWrapper({ issues }: { issues?: any[] }) {
    return <DynamicMap issues={issues} />;
}
