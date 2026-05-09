import React, { useState } from 'react';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { sendNotification } from './Notifications';

const tradeOptions = ['Electrician', 'Plumber', 'Carpenter', 'General laborer', 'HVAC', 'Painter', 'Roofer', 'Welder', 'Mason', 'Other'];

export default function PostJob({ contractor, onBack, onPosted }) {
    const [title, setTitle] = useState('');
    const [trade, setTrade] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [pay, setPay] = useState('');
    const [date, setDate] = useState('');
    const [zip, setZip] = useState('');
    const [urgent, setUrgent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handlePost() {
        setLoading(true);
        try {
            await addDoc(collection(db, 'jobs'), {
                title,
                trade,
                description,
                duration,
                pay,
                date,
                zip,
                urgent,
                contractorId: contractor?.uid || null,
                contractorName: contractor?.name || 'Contractor',
                contractorEmail: contractor?.email || '',
                status: 'open',
                applicants: [],
                createdAt: new Date(),
            });
            if (contractor?.uid) {
                await sendNotification(
                    contractor.uid,
                    'job_live',
                    `Your job "${title}" is now live and visible to workers.`,
                    {}
                );
            }
            setDone(true);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    }

    if (done) {
        return (
            <div className="form-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                    <h2 style={{ marginBottom: 8 }}>Job posted!</h2>
                    <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
                        Your job is now live. Workers in your area can see it and apply directly.
                    </p>
                    <button className="btn-primary" style={{ width: '100%', padding: 13, marginBottom: 10 }} onClick={onPosted}>
                        Browse workers
                    </button>
                    <button className="btn-outline" style={{ width: '100%', padding: 13 }} onClick={onBack}>
                        Back to feed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Post a job</div>
                <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>Fill out the details below. Workers near you will be able to see and apply to your job for free.</p>

                <label className="field-label">Job title</label>
                <input className="text-input" placeholder="e.g. Electrician needed for panel upgrade" value={title} onChange={e => setTitle(e.target.value)} style={{ marginBottom: 16 }} />

                <label className="field-label">Trade needed</label>
                <select className="select-input" value={trade} onChange={e => setTrade(e.target.value)} style={{ marginBottom: 16 }}>
                    <option value="">Select a trade</option>
                    {tradeOptions.map(t => <option key={t}>{t}</option>)}
                </select>

                <label className="field-label">Job description</label>
                <textarea className="text-input" rows={4} placeholder="Describe the work, location, any specific requirements..." value={description} onChange={e => setDescription(e.target.value)} style={{ resize: 'none', lineHeight: 1.5, marginBottom: 16 }} />

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
                <input className="text-input" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ marginBottom: 16 }} />

                <label className="field-label">Zip code</label>
                <input className="text-input" type="text" maxLength={5} placeholder="e.g. 94550" value={zip} onChange={e => setZip(e.target.value)} style={{ marginBottom: 16 }} />

                <div className="settings-item" style={{ border: '1px solid #eee', borderRadius: 10, marginBottom: 24 }} onClick={() => setUrgent(!urgent)}>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>Mark as urgent</div>
                        <div style={{ fontSize: 12, color: '#888' }}>Urgent jobs get highlighted and shown first</div>
                    </div>
                    <div className={`toggle ${urgent ? 'on' : ''}`}>
                        <div className="toggle-knob"></div>
                    </div>
                </div>

                <button
                    className="btn-primary"
                    style={{ width: '100%', padding: 13 }}
                    disabled={!title || !trade || !description || !duration || !pay || !date || zip.length !== 5 || loading}
                    onClick={handlePost}
                >
                    {loading ? 'Posting...' : 'Post job for free'}
                </button>
            </div>
        </div>
    );
}