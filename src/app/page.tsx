import React from "react";
import Link from "next/link";
import MapWrapper from "@/components/MapWrapper";
import FeedCard from "@/components/FeedCard";
import { supabase } from "@/lib/supabaseClient";

import NavBar from "@/components/NavBar";

export default async function Home({ searchParams }: { searchParams: { category?: string } }) {
  const activeCategory = searchParams.category || 'All';

  // Conditionally restrict the Supabase Database Fetch
  let query = supabase.from('civic_issues').select('*').order('created_at', { ascending: false });
  if (activeCategory !== 'All') {
    query = query.eq('category', activeCategory);
  }

  const { data: issues } = await query;

  return (
    <div className="layout-container">
      {/* Centralized Authenicated Navigation Bar */}
      <NavBar />

      {/* Primary Civic Metrics Dashboard Row */}
      <section className="metrics-dashboard">
        <div className="metric card"><h3>2,401</h3><p>Active Citizens</p></div>
        <div className="metric card"><h3>{issues?.length || 0}</h3><p>Reports in View</p></div>
        <div className="metric card"><h3>89</h3><p>Resolved</p></div>
        <div className="metric card"><h3>+12%</h3><p>Engagement</p></div>
      </section>

      {/* Dynamic Data Content Container (70/30 Split) */}
      <main className="main-content grid-layout">

        {/* Interactive Map Canvas (Left 70%) */}
        <section className="map-view card" style={{ display: 'flex', flexDirection: 'column' }}>

          {/* Map Filter Pills */}
          <div style={{ padding: '0 0 16px 0', display: 'flex', gap: '10px', overflowX: 'auto', borderBottom: '1px solid var(--color-border)', marginBottom: '16px' }}>
            {['All', 'Infrastructure', 'Hazard', 'Improvement', 'Event'].map(cat => (
              <Link
                key={cat}
                href={`/?category=${cat}`}
                className="category-tag btn"
                style={{
                  backgroundColor: activeCategory === cat ? 'var(--color-civic-green)' : 'var(--color-bg-alt)',
                  color: activeCategory === cat ? 'white' : 'var(--color-neutral-text)',
                  border: 'none',
                  padding: '6px 16px',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  textDecoration: 'none'
                }}
              >
                {cat}
              </Link>
            ))}
          </div>

          <MapWrapper issues={issues || []} />
        </section>

        {/* Community Feed / Right Panel (Right 30%) */}
        <section className="community-feed card">
          <div className="feed-header">
            <h2>Community Feed</h2>
            <div className="feed-tabs">
              <button>Hot</button>
              <button>New</button>
              <button>Top</button>
            </div>
          </div>

          <div className="feed-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {issues && issues.map((issue) => (
              <FeedCard
                key={issue.id}
                id={issue.id}
                author={issue.author}
                title={issue.title}
                category={issue.category}
                upvotes={issue.upvotes}
                upvoted_by={issue.upvoted_by}
                image_url={issue.image_url}
                timeAgo="Just Now"
              />
            ))}
          </div>
        </section>

        {/* Mobile Device Master Overlay Action */}
        <Link href="/upload" className="floating-report-btn" aria-label="Quick Report">+</Link>

      </main>
    </div>
  );
}
