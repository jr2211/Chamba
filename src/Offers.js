import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { sendNotification } from './Notifications';

export default function Offers({ user, onBack }) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.uid) return;
        const field = user.role === 'worker' ? 'workerId' : 'contractorId';
        const q = query(collection(db, 'offers'), where(field, '==', user.uid));
        const unsub = onSnapshot(q, snap => {
            setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, [user]);

    async function respond(offer, status) {
        await updateDoc(doc(db, 'offers', offer.id), { status });
        if (offer.contractorId) {
            await sendNotification(
                offer.contractorId,
                status === 'accepted' ? 'offer_accepted' : 'offer_declined',
                status === 'accepted'
                    ? `${user.name || 'A worker'} accepted your job offer: "${offer.title}"`
                    : `${user.name || 'A worker'} declined your job offer: "${offer.title}"`,
                { offerId: offer.id }
            );
        }
    }

    function statusBadge(status) {
        const styles = {
            pending: { background: '#faeeda', color: '#854f0b' },
            accepted: { background: '#e1f5ee', color: '#0f6e56' },
            declined: { background: '#fcebeb', color: '#a32d2d' },
        };
        return (
            <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, ...styles[status] }}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <h2 style={{ marginBottom: 6 }}>
                {user.role === 'worker' ? 'Job offers' : 'Sent offers'}
            </h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
                {user.role === 'worker' ? 'Review job offers sent to you by contractors.' : 'Track offers you have sent to workers.'}
            </p>

            {loading && <div style={{ fontSize: 14, color: '#aaa' }}>Loading offers...</div>}

            {!loading && offers.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#aaa', fontSize: 14 }}>
                    {user.role === 'worker' ? 'No job offers yet. Make sure your profile is visible to contractors.' : 'You have not sent any offers yet. Browse workers and send your first offer.'}
                </div>
            )}

            <div className="worker-feed">
                {offers.map(offer => (
                    <div key={offer.id} className="worker-card" style={{ flexDirection: 'column', cursor: 'default' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{offer.title}</span>
                                    {statusBadge(offer.status)}
                                </div>
                                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                                    {user.role === 'worker' ? `From: ${offer.contractorName}` : `To: ${offer.workerName}`}
                                </div>
                            </div>
                        </div>

                        <p style={{ fontSize: 13, color: '#666', marginTop: 10, lineHeight: 1.6 }}>{offer.description}</p>

                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                            <span className="skill-tag">Duration: {offer.duration}</span>
                            <span className="skill-tag" style={{ background: '#e1f5ee', color: '#0f6e56' }}>Pay: {offer.pay}</span>
                            <span className="skill-tag">Start: {offer.date}</span>
                        </div>

                        {user.role === 'worker' && offer.status === 'pending' && (
                            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                <button
                                    className="btn-primary"
                                    style={{ flex: 1, padding: 11 }}
                                    onClick={() => respond(offer, 'accepted')}
                                >
                                    Accept offer
                                </button>
                                <button
                                    className="btn-outline"
                                    style={{ flex: 1, padding: 11, color: '#a32d2d', borderColor: '#f09595' }}
                                    onClick={() => respond(offer, 'declined')}
                                >
                                    Decline
                                </button>
                            </div>
                        )}

                        {offer.status === 'accepted' && user.role === 'contractor' && (
                            <div style={{ marginTop: 14, background: '#e1f5ee', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
                                <strong style={{ color: '#0f6e56' }}>Offer accepted!</strong>
                                <div style={{ color: '#444', marginTop: 4 }}>
                                    Contact {offer.workerName} directly at: <strong>{offer.workerPhone || 'Phone shared after acceptance'}</strong>
                                </div>
                            </div>
                        )}

                        {offer.status === 'accepted' && user.role === 'worker' && (
                            <div style={{ marginTop: 14, background: '#e1f5ee', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#0f6e56' }}>
                                You accepted this offer. The contractor will reach out to confirm details.
                            </div>
                        )}

                        {offer.status === 'declined' && (
                            <div style={{ marginTop: 14, background: '#fcebeb', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#a32d2d' }}>
                                This offer was declined.
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}