"use client";

import React, { useEffect } from 'react';
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Fix for default marker icons in React Leaflet
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function CivicMap({ issues = [] }: { issues?: any[] }) {
    // New York City default center coordinates
    const defaultPosition: [number, number] = [40.7128, -74.0060];
    const [draftLocation, setDraftLocation] = useState<{ lat: number, lng: number } | null>(null);
    const router = useRouter();

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                setDraftLocation(e.latlng);
            }
        });
        return null;
    }

    // Dynamic Category-based HTML Icons!!
    const getMarkerIcon = (category: string) => {
        let color = '#2196F3'; // Default Info Blue
        if (category === 'Hazard') color = '#e74c3c'; // Alert Red
        if (category === 'Infrastructure') color = '#f39c12'; // Warning Orange
        if (category === 'Improvement') color = '#2ecc71'; // Civic Green

        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color:${color}; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    };

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler />

                {draftLocation && (
                    <Marker position={draftLocation}>
                        <Popup>
                            <div style={{ textAlign: 'center' }}>
                                <strong>New Civic Report</strong> <br />
                                <span style={{ fontSize: '11px', color: '#666' }}>{draftLocation.lat.toFixed(4)}, {draftLocation.lng.toFixed(4)}</span> <br />
                                <button
                                    className="btn btn-primary"
                                    style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px', width: '100%' }}
                                    onClick={() => router.push(`/upload?lat=${draftLocation.lat}&lng=${draftLocation.lng}`)}
                                >
                                    Report Issue Here
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {issues && issues.map((issue) => (
                    <Marker key={issue.id} position={[issue.latitude, issue.longitude]} icon={getMarkerIcon(issue.category)}>
                        <Popup>
                            <strong>{issue.title}</strong> <br />
                            Category: <span style={{ fontWeight: 'bold' }}>{issue.category}</span> <br />
                            Reported By: {issue.author}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
