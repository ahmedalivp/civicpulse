"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);

    // Read native Supabase Session tokens directly from browser caching
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Setup an aggressive listener for login changes dynamically
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Standard Next.js Supabase Google Single-Sign-On command
    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <nav className="global-nav">
            <div className="nav-left">
                <strong>Civic Pulse</strong>
            </div>
            <div className="nav-center">
                <Link href="/" className={pathname === '/' ? "active" : ""}>Home Feed</Link>
                <Link href="/upload" className={pathname === '/upload' ? "active" : ""}>+ Report Issue</Link>
                {user && <Link href="/profile" className={pathname === '/profile' ? "active" : ""}>My Profile</Link>}
                {user && <Link href="/settings" className={pathname === '/settings' ? "active" : ""}>Settings</Link>}
                <Link href="/about" className={pathname === '/about' ? "active" : ""}>About</Link>
            </div>
            <div className="nav-right">
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{user.user_metadata?.full_name || user.email}</span>
                        <button className="btn btn-primary" onClick={handleLogout} style={{ backgroundColor: 'var(--color-alert-red)' }}>Log Out</button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={handleLogin}>Log in with Google</button>
                )}
            </div>
        </nav>
    );
}
