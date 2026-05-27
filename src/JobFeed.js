import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { sendNotification } from './Notifications';
import { distanceMiles } from './distance';

const trades = ['All trades', 'Electrician', 'Plumber', 'Carpenter', 'General laborer', 'HVAC', 'Painter', 'Roofer', 'Welder', 'Mason', 'Other'];

export default function JobFeed({ user, onBack, onLeaveReview, onUpgrade }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trade, setTrade] = useState('All trades');
    const [search, setSearch] = useState('');
    const [radius, setRadius] = useState(25);
    const [useRadius, setUseRadius] = useState(true);
    const [applying, setApplying] = useState(null);

    const hasMembership = true;
    const userZip = user?.zip || '';

    useEffect(() => {
        const q = query(collection(db, 'jobs'));
        const unsub = onSnapshot(q, snap => {
            setJobs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    async function apply(job) {
        if (!user?.uid || !hasMembership) return;
        setApplying(job.id);
        try {
            await updateDoc(doc(db, 'jobs', job.id), {
                applicants: arrayUnion({ uid: user.uid, name: user.name, appliedAt: new Date().toISOString() }),
            });
            if (job.contractorId) {
                await sendNotification(
                    job.contractorId,
                    'application',
                    `${user.name || 'A worker'} applied to your job: "${job.title}"`,
                    { jobId: job.id }
                );
            }
        } catch (e) {
            console.error(e);
        }
        setApplying(null);
    }

    const hasApplied = (job) => job.applicants?.some(a => a.uid === user?.uid);

    function getDistance(jobZip) {
        if (!userZip || !jobZip) return null;
        return distanceMiles(userZip, jobZip);
    }

    const filtered = jobs
        .filter(j => j.status === 'open')
        .filter(j => trade === 'All trades' || j.trade === trade)
        .filter(j => {
            if (!search) return true;
            return j.title?.toLowerCase().includes(search.toLowerCase()) ||
                j.zip?.includes(search) ||
                j.trade?.toLowerCase().includes(search.toLowerCase());
        })
        .filter(j => {
            if (!useRadius || !userZip) return true;
            const dist = getDistance(j.zip);
            if (dist === null) return true;
            return dist <= radius;
        })
        .map(j => ({ ...j, distance: getDistance(j.zip) }))
        .sort((a, b) => {
            if (a.urgent && !b.urgent) return -1;
            if (!a.urgent && b.urgent) return 1;
            if (a.distance !== null && b.distance !== null) return a.distance - b.distance;
            return 0;
        });

    return (
        <div className="form-page">
            <h2 style={{ marginBottom: 4 }}>Jobs near you</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>Browse open jobs posted by contractors and homeowners in your area.</p>

            

            {userZip && (
                <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
                            {useRadius ? `Showing jobs within ${radius} miles` : 'Showing all jobs'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13, color: '#888' }}>Filter by distance</span>
                            <div
                                className={`toggle ${useRadius ? 'on' : ''}`}
                                onClick={() => setUseRadius(!useRadius)}
                                style={{ flexShrink: 0 }}
                            >
                                <div className="toggle-knob"></div>
                            </div>
                        </div>
                    </div>

                    {useRadius && (
                        <>
                            <input
                                type="range"
                                min={5}
                                max={100}
                                step={5}
                                value={radius}
                                onChange={e => setRadius(Number(e.target.value))}
                                style={{ width: '100%', accentColor: '#1D9E75', marginBottom: 8 }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#aaa' }}>
                                <span>5 miles</span>
                                <span style={{ fontWeight: 500, color: '#1D9E75', fontSize: 13 }}>{radius} miles</span>
                                <span>100 miles</span>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="feed-filters" style={{ marginBottom: 16 }}>
                <input
                    className="text-input"
                    placeholder="Search by title, trade, or zip code..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 2 }}
                />
                <select className="select-input" value={trade} onChange={e => setTrade(e.target.value)}>
                    {trades.map(t => <option key={t}>{t}</option>)}
                </select>
            </div>

            {loading && <div style={{ fontSize: 14, color: '#aaa', marginBottom: 16 }}>Loading jobs...</div>}

            <div style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
                {!loading && `${filtered.length} job${filtered.length !== 1 ? 's' : ''} found${useRadius && userZip ? ` within ${radius} miles` : ''}`}
            </div>

            <div className="worker-feed">
                {filtered.length === 0 && !loading && (
                    <div style={{ textAlign: 'center', padding: 40, color: '#aaa', fontSize: 14 }}>
                        No jobs found within {radius} miles. Try increasing the radius or turning off distance filtering.
                        <div style={{ marginTop: 12 }}>
                            <button className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }} onClick={() => setUseRadius(false)}>
                                Show all jobs
                            </button>
                        </div>
                    </div>
                )}
                {filtered.map(job => (
                    <div key={job.id} className="worker-card" style={{ flexDirection: 'column', cursor: 'default' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{job.title}</span>
                                    {job.urgent && <span style={{ fontSize: 11, background: '#fcebeb', color: '#a32d2d', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>Urgent</span>}
                                </div>
                                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                                    {job.contractorName} · Zip: {job.zip}
                                    {job.distance !== null && job.distance !== undefined && (
                                        <span style={{ color: '#1D9E75', marginLeft: 8, fontWeight: 500 }}>
                                            · {job.distance.toFixed(1)} mi away
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                                    <span className="skill-tag">Duration: {job.duration}</span>
                                    <span className="skill-tag" style={{ background: '#e1f5ee', color: '#0f6e56' }}>Pay: {job.pay}</span>
                                    <span className="skill-tag">{job.trade}</span>
                                    {job.date && <span className="skill-tag">Start: {job.date}</span>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {!hasMembership ? (
                                    <button
                                        className="btn-outline"
                                        style={{ fontSize: 13, padding: '9px 20px', whiteSpace: 'nowrap', color: '#aaa', borderColor: '#ddd', cursor: 'not-allowed' }}
                                        onClick={() => onUpgrade && onUpgrade()}
                                    >
                                        🔒 Apply now
                                    </button>
                                ) : (
                                    <button
                                        className={hasApplied(job) ? 'btn-outline' : 'btn-primary'}
                                        style={{ fontSize: 13, padding: '9px 20px', whiteSpace: 'nowrap' }}
                                        disabled={hasApplied(job) || applying === job.id}
                                        onClick={() => !hasApplied(job) && apply(job)}
                                    >
                                        {applying === job.id ? 'Applying...' : hasApplied(job) ? 'Applied!' : 'Apply now'}
                                    </button>
                                )}
                                {hasApplied(job) && (
                                    <button
                                        className="btn-outline"
                                        style={{ fontSize: 12, padding: '7px 14px', whiteSpace: 'nowrap' }}
                                        onClick={() => onLeaveReview && onLeaveReview(job)}
                                    >
                                        Leave review
                                    </button>
                                )}
                            </div>
                        </div>
                        <p style={{ fontSize: 13, color: '#666', marginTop: 12, lineHeight: 1.6 }}>{job.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
