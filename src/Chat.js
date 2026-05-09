import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { sendNotification } from './Notifications';

export default function Chat({ chatId, user, otherPerson, onBack }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
        if (!chatId) return;
        const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'));
        const unsub = onSnapshot(q, snap => {
            setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [chatId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function sendMessage() {
        if (!text.trim() || !chatId) return;
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
            text,
            senderId: user.uid,
            senderName: user.name,
            createdAt: new Date(),
        });
        if (otherPerson?.uid) {
            await sendNotification(
                otherPerson.uid,
                'message',
                `New message from ${user.name || 'someone'}: "${text.length > 40 ? text.substring(0, 40) + '...' : text}"`,
                { chatId, senderName: user.name, senderUid: user.uid }
            );
        }
        setText('');
    }

    function handleKey(e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    }

    return (
        <div className="form-page">
            <button className="btn-back" onClick={onBack} style={{ marginBottom: 16 }}>Back</button>
            <div className="profile-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="chat-header">
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{otherPerson?.name?.charAt(0) || '?'}</div>
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{otherPerson?.name || 'Chat'}</div>
                        <div style={{ fontSize: 12, color: '#aaa' }}>{otherPerson?.trade || ''}</div>
                    </div>
                </div>

                <div className="chat-body">
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#aaa', fontSize: 13, marginTop: 40 }}>No messages yet. Say hello!</div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className={`chat-bubble-wrap ${msg.senderId === user.uid ? 'mine' : 'theirs'}`}>
                            <div className={`chat-bubble ${msg.senderId === user.uid ? 'mine' : 'theirs'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                <div className="chat-input-row">
                    <textarea
                        className="chat-input"
                        placeholder="Type a message..."
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleKey}
                        rows={1}
                    />
                    <button className="btn-primary" style={{ padding: '10px 18px', fontSize: 13 }} onClick={sendMessage} disabled={!text.trim()}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}