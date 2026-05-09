import React, { useState } from 'react';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Auth({ onSuccess }) {
    const [mode, setMode] = useState('login');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');

    async function handleSubmit() {
        setError('');
        setLoading(true);
        try {
            if (mode === 'signup') {
                if (!role) { setError('Please select if you are a worker or contractor.'); setLoading(false); return; }
                const result = await createUserWithEmailAndPassword(auth, email, password);
                const userData = { name, email, role, uid: result.user.uid, createdAt: new Date() };
                await setDoc(doc(db, 'users', result.user.uid), userData);
                onSuccess(role, userData);
            } else {
                const result = await signInWithEmailAndPassword(auth, email, password);
                const snap = await getDoc(doc(db, 'users', result.user.uid));
                if (snap.exists()) {
                    const userData = { ...snap.data(), uid: result.user.uid };
                    onSuccess(userData.role, userData);
                } else {
                    onSuccess('worker', { uid: result.user.uid, email });
                }
            }
        } catch (err) {
            if (err.code === 'auth/email-already-in-use') setError('That email is already registered. Try logging in.');
            else if (err.code === 'auth/wrong-password') setError('Incorrect password. Try again.');
            else if (err.code === 'auth/user-not-found') setError('No account found with that email.');
            else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters.');
            else if (err.code === 'auth/invalid-credential') setError('Incorrect email or password. Try again.');
            else setError('Something went wrong. Try again.');
            setLoading(false);
        }
    }

    async function handleReset() {
        setResetError('');
        if (!resetEmail) { setResetError('Please enter your email address.'); return; }
        setResetLoading(true);
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetSent(true);
        } catch (err) {
            if (err.code === 'auth/user-not-found') setResetError('No account found with that email.');
            else if (err.code === 'auth/invalid-email') setResetError('Please enter a valid email address.');
            else setResetError('Something went wrong. Try again.');
        }
        setResetLoading(false);
    }

    if (mode === 'reset') {
        return (
            <div className="form-page">
                <div className="auth-card">
                    <div className="auth-logo">
                        <div className="logo-dot"></div>
                        Chamba
                    </div>

                    {!resetSent ? (
                        <>
                            <h2 style={{ fontSize: 18, marginBottom: 8 }}>Reset your password</h2>
                            <p style={{ fontSize: 14, color: '#555', marginBottom: 24 }}>
                                Enter the email address on your account and we will send you a reset link.
                            </p>

                            <label className="field-label">Email address</label>
                            <input
                                className="text-input"
                                type="email"
                                placeholder="you@email.com"
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                style={{ marginBottom: 16 }}
                            />

                            {resetError && <div className="auth-error" style={{ marginBottom: 16 }}>{resetError}</div>}

                            <button
                                className="btn-primary"
                                style={{ width: '100%', padding: 13, marginBottom: 12 }}
                                onClick={handleReset}
                                disabled={resetLoading}
                            >
                                {resetLoading ? 'Sending...' : 'Send reset link'}
                            </button>

                            <button
                                className="btn-back"
                                style={{ width: '100%', textAlign: 'center' }}
                                onClick={() => { setMode('login'); setResetError(''); setResetEmail(''); }}
                            >
                                Back to log in
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                                <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
                                <h2 style={{ fontSize: 18, marginBottom: 8 }}>Check your email</h2>
                                <p style={{ fontSize: 14, color: '#555' }}>
                                    We sent a password reset link to <strong>{resetEmail}</strong>. Check your inbox and follow the instructions.
                                </p>
                            </div>
                            <button
                                className="btn-primary"
                                style={{ width: '100%', padding: 13 }}
                                onClick={() => { setMode('login'); setResetSent(false); setResetEmail(''); }}
                            >
                                Back to log in
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="form-page">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="logo-dot"></div>
                    Chamba
                </div>

                <div className="auth-tabs">
                    <div className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Log in</div>
                    <div className={`auth-tab ${mode === 'signup' ? 'active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>Sign up</div>
                </div>

                {mode === 'signup' && (
                    <>
                        <label className="field-label">Your name</label>
                        <input className="text-input" type="text" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 16 }} />
                        <label className="field-label">I am a...</label>
                        <div className="role-grid">
                            <div className={`role-opt ${role === 'worker' ? 'selected' : ''}`} onClick={() => setRole('worker')}>
                                <div className="role-icon">👷</div>
                                <div className="role-label">Worker</div>
                                <div className="role-sub">I want to find jobs</div>
                            </div>
                            <div className={`role-opt ${role === 'contractor' ? 'selected' : ''}`} onClick={() => setRole('contractor')}>
                                <div className="role-icon">🏗️</div>
                                <div className="role-label">Contractor</div>
                                <div className="role-sub">I need to hire someone</div>
                            </div>
                        </div>
                    </>
                )}

                <label className="field-label">Email</label>
                <input className="text-input" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 16 }} />

                <label className="field-label">Password</label>
                <input className="text-input" type="password" placeholder="At least 6 characters" value={password} onChange={e => setPassword(e.target.value)} style={{ marginBottom: mode === 'login' ? 8 : 20 }} />

                {mode === 'login' && (
                    <div style={{ textAlign: 'right', marginBottom: 20 }}>
                        <span
                            style={{ fontSize: 13, color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }}
                            onClick={() => { setMode('reset'); setResetEmail(email); setError(''); }}
                        >
                            Forgot password?
                        </span>
                    </div>
                )}

                {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

                <button className="btn-primary" style={{ width: '100%', padding: 13 }} onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
                </button>

                <div className="auth-switch">
                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                    <span onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}>
                        {mode === 'login' ? 'Sign up' : 'Log in'}
                    </span>
                </div>
            </div>
        </div>
    );
}