import React from 'react';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';

export default function Dashboard({ user, onSignOut, onNavigate }) {
    async function handleSignOut() {
        await signOut(auth);
        onSignOut();
    }

    return (
        <div className="form-page">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="avatar">{user.name ? user.name.charAt(0).toUpperCase() : '?'}</div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: 20 }}>{user.name || 'User'}</h2>
                        <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>{user.email}</div>
                        <span className="verified-badge" style={{ marginTop: 6, display: 'inline-block' }}>
                            {user.role === 'worker' ? 'Worker' : 'Contractor'}
                        </span>
                        {user.membership && (
                            <span style={{ marginLeft: 8, fontSize: 11, background: user.membership === 'featured' ? '#fff3cd' : '#e1f5ee', color: user.membership === 'featured' ? '#856404' : '#0f6e56', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
                                {user.membership === 'featured' ? '⭐ Featured' : 'Basic'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="profile-divider" />

                <div className="section-heading">Account</div>
                <div className="settings-list">
                    <div className="settings-item" onClick={() => onNavigate('editprofile')}>
                        <span>Edit profile</span>
                        <span className="settings-arrow">›</span>
                    </div>
                    <div className="settings-item" onClick={() => onNavigate('offers')}>
                        <span>{user.role === 'worker' ? 'My job offers' : 'Sent offers'}</span>
                        <span className="settings-arrow">›</span>
                    </div>
                    {user.role === 'contractor' && (
                        <div className="settings-item" onClick={() => onNavigate('myjobs')}>
                            <span>My posted jobs</span>
                            <span className="settings-arrow">›</span>
                        </div>
                    )}
                    {user.role === 'worker' && (
                        <div className="settings-item" onClick={() => window.open('https://billing.stripe.com/p/login/test_14A28k236g1H7MJcsvaAw00', '_blank')}>
                            <span>Manage subscription</span>
                            <span className="settings-arrow">›</span>
                        </div>
                    )}
                    {user.role === 'worker' && !user.membership && (
                        <div className="settings-item" onClick={() => onNavigate('membership')} style={{ color: '#1D9E75' }}>
                            <span>Upgrade to Basic or Featured</span>
                            <span className="settings-arrow">›</span>
                        </div>
                    )}
                    <div className="settings-item" onClick={() => onNavigate('notifications')}>
                        <span>Notifications</span>
                        <span className="settings-arrow">›</span>
                    </div>
                    <div className="settings-item" onClick={() => onNavigate('privacy')}>
                        <span>Privacy</span>
                        <span className="settings-arrow">›</span>
                    </div>
                </div>

                <div className="profile-divider" />

                <div className="section-heading">Support</div>
                <div className="settings-list">
                    <div className="settings-item" onClick={() => onNavigate('help')}>
                        <span>Help center</span>
                        <span className="settings-arrow">›</span>
                    </div>
                    <div className="settings-item" onClick={() => onNavigate('contact')}>
                        <span>Contact us</span>
                        <span className="settings-arrow">›</span>
                    </div>
                    <div className="settings-item" onClick={() => onNavigate('terms')}>
                        <span>Terms of service</span>
                        <span className="settings-arrow">›</span>
                    </div>
                </div>

                <div className="profile-divider" />

                <button
                    onClick={handleSignOut}
                    style={{ width: '100%', padding: 13, borderRadius: 10, border: '1px solid #f09595', background: '#fcebeb', color: '#a32d2d', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 8 }}
                >
                    Sign out
                </button>
            </div>
        </div>
    );
}