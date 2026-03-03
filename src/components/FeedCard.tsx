"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

type FeedCardProps = {
    id: string;
    author: string;
    title: string;
    category: string;
    upvotes: number;
    timeAgo: string;
    upvoted_by: string[];
    image_url?: string;
};

export default function FeedCard({ id, author, title, category, upvotes: initialUpvotes, timeAgo, upvoted_by = [], image_url }: FeedCardProps) {
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [hasVoted, setHasVoted] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [localVoters, setLocalVoters] = useState<string[]>(upvoted_by);

    // Comment Subsystem State
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);

    // Determines if the user has ALREADY voted when the page loads!
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setCurrentUser(session.user.id);
                if (localVoters.includes(session.user.id)) {
                    setHasVoted(true);
                }
            }
        });
    }, [localVoters]);

    const handleVote = async () => {
        if (!currentUser) {
            alert("You must Log In with Google to Upvote Civic Issues!");
            return;
        }

        const newVoteCount = hasVoted ? upvotes - 1 : upvotes + 1;
        // Dynamically append or slice the user's ID from the tracking array
        const newVotersList = hasVoted
            ? localVoters.filter(uid => uid !== currentUser)
            : [...localVoters, currentUser];

        // Optimistic UI updates
        setUpvotes(newVoteCount);
        setHasVoted(!hasVoted);
        setLocalVoters(newVotersList);

        // Submits the new tracked array directly into the Database block
        const { error } = await supabase
            .from('civic_issues')
            .update({
                upvotes: newVoteCount,
                upvoted_by: newVotersList
            })
            .eq('id', id);

        if (error) {
            console.error("Cloud DB Error:", error);
            alert("Failed to sync upvote with Supabase PostgreSQL");
            setUpvotes(upvotes);
            setHasVoted(hasVoted);
            setLocalVoters(localVoters);
        }
    };

    const toggleComments = async () => {
        if (!showComments) {
            setLoadingComments(true);
            const { data } = await supabase.from('issue_comments').select('*').eq('issue_id', id).order('created_at', { ascending: true });
            if (data) setComments(data);
            setLoadingComments(false);
        }
        setShowComments(!showComments);
    };

    const postComment = async () => {
        if (!newComment.trim() || !currentUser) {
            alert("You must log in to participate in civic discussions!");
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        const authorName = session?.user?.user_metadata?.full_name || currentUser;

        // Optimistic UI Update
        const optimisticComment = { id: Math.random().toString(), author: authorName, content: newComment };
        setComments([...comments, optimisticComment]);
        setNewComment("");

        // Postgres Delivery
        await supabase.from('issue_comments').insert({ issue_id: id, author: authorName, content: optimisticComment.content });
    };

    return (
        <div className="feed-card" style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
            {/* Voting Sidebar */}
            <div className="vote-sidebar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                <button
                    onClick={handleVote}
                    style={{
                        fontSize: '1.2rem',
                        color: hasVoted ? 'var(--color-civic-green)' : 'var(--color-neutral-text)',
                        cursor: 'pointer',
                        padding: '4px'
                    }}
                    aria-label="Upvote"
                >
                    ▲
                </button>
                <span style={{ fontWeight: 'bold', color: hasVoted ? 'var(--color-civic-green)' : 'inherit' }}>
                    {upvotes}
                </span>
            </div>

            {/* Card Content Row */}
            <div className="feed-card-main" style={{ flexGrow: 1 }}>
                <div className="feed-card-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', color: 'var(--color-neutral-text)' }}>
                    <span>Posted by <strong>@{author}</strong></span>
                    <span>{timeAgo}</span>
                </div>

                <h4 style={{ margin: '4px 0', fontSize: '1rem', color: 'var(--color-neutral-text-strong)' }}>
                    {title}
                </h4>

                {/* Evidence Image Attachment Block! */}
                {image_url && (
                    <div style={{ marginTop: '12px', width: '100%', maxHeight: '400px', overflow: 'hidden', borderRadius: '8px' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image_url} alt="Civic Issue Proof" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                )}

                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="category-tag" style={{
                        fontSize: '0.75rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#E3F2FD',
                        color: 'var(--color-info-blue)',
                        fontWeight: '500'
                    }}>
                        {category}
                    </span>
                    <button onClick={toggleComments} style={{ fontSize: '0.85rem', color: 'var(--color-neutral-text)', marginLeft: 'auto', cursor: 'pointer', padding: '4px 12px', borderRadius: '12px', border: '1px solid var(--color-neutral-border)', backgroundColor: 'var(--color-neutral-bg)' }}>
                        💬 Discuss
                    </button>
                </div>

                {/* Sub-Thread Engine Expansion */}
                {showComments && (
                    <div style={{ marginTop: '16px', backgroundColor: 'var(--color-neutral-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-neutral-border)' }}>
                        <h5 style={{ marginBottom: '12px', color: 'var(--color-neutral-text-strong)' }}>Community Discussion</h5>

                        {loadingComments ? <p style={{ fontSize: '0.85rem' }}>Loading threads...</p> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                                {comments.map((c: any) => (
                                    <div key={c.id} style={{ backgroundColor: 'var(--color-neutral-surface)', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-border)' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--color-info-blue)', marginBottom: '4px' }}>{c.author}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-neutral-text-strong)' }}>{c.content}</div>
                                    </div>
                                ))}
                                {comments.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--color-neutral-text)' }}>No civic discourse yet. Be the first to analyze this problem!</p>}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="State your analysis..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                style={{ flexGrow: 1, padding: '8px 12px', borderRadius: '20px', border: '1px solid var(--color-neutral-border)', backgroundColor: 'var(--color-neutral-surface)', color: 'var(--color-neutral-text-strong)' }}
                            />
                            <button onClick={postComment} className="btn btn-primary" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem' }}>Post</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
