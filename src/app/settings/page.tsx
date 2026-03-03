"use client";

import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";
import { supabase } from "@/lib/supabaseClient";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [issues, setIssues] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Hydrate saved preferences
        const savedTheme = localStorage.getItem('civic_theme') || 'light';
        setTheme(savedTheme);
        if (savedTheme === 'dark') document.body.classList.add('dark');

        async function loadSettingsHub() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLoading(false);
                return;
            }
            setUser(session.user);

            // ==========================================
            // MILITARY-GRADE ADMIN LOCK (ACTION REQUIRED):
            // Replace my example email with your EXACT Google Email! 
            // ==========================================
            const ADMIN_EMAILS = ['ahmed2v7p@gmail.com'];

            if (ADMIN_EMAILS.includes(session.user.email || '')) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }

            // Pre-load Admin Moderation Array implicitly in the background 
            const { data: rawIssues } = await supabase
                .from('civic_issues')
                .select('*')
                .order('created_at', { ascending: false });

            if (rawIssues) setIssues(rawIssues);
            setLoading(false);
        }
        loadSettingsHub();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('civic_theme', newTheme);
        if (newTheme === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you absolutely sure you want to permanently DELETE "${title}"?`)) return;
        const { error } = await supabase.from('civic_issues').delete().eq('id', id);
        if (error) alert("Ensure your SQL RLS policy permits DELETE!");
        else setIssues(issues.filter(issue => issue.id !== id));
    };

    const handleResolve = async (id: string) => {
        const { error } = await supabase.from('civic_issues').update({ status: 'Resolved' }).eq('id', id);
        if (error) alert("Make sure you added the 'status' text column to postgres!");
        else {
            setIssues(issues.map(issue => issue.id === id ? { ...issue, status: 'Resolved' } : issue));
            alert("Issue Flagged as Resolved!");
        }
    };

    return (
        <div className="layout-container">
            <NavBar />

            <main style={{ maxWidth: '1000px', margin: '40px auto', padding: 'var(--spacing-md)' }}>
                <h1 style={{ color: 'var(--color-civic-green)', marginBottom: '8px' }}>Global Settings</h1>
                <p style={{ marginBottom: '32px', color: 'var(--color-neutral-text)' }}>Control your App Interface, manage notifications, and organize your Civic Account.</p>

                {/* Aesthetic UI Preferences Block */}
                <section className="card" style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Interface Preferences</h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '8px' }}>
                        <div>
                            <strong>Dark Mode</strong>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-text)', marginTop: '4px' }}>Toggle high-contrast inverted colors for low-light civic patrols.</p>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="btn btn-primary"
                            style={{ backgroundColor: theme === 'dark' ? 'var(--color-neutral-text-strong)' : 'var(--color-civic-green)' }}
                        >
                            {theme === 'dark' ? 'Disable Dark Mode' : 'Enable Dark Mode'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-bg-alt)', borderRadius: '8px', marginTop: '16px' }}>
                        <div>
                            <strong>Email Tracking Notifications</strong>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-text)', marginTop: '4px' }}>Receive local alerts when someone comments on your Civic Issues.</p>
                        </div>
                        <button className="btn" style={{ backgroundColor: '#E0E0E0', color: '#666' }}>Coming Soon</button>
                    </div>
                </section>

                {/* Sub-Nested Admin Moderation Panel (Conditionally Rendered) */}
                {loading ? (
                    <p>Loading Verification Core...</p>
                ) : !user ? (
                    <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--color-alert-red)' }}>You must be Logged In to manage your Account.</p>
                    </div>
                ) : isAdmin && (
                    <section className="card" style={{ padding: '24px', overflowX: 'auto', border: '2px solid var(--color-alert-red)' }}>
                        <h2 style={{ color: 'var(--color-alert-red)', marginBottom: '8px' }}>Admin Moderation Queue</h2>
                        <p style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--color-neutral-text)' }}>Warning: Deleting records here physically destroys them from the Supabase Infrastructure forever.</p>

                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                            <thead style={{ backgroundColor: 'var(--color-bg-alt)', borderBottom: '2px solid var(--color-border)' }}>
                                <tr>
                                    <th style={{ padding: '12px' }}>Status</th>
                                    <th style={{ padding: '12px' }}>Title</th>
                                    <th style={{ padding: '12px' }}>Author</th>
                                    <th style={{ padding: '12px' }}>Upvotes</th>
                                    <th style={{ padding: '12px' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issues.map((issue) => (
                                    <tr key={issue.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '12px' }}>
                                            <span style={{ fontWeight: 'bold', color: issue.status === 'Resolved' ? 'var(--color-civic-green)' : 'var(--color-info-blue)' }}>{issue.status || 'Open'}</span>
                                        </td>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>{issue.title}</td>
                                        <td style={{ padding: '12px', fontSize: '0.9rem' }}>{issue.author}</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{issue.upvotes}</td>
                                        <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleResolve(issue.id)} disabled={issue.status === 'Resolved'} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: 'var(--color-civic-green)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px' }}>Resolve</button>
                                            <button onClick={() => handleDelete(issue.id, issue.title)} style={{ padding: '6px 12px', cursor: 'pointer', backgroundColor: 'var(--color-alert-red)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>
        </div>
    );
}
