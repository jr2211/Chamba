import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

export function useNotifications(userId) {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const q = query(collection(db, 'notifications'), where('userId', '==', userId));
        const unsub = onSnapshot(q, snap => {
            const notifs = snap.docs
                .map(d => ({ id: d.id, ...d.data() }))
                .sort((a, b) => {
                    const aTime = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
                    const bTime = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
                    return bTime - aTime;
                });
            setNotifications(notifs);
        });
        return () => unsub();
    }, [userId]);

    const unreadCount = notifications.filter(n => !n.read).length;
    return { notifications, unreadCount };
}

export async function sendNotification(userId, type, message, data = {}) {
    await addDoc(collection(db, 'notifications'), {
        userId,
        type,
        message,
        data,
        read: false,
        createdAt: new Date(),
    });
}

export default function NotificationsPanel({ user, notifications, onClose, onNavigate }) {
    async function markRead(notifId) {
        await updateDoc(doc(db, 'notifications', notifId), { read: true });
    }

    async function markAllRead() {
        const unread = notifications.filter(n => !n.read);
        await Promise.all(unread.map(n => updateDoc(doc(db, 'notifications', n.id), { read: true })));
    }

    function getIcon(type) {
        const icons = {
            application: '👷',
            message: '💬',
            offer: '📋',
            offer_accepted: '✅',
            offer_declined: '❌',
            job_live: '🟢',
            review: '⭐',
            default: '🔔',
        };
        return icons[type] || icons.default;
    }

    function handleClick(notif) {
        markRead(notif.id);
        if (notif.type === 'message') onNavigate('chat', notif.data);
        else if (notif.type === 'application') onNavigate('myjobs');
        else if (notif.type === 'offer' || notif.type === 'offer_accepted' || notif.type === 'offer_declined') onNavigate('offers');
        else if (notif.type === 'job_live') onNavigate('myjobs');
        onClose();
    }

    function timeAgo(createdAt) {
        if (!createdAt) return '';
        const date = createdAt?.toDate ? createdAt.toDate() : new Date(createdAt);
        const diff = Math.floor((new Date() - date) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }

    return (
        <div className="notif-panel">
            <div className="notif-header">
                <span style={{ fontSize: 15, fontWeight: 600 }}>Notifications</span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    {notifications.some(n => !n.read) && (
                        <span style={{ fontSize: 12, color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }} onClick={markAllRead}>
                            Mark all read
                        </span>
                    )}
                    <span style={{ fontSize: 20, cursor: 'pointer', color: '#888' }} onClick={onClose}>×</span>
                </div>
            </div>

            {notifications.length === 0 && (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: '#aaa', fontSize: 14 }}>
                    No notifications yet. We will let you know when something happens.
                </div>
            )}

            <div className="notif-list">
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        className={`notif-item ${!notif.read ? 'unread' : ''}`}
                        onClick={() => handleClick(notif)}
                    >
                        <div className="notif-icon">{getIcon(notif.type)}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, color: '#111', lineHeight: 1.5 }}>{notif.message}</div>
                            <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>{timeAgo(notif.createdAt)}</div>
                        </div>
                        {!notif.read && <div className="notif-dot"></div>}
                    </div>
                ))}
            </div>
        </div>
    );
}