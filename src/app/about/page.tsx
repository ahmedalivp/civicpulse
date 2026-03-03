import React from 'react';
import NavBar from '@/components/NavBar';

export default function AboutPage() {
    return (
        <div className="layout-container">
            <NavBar />

            <main style={{ maxWidth: '800px', margin: '40px auto', padding: 'var(--spacing-md)' }}>
                <div className="card" style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
                    <h1 style={{ color: 'var(--color-civic-green)', marginBottom: '16px', fontSize: '2.5rem' }}>About Civic Pulse</h1>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--color-neutral-text)', marginBottom: '32px' }}>
                        Civic Pulse is an open-source, map-centric infrastructure reporting platform designed under a <strong>Transparency First</strong> philosophy.
                        We empower citizens to instantly pinpoint hazards, rapidly mobilize community awareness through dynamic upvoting, and cleanly track civic resolutions.
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginTop: '30px'
                    }}
                >
                    <div className="card">
                        <h3 style={{ color: 'var(--color-info-blue)', marginBottom: '8px' }}>Real-Time Mapping</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-neutral-text)' }}>Native Leaflet integration instantly routes geo-coordinates from user reports into public visual drop-pins.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ color: 'var(--color-alert-red)', marginBottom: '8px' }}>Multimedia Evidence</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-neutral-text)' }}>Full support for photographic metadata logging directly mapped into our native Cloud Storage bucket arrays.</p>
                    </div>
                    <div className="card">
                        <h3 style={{ color: 'var(--color-warning-orange)', marginBottom: '8px' }}>Civic Triage</h3>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-neutral-text)' }}>Democratic upvoting algorithms organically push the most dangerous hazards linearly to the top of the feed.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
