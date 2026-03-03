"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import NavBar from "@/components/NavBar";

export default function UploadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // React standard form logic
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Infrastructure");
    const [description, setDescription] = useState("");

    // Hydrates coordinates flawlessly directly from a Map URL query, or falls back to NY defaults!
    const [lat, setLat] = useState(searchParams.get("lat") || "40.7128");
    const [lng, setLng] = useState(searchParams.get("lng") || "-74.0060");
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-detect the logged-in user!
        const { data: { session } } = await supabase.auth.getSession();
        const userEmail = session?.user?.email || 'anonymous';
        const userName = session?.user?.user_metadata?.full_name || userEmail;

        // 1. Storage Upload Gateway (Pre-Flight)
        let generatedImageUrl = null;
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `public_${Math.random()}.${fileExt}`;

            // Natively streams the Binary File OS block to the 'civic_images' Bucket
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('civic_images')
                .upload(fileName, imageFile);

            if (uploadError) {
                alert("Failed to upload the image to Supabase Bucket! Ensure Bucket exists.");
                console.error(uploadError);
                return;
            }

            // Extract Public Resolvable Access Link
            const { data: publicLink } = supabase.storage.from('civic_images').getPublicUrl(fileName);
            generatedImageUrl = publicLink.publicUrl;
        }

        // 2. Postgres Database Submission Flow
        const { error } = await supabase.from('civic_issues').insert({
            title,
            category,
            description,
            author: userName,
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
            image_url: generatedImageUrl
        });

        if (error) {
            alert("Error submitting to Supabase: " + error.message);
        } else {
            alert("Civic Issue Reported Successfully!");
            router.push("/");
        }
    };

    return (
        <div className="layout-container">
            {/* Global Authenticated Navigation */}
            <NavBar />

            <main style={{ maxWidth: '800px', margin: '40px auto', padding: 'var(--spacing-md)' }}>
                <h1 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-civic-green)' }}>Report an Issue</h1>
                <p style={{ color: 'var(--color-neutral-text)', marginBottom: 'var(--spacing-md)' }}>
                    Help improve your community by detailing a civic issue. Please provide a clear description and location.
                </p>

                <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', padding: 'var(--spacing-md)' }}>
                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Issue Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Massive Pothole on Main St"
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-neutral-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-neutral-border)', backgroundColor: 'white' }}>
                            <option>Infrastructure</option>
                            <option>Maintenance</option>
                            <option>Traffic</option>
                            <option>Public Safety</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Description</label>
                        <textarea
                            rows={4}
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Provide specific details about the issue..."
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-neutral-border)' }}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Location / Coordinates</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" required value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" style={{ flexGrow: 1, padding: '10px', border: '1px solid var(--color-neutral-border)', borderRadius: '4px' }} />
                            <input type="text" required value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" style={{ flexGrow: 1, padding: '10px', border: '1px solid var(--color-neutral-border)', borderRadius: '4px' }} />
                            <button type="button" className="btn" style={{ padding: '0 20px', backgroundColor: '#E0E0E0', borderRadius: '4px' }}>Detect Pin</button>
                        </div>
                    </div>

                    {/* File Upload OS Invoker */}
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Attach Evidence Photo (Optional)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                            }}
                            style={{ width: '100%', padding: '10px', backgroundColor: 'var(--color-bg-alt)' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1.1rem' }}>
                        Submit Report
                    </button>
                </form>
            </main>
        </div>
    );
}
