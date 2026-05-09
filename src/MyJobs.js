import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function MyJobs({ contractor, onBack, onChat }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        if (!contractor?.uid) return;
        const q = query(collection(db, 'jobs'), where('contractorId', '==', contractor.uid));
        const unsub = onSnapshot(q, snap => {
            setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, [contractor]);

    async function closeJob(jobId) {
        await updateDoc(doc(db, 'jobs', jobId), { status: 'closed' });
    }

    async function reopenJob(jobId) {
        await updateDoc(doc(db, 'jobs', jobId), { status: 'open' });
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <h2 style={{ marginBottom: 6 }}>My posted jobs</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>See who has applied to your job posts.</p>

            {loading && <div style={{ fontSize: 14, color: '#aaa' }}>Loading your jobs...</div>}

            {!loading && jobs.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#aaa', fontSize: 14 }}>
                    You have not posted any jobs yet.
                </div>
            )}

            <div className="worker-feed">
                {jobs.map(job => (
                    <div key={job.id} className="worker-card" style={{ flexDirection: 'column', cursor: 'default' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{job.title}</span>
                                    {job.urgent && <span style={{ fontSize: 11, background: '#fcebeb', color: '#a32d2d', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>Urgent</span>}
                                    <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500, background: job.status === 'open' ? '#e1f5ee' : '#f0f0f0', color: job.status === 'open' ? '#0f6e56' : '#888' }}>
                                        {job.status === 'open' ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>{job.trade} · {job.zip}</div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                    <span className="skill-tag">Duration: {job.duration}</span>
                                    <span className="skill-tag" style={{ background: '#e1f5ee', color: '#0f6e56' }}>Pay: {job.pay}</span>
                                    {job.date && <span className="skill-tag">Start: {job.date}</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>
                                    {job.applicants?.length || 0} applicant{job.applicants?.length !== 1 ? 's' : ''}
                                </div>
                                <button
                                    className="btn-outline"
                                    style={{ fontSize: 12, padding: '6px 14px' }}
                                    onClick={() => setExpanded(expanded === job.id ? null : job.id)}
                                >
                                    {expanded === job.id ? 'Hide applicants' : 'View applicants'}
                                </button>
                                {job.status === 'open' ? (
                                    <button
                                        className="btn-outline"
                                        style={{ fontSize: 12, padding: '6px 14px', color: '#a32d2d', borderColor: '#f09595' }}
                                        onClick={() => closeJob(job.id)}
                                    >
                                        Close job
                                    </button>
                                ) : (
                                    <button
                                        className="btn-outline"
                                        style={{ fontSize: 12, padding: '6px 14px' }}
                                        onClick={() => reopenJob(job.id)}
                                    >
                                        Reopen job
                                    </button>
                                )}
                            </div>
                        </div>

                        {expanded === job.id && (
                            <div style={{ marginTop: 16 }}>
                                <div className="profile-divider" style={{ marginBottom: 16 }} />
                                {!job.applicants || job.applicants.length === 0 ? (
                                    <div style={{ fontSize: 13, color: '#aaa', textAlign: 'center', padding: '12px 0' }}>
                                        No applicants yet. Check back soon.
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {job.applicants.map((applicant, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f9f9f9', borderRadius: 10, flexWrap: 'wrap', gap: 10 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 14, flexShrink: 0 }}>
                                                        {applicant.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{applicant.name}</div>
                                                        <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>
                                                            Applied {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : 'recently'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button
                                                        className="btn-primary"
                                                        style={{ fontSize: 12, padding: '7px 14px' }}
                                                        onClick={() => onChat && onChat({ name: applicant.name, uid: applicant.uid, trade: '' })}
                                                    >
                                                        Message
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}