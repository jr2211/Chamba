import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import {
  collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, doc, setDoc
} from 'firebase/firestore';
import { sendNotification } from './Notifications';

export default function Chat({ chatId, user, otherPerson, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsub();
  }, [chatId]);

  async function sendMessage() {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      // Create parent chat document first
      await setDoc(doc(db, 'chats', chatId), {
        participants: [user.uid, otherPerson.uid || otherPerson.id],
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Then add the message
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: text.trim(),
        senderId: user.uid,
        senderName: user.name || 'User',
        createdAt: serverTimestamp(),
      });

      // Send notification to other person
      const otherUid = otherPerson.uid || otherPerson.id;
      if (otherUid) {
        await sendNotification(
          otherUid,
          'message',
          `New message from ${user.name || 'Someone'}`,
          { chatId, senderUid: user.uid, senderName: user.name }
        );
      }

      setText('');
    } catch (e) {
      console.error('Send error:', e);
    }
    setSending(false);
  }

  return (
    <div className="form-page" style={{ display: 'flex', flexDirection: 'column', height: '90vh', padding: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderBottom: '1px solid #eee', background: 'white' }}>
        <button className="btn-back" onClick={onBack} style={{ marginBottom: 0 }}>Back</button>
        <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
          {otherPerson?.name?.charAt(0) || '?'}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{otherPerson?.name || 'Chat'}</div>
      </div>

      <div className="chat-body" style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: '#aaa', fontSize: 14, marginTop: 40 }}>
            No messages yet. Say hello!
          </div>
        )}
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.senderId === user.uid ? 'flex-end' : 'flex-start',
            }}
          >
            <div style={{
              background: msg.senderId === user.uid ? '#1D9E75' : '#f0f0f0',
              color: msg.senderId === user.uid ? 'white' : '#111',
              padding: '10px 14px',
              borderRadius: msg.senderId === user.uid ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              maxWidth: '70%',
              fontSize: 14,
              lineHeight: 1.5,
            }}>
              {msg.text}
            </div>
            <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>
              {msg.senderId === user.uid ? 'You' : msg.senderName}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid #eee', background: 'white' }}>
        <input
          className="text-input"
          placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, marginBottom: 0 }}
        />
        <button
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: 14, whiteSpace: 'nowrap' }}
          onClick={sendMessage}
          disabled={sending || !text.trim()}
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}