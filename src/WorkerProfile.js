import React, { useState } from 'react';

function StarRating({ rating }) {
    return (
        <span style={{ color: '#f5a623', fontSize: 14 }}>
            {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
            <span style={{ color: '#888', marginLeft: 6, fontSize: 13 }}>{rating} / 5</span>
        </span>
    );
}

export default function WorkerProfile({ worker, onBack, onSendOffer, onChat, onLeaveReview, onViewReviews, contractor }) {
    const [showPhone, setShowPhone] = useState(false);

    if (!worker) return null;

    const phone = worker.phone || '(555) 867-5309';

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">{worker.name.charAt(0)}</div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <h2 style={{ margin: 0, fontSize: 22 }}>{worker.name}</h2>
                            <span className="verified-badge">Chamba Verified</span>
                        </div>
                        <div style={{ fontSize: 15, color: '#555', marginTop: 4 }}>{worker.trade} · {worker.city}</div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#1D9E75', marginTop: 4 }}>{worker.rate}</div>
                        <div style={{ marginTop: 6 }}>
                            <StarRating rating={worker.rating} />
                            <span style={{ fontSize: 13, color: '#888', marginLeft: 8 }}>{worker.jobs} jobs completed</span>
                        </div>
                    </div>
                </div>

                <div className="profile-divider" />

                <div className="profile-grid">
                    <div className="profile-meta-item">
                        <div className="meta-label">Experience</div>
                        <div className="meta-value">{worker.experience}</div>
                    </div>
                    <div className="profile-meta-item">
                        <div className="meta-label">Availability</div>
                        <div className="meta-value avail-now">{worker.availability}</div>
                    </div>
                    <div className="profile-meta-item">
                        <div className="meta-label">Hourly rate</div>
                        <div className="meta-value">{worker.rate}</div>
                    </div>
                    <div className="profile-meta-item">
                        <div className="meta-label">Location</div>
                        <div className="meta-value">{worker.city}</div>
                    </div>
                </div>

                <div className="profile-divider" />

                <div className="profile-section">
                    <div className="section-heading">About</div>
                    <p style={{ fontSize: 14, color: '#444', lineHeight: 1.7 }}>{worker.bio}</p>
                </div>

                <div className="profile-divider" />

                <div className="profile-section">
                    <div className="section-heading">Skills</div>
                    <div className="skills-list">
                        {worker.skills.map(skill => (
                            <span key={skill} className="skill-tag">{skill}</span>
                        ))}
                    </div>
                </div>

                <div className="profile-divider" />

                <div className="profile-section">
                    <div className="section-heading">Contact {worker.name.split(' ')[0]}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                        <button className="btn-primary" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={() => onSendOffer && onSendOffer(worker)}>
                            Send job offer
                        </button>
                        <button className="btn-outline" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={() => onChat && onChat(worker)}>
                            Message {worker.name.split(' ')[0]}
                        </button>
                        <button className="btn-outline" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={() => setShowPhone(!showPhone)}>
                            {showPhone ? `📞 ${phone}` : 'Show phone number'}
                        </button>
                        {showPhone && (
                            <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#111', textAlign: 'center' }}>
                                Call or text directly: <strong>{phone}</strong>
                            </div>
                        )}
                    </div>
                </div>

                <div className="profile-divider" />

                <div className="profile-section">
                    <div className="section-heading">Reviews</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                        <button className="btn-outline" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={() => onViewReviews && onViewReviews(worker)}>
                            View all reviews
                        </button>
                        <button className="btn-outline" style={{ width: '100%', padding: 13, fontSize: 14 }} onClick={() => onLeaveReview && onLeaveReview(worker)}>
                            Leave a review
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}