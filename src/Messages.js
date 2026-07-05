import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, query, where, onSnapshot, orderBy, limit, getDocs } from 'firebase/firestore';

export default function Messages({ user, onOpenChat, onBack }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const chatsRef = collection(db, 'chats');
    const unsub = onSnapshot(chatsRef, async (snap) => {
      const userChats = [];

      for (const chatDoc of snap.docs) {
        const chatId = chatDoc.id;
        const data = chatDoc.data();

        const participants = data.participants || [];
        if (!participants.includes(user.uid)) continue;

        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const messagesQ = query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
        const messagesSnap = await getDocs(messagesQ);

        if (messagesSnap.empty) continue;

        const lastMessage = messagesSnap.docs[0].data();
        const otherUid = participants.find(id => id !== user.uid);

        userChats.push({
          chatId,
          otherUid,
          lastMessage: lastMessage.text,
          lastSender: lastMessage.senderName,
          lastSenderId: lastMessage.senderId,
          time: lastMessage.createdAt,
        });
      }

      userChats.sort((a, b) => {
        const aTime = a.time?.toDate ? a.time.toDate() : new Date(a.time || 0);
        const bTime = b.time?.toDate ? b.time.toDate() : new Date(b.time || 0);
        return bTime - aTime;
      });

      setConversations(userChats);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  function timeAgo(time) {
    if (!time) return '';
    const date = time?.toDate ? time.toDate() : new Date(time);
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="form-page">
      <h2 style={{ marginBottom: 4 }}>Messages</h2>
      <p style={{ fontSize: 14, color: '#888', marginBottom: 20 }}>Your conversations with workers and contractors.</p>

      {loading && <div style={{ fontSize: 14, color: '#aaa' }}>Loading messages...</div>}

      {!loading && conversations.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#aaa', fontSize: 14 }}>
          No messages yet. Start a conversation by contacting a worker or contractor.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {conversations.map(convo => (
          <div
            key={convo.chatId}
            onClick={() => onOpenChat({
              chatId: convo.chatId,
              otherPerson: { uid: convo.otherUid, name: convo.lastSenderId === user.uid ? 'Them' : convo.lastSender }
            })}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'white', border: '1px solid #eee', borderRadius: 12, cursor: 'pointer', transition: 'border-color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#1D9E75'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#eee'}
          >
            <div className="avatar" style={{ width: 44, height: 44, fontSize: 16, flexShrink: 0 }}>
              {convo.lastSender?.charAt(0) || '?'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>
                  {convo.lastSenderId === user.uid ? 'You' : convo.lastSender}
                </span>
                <span style={{ fontSize: 11, color: '#aaa' }}>{timeAgo(convo.time)}</span>
              </div>
              <div style={{ fontSize: 13, color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {convo.lastSenderId === user.uid ? `You: ${convo.lastMessage}` : convo.lastMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}