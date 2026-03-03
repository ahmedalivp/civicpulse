"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import FeedCard from "@/components/FeedCard";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [userIssues, setUserIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfileData() {
            // Retrieve Current Google Auth Session Context
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }

            const currentUser = session.user;
            setUser(currentUser);
            const userName = currentUser.user_metadata?.full_name || currentUser.email;

            // Extract ONLY issues authored by this active session
            const { data: issues } = await supabase
                .from('civic_issues')
                .select('*')
                .eq('author', userName)
                .order('created_at', { ascending: false });

            if (issues) {
                setUserIssues(issues);
            }
            setLoading(false);
        }

        fetchProfileData();
    }, []);

    // Mathematically summarize all Upvotes this Citizen has contributed!
    const totalKarma = userIssues.reduce((sum, issue) => sum + (issue.upvotes || 0), 0);

    // Deep Analytics Processing
    const resolvedIssues = userIssues.filter(i => i.status === 'Resolved').length;
    const resolutionRate = userIssues.length > 0 ? Math.round((resolvedIssues / userIssues.length) * 100) : 0;

    // Calculate Most Active Category Array Maps
    const categoryCounts = userIssues.reduce((acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topCategory = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a])[0] || 'N/A';

    return (
        <div className="layout-container">
            <NavBar />

            <main style={{ maxWidth: '800px', margin: '40px auto', padding: 'var(--spacing-md)' }}>
                {loading ? (
                    <p>Loading Profile Data...</p>
                ) : !user ? (
                    <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                        <h2 style={{ color: 'var(--color-alert-red)' }}>Authentication Required</h2>
                        <p>You must log in with Google to view your Civic Profile.</p>
                    </div>
                ) : (
                    <>
                        {/* Civic Profile Identity Container */}
                        <section className="card" style={{ marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center', backgroundColor: 'var(--color-bg-alt)' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-civic-green)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 'bold'
                            }}>
                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)}
                            </div>
                            <div>
                                <h2 style={{ margin: '0 0 8px 0', color: 'var(--color-text-main)' }}>{user.user_metadata?.full_name || user.email}</h2>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-neutral-text)' }}><strong>{userIssues.length}</strong> Total Reports</span>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--color-info-blue)' }}><strong>{totalKarma}</strong> Civic Karma</span>
                                </div>
                            </div>
                        </section>

                        {/* Civic Analytics Grid Array! */}
                        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>
                            <div className="card" style={{ borderLeft: '4px solid var(--color-civic-green)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-text)', marginBottom: '4px' }}>Civic Impact Rate</p>
                                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-civic-green)' }}>{resolutionRate}%</h3>
                                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Issues formally resolved.</p>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid var(--color-info-blue)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-text)', marginBottom: '4px' }}>Resolved Reports</p>
                                <h3 style={{ fontSize: '1.8rem', color: 'var(--color-text-main)' }}>{resolvedIssues}</h3>
                                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Verified structural fixes.</p>
                            </div>
                            <div className="card" style={{ borderLeft: '4px solid var(--color-warning-orange)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-text)', marginBottom: '4px' }}>Top Focus Area</p>
                                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-text-main)', marginTop: '8px' }}>{topCategory}</h3>
                                <p style={{ fontSize: '0.75rem', marginTop: '4px' }}>Your most reported category.</p>
                            </div>
                        </section>

                        <h3 style={{ marginBottom: '15px' }}>Historical Submission Feed</h3>

                        {userIssues.length === 0 ? (
                            <p style={{ color: 'var(--color-neutral-text)' }}>You have not reported any civic issues yet.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {userIssues.map((issue) => (
                                    <FeedCard
                                        key={issue.id}
                                        id={issue.id}
                                        author={issue.author}
                                        title={issue.title}
                                        category={issue.category}
                                        upvotes={issue.upvotes}
                                        upvoted_by={issue.upvoted_by}
                                        image_url={issue.image_url}
                                        timeAgo="Previously"
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
