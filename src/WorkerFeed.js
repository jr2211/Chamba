import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { distanceMiles } from './distance';

const trades = ['All trades', 'Electrician', 'Plumber', 'Carpenter', 'General laborer', 'HVAC', 'Painter', 'Roofer', 'Welder', 'Mason', 'Other'];
const availability = ['Any availability', 'Right now', 'This week', 'Next week', 'Flexible'];

function StarRating({ rating }) {
    return (
        <span style={{ color: '#f5a623', fontSize: 13 }}>
            {'★'.repeat(Math.floor(rating || 0))}{'☆'.repeat(5 - Math.floor(rating || 0))}
            <span style={{ color: '#888', marginLeft: 6, fontSize: 12 }}>{rating || 'New'}</span>
        </span>
    );
}

export default function WorkerFeed({ onBack, onViewProfile, contractor }) {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trade, setTrade] = useState('All trades');
    const [avail, setAvail] = useState('Any availability');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('rating');
    const [radius, setRadius] = useState(25);
    const [useRadius, setUseRadius] = useState(true);

    const contractorZip = contractor?.zip || '';

    useEffect(() => {
        const q = query(collection(db, 'users'), where('role', '==', 'worker'), where('onboarded', '==', true));
        const unsub = onSnapshot(q, snap => {
            setWorkers(snap.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() })));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    function getDistance(workerZip) {
        if (!contractorZip || !workerZip) return null;
        return distanceMiles(contractorZip, workerZip);
    }

    const filtered = workers
        .filter(w => trade === 'All trades' || w.trade === trade)
        .filter(w => avail === 'Any availability' || w.availability === avail)
        .filter(w => {
            if (!search) return true;
            return w.name?.toLowerCase().includes(search.toLowerCase()) ||
                w.trade?.toLowerCase().includes(search.toLowerCase()) ||
                w.zip?.includes(search);
        })
        .filter(w => {
            if (!useRadius || !contractorZip) return true;
            const dist = getDistance(w.zip);
            if (dist === null) return true;
            return dist <= radius;
        })
        .map(w => ({ ...w, distance: getDistance(w.zip) }))
        .sort((a, b) => {
            if (a.membership === 'featured' && b.membership !== 'featured') return -1;
            if (a.membership !== 'featured' && b.membership === 'featured') return 1;
            if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
            if (sort === 'distance') {
                if (a.distance === null) return 1;
                if (b.distance === null) return -1;
                return a.distance - b.distance;
            }
            return (b.jobs || 0) - (a.jobs || 0);
        });

    function formatWorker(w) {
        return {
            ...w,
            city: w.zip ? `Zip: ${w.zip}` : 'Location not set',
            rate: w.rate ? `$${w.rate}/hr` : 'Rate not set',
            experience: w.experience || 'Not specified',
            availability: w.availability || 'Flexible',
            skills: w.skills || [],
            bio: w.bio || 'No bio provided.',
            jobs: w.jobs || 0,
            rating: w.rating || null,
        };
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <h2 style={{ marginBottom: 6 }}>Find workers</h2>
            <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>Browse available workers sorted by highest rated. Featured members appear first.</p>

            {contractorZip && (
                <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>
                            {useRadius ? `Showing workers within ${radius} miles` : 'Showing all workers'}
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

            <div className="feed-filters">
                <input
                    className="text-input"
                    placeholder="Search by name, trade, or zip..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ flex: 2 }}
                />
                <select className="select-input" value={trade} onChange={e => setTrade(e.target.value)}>
                    {trades.map(t => <option key={t}>{t}</option>)}
                </select>
                <select className="select-input" value={avail} onChange={e => setAvail(e.target.value)}>
                    {availability.map(a => <option key={a}>{a}</option>)}
                </select>
                <select className="select-input" value={sort} onChange={e => setSort(e.target.value)}>
                    <option value="rating">Highest rated</option>
                    <option value="distance">Closest first</option>
                    <option value="jobs">Most jobs</option>
                </select>
            </div>

            {loading && <div style={{ fontSize: 14, color: '#aaa', margin: '20px 0' }}>Loading workers...</div>}

            <div style={{ fontSize: 13, color: '#888', margin: '16px 0' }}>
                {!loading && `${filtered.length} worker${filtered.length !== 1 ? 's' : ''} found${useRadius && contractorZip ? ` within ${radius} miles` : ''}`}
            </div>

            <div className="worker-feed">
                {!loading && filtered.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: '#aaa', fontSize: 14 }}>
                        No workers found within {radius} miles. Try increasing the radius or turning off distance filtering.
                        <div style={{ marginTop: 12 }}>
                            <button className="btn-outline" style={{ fontSize: 13, padding: '8px 18px' }} onClick={() => setUseRadius(false)}>
                                Show all workers
                            </button>
                        </div>
                    </div>
                )}
                {filtered.map(w => {
                    const worker = formatWorker(w);
                    return (
                        <div key={worker.id} className="worker-card" onClick={() => onViewProfile(worker)}>
                            <div className="worker-card-left">
                                <div className="avatar" style={{ width: 48, height: 48, fontSize: 18 }}>
                                    {worker.name?.charAt(0) || '?'}
                                </div>
                            </div>
                            <div className="worker-card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{worker.name}</span>
                                    <span className="verified-badge">Chamba Verified</span>
                                    {worker.membership === 'featured' && (
                                        <span style={{ fontSize: 11, background: '#fff3cd', color: '#856404', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
                                            ⭐ Featured
                                        </span>
                                    )}
                                    {worker.availability === 'Right now' && (
                                        <span style={{ fontSize: 11, background: '#e8f4ff', color: '#1a6fa8', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
                                            Available now
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: '#555', marginTop: 3 }}>
                                    {worker.trade} · {worker.experience} · {worker.city}
                                    {w.distance !== null && w.distance !== undefined && (
                                        <span style={{ color: '#1D9E75', marginLeft: 8, fontWeight: 500 }}>
                                            · {w.distance.toFixed(1)} mi away
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: '#1D9E75', marginTop: 4 }}>{worker.rate}</div>
                                <div style={{ marginTop: 5 }}>
                                    <StarRating rating={worker.rating} />
                                    <span style={{ fontSize: 12, color: '#aaa', marginLeft: 8 }}>{worker.jobs} jobs completed</span>
                                </div>
                                {worker.bio && (
                                    <p style={{ fontSize: 13, color: '#666', marginTop: 8, lineHeight: 1.5 }}>
                                        {worker.bio.length > 120 ? worker.bio.substring(0, 120) + '...' : worker.bio}
                                    </p>
                                )}
                                {worker.skills.length > 0 && (
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                                        {worker.skills.slice(0, 4).map(s => (
                                            <span key={s} className="skill-tag">{s}</span>
                                        ))}
                                        {worker.skills.length > 4 && (
                                            <span className="skill-tag">+{worker.skills.length - 4} more</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="worker-card-right">
                                <button
                                    className="btn-primary"
                                    style={{ fontSize: 13, padding: '8px 16px', whiteSpace: 'nowrap' }}
                                    onClick={e => { e.stopPropagation(); onViewProfile(worker); }}
                                >
                                    View profile
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}