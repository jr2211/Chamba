import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';

export function LeaveReview({ reviewer, revieweeId, revieweeName, jobTitle, onBack, onDone }) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        if (rating === 0) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'reviews'), {
                reviewerId: reviewer.uid,
                reviewerName: reviewer.name,
                revieweeId,
                revieweeName,
                rating,
                comment,
                jobTitle,
                createdAt: new Date(),
            });
            setSubmitted(true);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    if (submitted) {
        return (
            <div className="form-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>⭐</div>
                    <h2 style={{ marginBottom: 8 }}>Review submitted!</h2>
                    <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>Thanks for helping build trust in the Chamba community.</p>
                    <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={onDone}>Done</button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Leave a review</div>
                <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>
                    How was your experience with <strong>{revieweeName}</strong>
                    {jobTitle ? ` on "${jobTitle}"` : ''}?
                </p>

                <label className="field-label">Rating</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            style={{ fontSize: 36, cursor: 'pointer', color: star <= (hover || rating) ? '#f5a623' : '#ddd', transition: 'color 0.1s' }}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <label className="field-label">Comments (optional)</label>
                <textarea
                    className="text-input"
                    rows={4}
                    placeholder="Describe your experience. Was the work done well? Did they show up on time?"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    style={{ resize: 'none', lineHeight: 1.5, marginBottom: 24 }}
                />

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: 13 }}
                    disabled={rating === 0 || loading}
                    onClick={handleSubmit}
                >
                    {loading ? 'Submitting...' : 'Submit review'}
                </button>
            </div>
        </div>
    );
}

export function ViewReviews({ userId, userName, onBack }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, 'reviews'), where('revieweeId', '==', userId));
        const unsub = onSnapshot(q, snap => {
            setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, [userId]);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Reviews for {userName}</div>

                {avgRating && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, padding: '16px', background: '#f9f9f9', borderRadius: 12 }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: '#111' }}>{avgRating}</div>
                        <div>
                            <div style={{ color: '#f5a623', fontSize: 20 }}>{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
                        </div>
                    </div>
                )}

                {loading && <div style={{ fontSize: 14, color: '#aaa' }}>Loading reviews...</div>}

                {!loading && reviews.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 32, color: '#aaa', fontSize: 14 }}>No reviews yet.</div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {reviews.map(r => (
                        <div key={r.id} className="review-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 13, fontWeight: 500 }}>{r.reviewerName}</span>
                                <span style={{ color: '#f5a623', fontSize: 13 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                            </div>
                            {r.jobTitle && <div style={{ fontSize: 12, color: '#aaa', marginBottom: 6 }}>Job: {r.jobTitle}</div>}
                            {r.comment && <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>{r.comment}</p>}
                            <div style={{ fontSize: 12, color: '#aaa', marginTop: 6 }}>
                                {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString() : 'Recently'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}