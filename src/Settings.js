import React, { useState } from 'react';
import { db, auth } from './firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

function EditProfile({ user, onBack, onSave }) {
    const [name, setName] = useState(user.name || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [zip, setZip] = useState(user.zip || '');
    const [trade, setTrade] = useState(user.trade || '');
    const [status, setStatus] = useState('');

    async function handleSave() {
        if (!user.uid) { setStatus('error'); return; }
        try {
            await updateDoc(doc(db, 'users', user.uid), { name, phone, zip, trade });
            setStatus('saved');
            setTimeout(() => { onSave({ name, phone, zip, trade }); }, 1200);
        } catch (e) {
            console.error(e);
            setStatus('error');
        }
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Edit profile</div>

                <label className="field-label">Full name</label>
                <input className="text-input" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 16 }} />

                <label className="field-label">Phone number</label>
                <input className="text-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" style={{ marginBottom: 16 }} />

                <label className="field-label">Zip code</label>
                <input className="text-input" value={zip} onChange={e => setZip(e.target.value)} maxLength={5} style={{ marginBottom: 16 }} />

                <label className="field-label">Trade / role</label>
                <select className="select-input" value={trade} onChange={e => setTrade(e.target.value)} style={{ marginBottom: 24 }}>
                    <option value="">Select your trade</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="General laborer">General laborer</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Other">Other</option>
                </select>

                {status === 'saved' && (
                    <div className="auth-error" style={{ background: '#e1f5ee', color: '#0f6e56', marginBottom: 16 }}>
                        Profile saved successfully!
                    </div>
                )}
                {status === 'error' && (
                    <div className="auth-error" style={{ marginBottom: 16 }}>
                        Something went wrong. Try again.
                    </div>
                )}

                <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={handleSave}>
                    Save changes
                </button>
            </div>
        </div>
    );
}

function NotificationsSettings({ onBack }) {
    const [jobAlerts, setJobAlerts] = useState(true);
    const [messages, setMessages] = useState(true);
    const [updates, setUpdates] = useState(false);

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Notifications</div>
                <div className="settings-list">
                    <div className="settings-item">
                        <span>Job alerts near me</span>
                        <div className={`toggle ${jobAlerts ? 'on' : ''}`} onClick={() => setJobAlerts(!jobAlerts)}>
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                    <div className="settings-item">
                        <span>New messages</span>
                        <div className={`toggle ${messages ? 'on' : ''}`} onClick={() => setMessages(!messages)}>
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                    <div className="settings-item">
                        <span>Product updates</span>
                        <div className={`toggle ${updates ? 'on' : ''}`} onClick={() => setUpdates(!updates)}>
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Privacy({ onBack, user, onDeleteAccount }) {
    const [visible, setVisible] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteDoc(doc(db, 'users', user.uid));
            await deleteUser(auth.currentUser);
            onDeleteAccount();
        } catch (e) {
            console.error(e);
            setError('Something went wrong. You may need to log out and log back in before deleting.');
            setDeleting(false);
        }
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Privacy</div>
                <div className="settings-list">
                    <div className="settings-item">
                        <div>
                            <div style={{ fontSize: 14, color: '#111' }}>Profile visible to contractors</div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>When off, contractors cannot find you</div>
                        </div>
                        <div className={`toggle ${visible ? 'on' : ''}`} onClick={() => setVisible(!visible)}>
                            <div className="toggle-knob"></div>
                        </div>
                    </div>
                </div>

                <div className="section-heading" style={{ marginTop: 20 }}>Your data</div>

                {!showConfirm ? (
                    <div className="settings-list">
                        <div className="settings-item" style={{ color: '#a32d2d' }} onClick={() => setShowConfirm(true)}>
                            <span>Delete my account</span>
                            <span className="settings-arrow">›</span>
                        </div>
                    </div>
                ) : (
                    <div style={{ background: '#fcebeb', border: '1px solid #f09595', borderRadius: 12, padding: '20px', marginTop: 8 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#a32d2d', marginBottom: 8 }}>Are you sure?</div>
                        <p style={{ fontSize: 13, color: '#555', marginBottom: 16, lineHeight: 1.6 }}>
                            This will permanently delete your account and all your data including your profile, job history, and messages. This cannot be undone.
                        </p>
                        {error && <div className="auth-error" style={{ marginBottom: 12 }}>{error}</div>}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button
                                style={{ flex: 1, padding: 11, borderRadius: 8, border: 'none', background: '#a32d2d', color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Yes, delete my account'}
                            </button>
                            <button
                                className="btn-outline"
                                style={{ flex: 1, padding: 11 }}
                                onClick={() => setShowConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Help({ onBack }) {
    const faqs = [
        { q: 'How do I get hired?', a: 'Create your profile, set your availability, and contractors in your area will reach out directly through the app.' },
        { q: 'Is Chamba free for workers?', a: 'Workers need a Basic or Featured membership to apply to jobs and be visible to contractors.' },
        { q: 'How do I get paid?', a: 'Payment is handled directly between you and the contractor. Chamba does not take a cut of your wages.' },
        { q: 'Can I work multiple jobs?', a: 'Yes, you can accept multiple jobs as long as you update your availability so contractors know when you are free.' },
    ];
    const [open, setOpen] = useState(null);

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Help center</div>
                {faqs.map((faq, i) => (
                    <div key={i} className="faq-item" onClick={() => setOpen(open === i ? null : i)}>
                        <div className="faq-q">
                            <span>{faq.q}</span>
                            <span style={{ color: '#aaa', fontSize: 18 }}>{open === i ? '-' : '+'}</span>
                        </div>
                        {open === i && <div className="faq-a">{faq.a}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Contact({ onBack, user }) {
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    async function handleSend() {
        try {
            await import('firebase/firestore').then(async ({ collection, addDoc }) => {
                await addDoc(collection(db, 'messages'), {
                    message,
                    from: user?.email || 'anonymous',
                    uid: user?.uid || null,
                    sentAt: new Date(),
                });
            });
            setSent(true);
        } catch (e) {
            console.error(e);
            setError('Something went wrong. Try again.');
        }
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Contact us</div>
                <p style={{ fontSize: 14, color: '#555', marginBottom: 20 }}>Have a question or issue? Send us a message and we will get back to you within 24 hours.</p>
                {!sent ? (
                    <>
                        <label className="field-label">Your message</label>
                        <textarea className="text-input" rows={5} placeholder="Describe your issue or question..." value={message} onChange={e => setMessage(e.target.value)} style={{ resize: 'none', lineHeight: 1.5, marginBottom: 16 }} />
                        {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}
                        <button className="btn-primary" style={{ width: '100%', padding: 13 }} disabled={message.length < 10} onClick={handleSend}>Send message</button>
                    </>
                ) : (
                    <div className="auth-error" style={{ background: '#e1f5ee', color: '#0f6e56', fontSize: 14 }}>Message sent! We will get back to you within 24 hours.</div>
                )}
            </div>
        </div>
    );
}

function Terms({ onBack }) {
    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 20 }}>Back</button>
            <div className="profile-card">
                <div className="section-heading">Terms of service</div>
                <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>By using Chamba, you agree to the following terms. Chamba is a platform that connects workers with contractors. We do not employ workers or contractors and are not responsible for the quality of work performed. Payments are handled directly between workers and contractors. Chamba takes no cut of wages. Workers pay a monthly membership to be visible on the platform. Accounts found to be fraudulent or abusive will be permanently banned. Chamba reserves the right to update these terms at any time.</p>
            </div>
        </div>
    );
}

export { EditProfile, NotificationsSettings, Privacy, Help, Contact, Terms };