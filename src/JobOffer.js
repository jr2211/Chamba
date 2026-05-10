import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { sendNotification } from './Notifications';

export default function JobOffer({ worker, contractor, onBack, onSent }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [pay, setPay] = useState('');
    const [date, setDate] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSend() {
        setLoading(true);
        try {
            await addDoc(collection(db, 'offers'), {
                workerId: worker.id || worker.uid || null,
                workerName: worker.name,
                contractorId: contractor?.uid || null,
                contractorName: contractor?.name || 'Contractor',
                contractorEmail: contractor?.email || '',
                title,
                description,
                duration,
                pay,
                date,
                status: 'pending',
                createdAt: new Date(),
            });
            if (worker.uid) {
                await sendNotification(
                    worker.uid,
                    'offer',
                    `${contractor?.name || 'A contractor'} sent you a job offer: "${title}"`,
                    {}
                );
            }
            setSent(true);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    if (sent) {
        return (
            <div className="form-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                    <h2 style={{ marginBottom: 8 }}>Offer sent!</h2>
                    <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
                        Your job offer has been sent to <strong>{worker.name}</strong>. You will be notified when they respond.
                    </p>
                    <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={onBack}>Back to workers</button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{worker.name.charAt(0)}</div>
                    <div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>Send job offer to {worker.name}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>{worker.trade} · {worker.city}</div>
                    </div>
                </div>

                <div className="profile-divider" />

                <label className="field-label">Job title</label>
                <input className="text-input" placeholder="e.g. Electrician needed for panel upgrade" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 16 }} />

                <label className="field-label">Job description</label>
                <textarea className="text-input" rows={4} placeholder="Describe the work, location, any requirements..." value={description} onChange={e => setDescription(e.target.value)} style={{ marginBottom: 16 }} />

                <label className="field-label">Estimated duration</label>
                <select className="select-input" value={duration} onChange={e => setDuration(e.target.value)} style={{ marginBottom: 16 }}>
                    <option value="">Select duration</option>
                    <option>A few hours</option>
                    <option>1 day</option>
                    <option>2 - 3 days</option>
                    <option>1 week</option>
                    <option>2 - 4 weeks</option>
                    <option>1+ months</option>
                </select>

                <label className="field-label">Pay offered</label>
                <input className="text-input" placeholder="e.g. $350 flat or $40/hr" value={pay} onChange={e => setPay(e.target.value)} style={{ marginBottom: 16 }} />

                <label className="field-label">Start date</label>
                <input className="text-input" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ marginBottom: 24 }} />

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: 13 }}
                    disabled={!title || !description || !duration || !pay || !date || loading}
                    onClick={handleSend}
                >
                    {loading ? 'Sending...' : 'Send job offer'}
                </button>
            </div>
        </div>
    );
}
