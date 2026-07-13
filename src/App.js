import React, { useState } from 'react';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import WorkerProfile from './WorkerProfile';
import Auth from './Auth';
import Dashboard from './Dashboard';
import WorkerFeed from './WorkerFeed';
import JobFeed from './JobFeed';
import WorkerOnboarding from './WorkerOnboarding';
import JobOffer from './JobOffer';
import Chat from './Chat';
import Offers from './Offers';
import PostJob from './PostJob';
import MyJobs from './MyJobs';
import Messages from './Messages';
import { LeaveReview, ViewReviews } from './Reviews';
import { EditProfile, NotificationsSettings, Privacy, Help, Contact, Terms } from './Settings';
import NotificationsPanel, { useNotifications } from './Notifications';
import ChambaLogo from './HardhatIcon';
import OnboardingCarousel from './Onboarding';

const pageVariants = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -16, scale: 0.98 },
};

const pageTransition = {
  duration: 0.35,
  ease: [0.4, 0, 0.2, 1],
};

function PageWrap({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const [page, setPage] = useState(() => {
    const seen = localStorage.getItem('chamba_seen');
    return seen ? 'home' : 'onboarding_carousel';
  });
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [showNotifs, setShowNotifs] = useState(false);

  const { notifications, unreadCount } = useNotifications(userInfo?.uid);

  function handleAuthSuccess(role, info) {
    setUser({ role });
    setUserInfo(info);
    if (role === 'worker' && !info.onboarded) {
      setPage('onboarding');
    } else if (role === 'worker') {
      setPage('jobfeed');
    } else {
      setPage('feed');
    }
  }

  function handleSendOffer(worker) {
    setSelectedWorker(worker);
    setPage('offer');
  }

  function handleChat(worker) {
    const workerUid = worker.uid || worker.id;
    const chatId = [userInfo?.uid, workerUid].sort().join('_');
    setChatData({ chatId, otherPerson: { ...worker, uid: workerUid } });
    setPage('chat');
  }

  function handleLeaveReview(target, jobTitle) {
    setReviewData({ revieweeId: target.id || target.uid || target.name, revieweeName: target.name, jobTitle: jobTitle || '' });
    setPage('leavereview');
  }

  function handleViewReviews(target) {
    setReviewData({ revieweeId: target.id || target.uid || target.name, revieweeName: target.name });
    setPage('viewreviews');
  }

  function handleNotifNavigate(destination, data) {
    if (destination === 'chat' && data) {
      setChatData({ chatId: data.chatId, otherPerson: { name: data.senderName, uid: data.senderUid } });
      setPage('chat');
    } else {
      setPage(destination);
    }
    setShowNotifs(false);
  }

  function handleOpenChatFromMessages(data) {
    setChatData(data);
    setPage('chat');
  }

  if (page === 'onboarding_carousel') {
    return (
      <OnboardingCarousel onDone={() => {
        localStorage.setItem('chamba_seen', 'true');
        setPage('auth');
      }} />
    );
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo" onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
          <ChambaLogo size={36} />
          Chamba
        </div>
        <div className="nav-links">
          {user && user.role === 'worker' && <span onClick={() => setPage('jobfeed')}>Jobs</span>}
          {user && user.role === 'contractor' && <span onClick={() => setPage('feed')}>Find workers</span>}
          {user && user.role === 'contractor' && <span onClick={() => setPage('postjob')}>Post a job</span>}
          {!user && <button className="nav-cta" onClick={() => setPage('auth')}>Get started</button>}
          {!user && <button className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }} onClick={() => setPage('auth')}>Log in</button>}
          {user && (
            <div className="notif-bell" onClick={() => setPage('messages')} style={{ cursor: 'pointer' }}>
              <span style={{ fontSize: 18 }}>💬</span>
            </div>
          )}
          {user && (
            <div className="notif-bell" onClick={() => setShowNotifs(!showNotifs)}>
              <span className="notif-bell-icon">🔔</span>
              {unreadCount > 0 && (
                <div className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>
              )}
            </div>
          )}
          {user && (
            <span style={{ fontSize: 13, color: '#1D9E75', cursor: 'pointer', fontWeight: 600 }} onClick={() => setPage('dashboard')}>
              My account
            </span>
          )}
        </div>
      </nav>

      {showNotifs && user && (
        <>
          <div className="notif-overlay" onClick={() => setShowNotifs(false)} />
          <NotificationsPanel
            user={userInfo}
            notifications={notifications}
            onClose={() => setShowNotifs(false)}
            onNavigate={handleNotifNavigate}
          />
        </>
      )}

      <AnimatePresence mode="wait">

        {page === 'home' && (
          <PageWrap key="home">
            <div className="hero">
              <div className="badge">Built for the trades</div>
              <h1>Connect with contractors who need <span>skilled workers</span> today</h1>
              <p>Connect with skilled workers and contractors instantly — no fees, no middleman, just results.</p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={() => setPage('auth')}>Find work near me</button>
                <button className="btn-outline" onClick={() => setPage('auth')}>I need workers</button>
              </div>
              <div className="stats-row">
  <div className="stat">
    <div className="stat-num">✓</div>
    <div className="stat-label">Free to join</div>
  </div>
  <div className="stat">
    <div className="stat-num">✓</div>
    <div className="stat-label">No middleman fees</div>
  </div>
  <div className="stat">
    <div className="stat-num">✓</div>
    <div className="stat-label">Direct contractor contact</div>
  </div>
</div>
            </div>
          </PageWrap>
        )}

        {page === 'onboarding' && (
          <PageWrap key="onboarding">
            <WorkerOnboarding
              user={userInfo}
              onComplete={(data) => {
                setUserInfo(prev => ({ ...prev, ...data, onboarded: true }));
                setPage('membership');
              }}
            />
          </PageWrap>
        )}

        {page === 'membership' && (
          <PageWrap key="membership">
            <div className="form-page">
              <div className="auth-card" style={{ maxWidth: 560 }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                  <h2 style={{ marginBottom: 8, fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px' }}>Welcome to Chamba!</h2>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Chamba is completely free during our launch period. No credit card needed — just start finding work.</p>
                </div>

                <div style={{ background: 'var(--accent-ultra-light)', border: '2px solid var(--accent)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent-dark)', marginBottom: 6 }}>Free Launch Access</div>
                  <div style={{ fontSize: 14, color: 'var(--accent-dark)' }}>All features are free while we grow. We will give you plenty of notice before introducing any paid plans.</div>
                </div>

                <div style={{ background: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 20, boxShadow: 'var(--neu-shadow-inset)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.8px' }}>What you get for free:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Apply to jobs near you', 'Your profile visible to contractors', 'Direct messaging with contractors', 'Job offers and instant notifications', 'Keep 100% of your wages — always'].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 16 }}>✓</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="btn-primary"
                  style={{ width: '100%', padding: 16, fontSize: 15 }}
                  onClick={() => {
                    setUserInfo(prev => ({ ...prev, membership: 'basic' }));
                    setPage('jobfeed');
                  }}
                >
                  Start finding work — it's free
                </button>

                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                  No credit card required. Free during launch period.
                </div>
              </div>
            </div>
          </PageWrap>
        )}

        {page === 'jobfeed' && (
          <PageWrap key="jobfeed">
            <JobFeed
              user={userInfo}
              onBack={() => setPage('home')}
              onLeaveReview={(job) => handleLeaveReview({ id: job.contractorId, name: job.contractorName }, job.title)}
              onUpgrade={() => setPage('membership')}
            />
          </PageWrap>
        )}

        {page === 'postjob' && (
          <PageWrap key="postjob">
            <PostJob
              contractor={userInfo}
              onBack={() => setPage('feed')}
              onPosted={() => setPage('feed')}
            />
          </PageWrap>
        )}

        {page === 'auth' && (
          <PageWrap key="auth">
            <Auth onSuccess={handleAuthSuccess} />
          </PageWrap>
        )}

        {page === 'worker' && (
          <PageWrap key="worker">
            <WorkerProfile
              worker={selectedWorker}
              contractor={userInfo}
              onBack={() => setPage('feed')}
              onSendOffer={handleSendOffer}
              onChat={handleChat}
              onLeaveReview={(w) => handleLeaveReview(w, '')}
              onViewReviews={handleViewReviews}
            />
          </PageWrap>
        )}

        {page === 'offer' && (
          <PageWrap key="offer">
            <JobOffer
              worker={selectedWorker}
              contractor={userInfo}
              onBack={() => setPage('worker')}
              onSent={() => setPage('feed')}
            />
          </PageWrap>
        )}

        {page === 'chat' && chatData && (
          <PageWrap key="chat">
            <Chat
              chatId={chatData.chatId}
              user={userInfo}
              otherPerson={chatData.otherPerson}
              onBack={() => setPage('messages')}
            />
          </PageWrap>
        )}

        {page === 'messages' && (
          <PageWrap key="messages">
            <Messages
              user={userInfo}
              onOpenChat={handleOpenChatFromMessages}
              onBack={() => setPage(user?.role === 'worker' ? 'jobfeed' : 'feed')}
            />
          </PageWrap>
        )}

        {page === 'leavereview' && reviewData && (
          <PageWrap key="leavereview">
            <LeaveReview
              reviewer={userInfo}
              revieweeId={reviewData.revieweeId}
              revieweeName={reviewData.revieweeName}
              jobTitle={reviewData.jobTitle}
              onBack={() => setPage(user?.role === 'worker' ? 'jobfeed' : 'worker')}
              onDone={() => setPage(user?.role === 'worker' ? 'jobfeed' : 'worker')}
            />
          </PageWrap>
        )}

        {page === 'viewreviews' && reviewData && (
          <PageWrap key="viewreviews">
            <ViewReviews
              userId={reviewData.revieweeId}
              userName={reviewData.revieweeName}
              onBack={() => setPage('worker')}
            />
          </PageWrap>
        )}

        {page === 'feed' && (
          <PageWrap key="feed">
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 24px 0' }}>
                <button className="btn-primary" style={{ fontSize: 13, padding: '9px 20px' }} onClick={() => setPage('postjob')}>
                  + Post a job
                </button>
              </div>
              <WorkerFeed
                contractor={userInfo}
                onBack={() => setPage('home')}
                onViewProfile={(w) => { setSelectedWorker(w); setPage('worker'); }}
              />
            </div>
          </PageWrap>
        )}

        {page === 'dashboard' && (
          <PageWrap key="dashboard">
            <Dashboard
              user={{ ...user, ...userInfo }}
              onSignOut={() => { setUser(null); setUserInfo(null); setPage('home'); }}
              onNavigate={(p) => setPage(p)}
            />
          </PageWrap>
        )}

        {page === 'editprofile' && (
          <PageWrap key="editprofile">
            <EditProfile
              user={{ uid: userInfo?.uid, name: userInfo?.name, email: userInfo?.email, phone: userInfo?.phone, zip: userInfo?.zip, trade: userInfo?.trade, role: user?.role }}
              onBack={() => setPage('dashboard')}
              onSave={(updated) => { setUserInfo(prev => ({ ...prev, ...updated })); setPage('dashboard'); }}
            />
          </PageWrap>
        )}

        {page === 'offers' && (
          <PageWrap key="offers">
            <Offers
              user={{ ...user, ...userInfo }}
              onBack={() => setPage('dashboard')}
            />
          </PageWrap>
        )}

        {page === 'myjobs' && (
          <PageWrap key="myjobs">
            <MyJobs
              contractor={userInfo}
              onBack={() => setPage('dashboard')}
              onChat={(worker) => {
                const chatId = [userInfo?.uid || 'guest', worker.uid || worker.name].sort().join('_');
                setChatData({ chatId, otherPerson: worker });
                setPage('chat');
              }}
            />
          </PageWrap>
        )}

        {page === 'notifications' && (
          <PageWrap key="notifications">
            <NotificationsSettings onBack={() => setPage('dashboard')} />
          </PageWrap>
        )}

        {page === 'privacy' && (
          <PageWrap key="privacy">
            <Privacy
              onBack={() => setPage('dashboard')}
              user={userInfo}
              onDeleteAccount={() => { setUser(null); setUserInfo(null); setPage('home'); }}
            />
          </PageWrap>
        )}

        {page === 'help' && (
          <PageWrap key="help">
            <Help onBack={() => setPage('dashboard')} />
          </PageWrap>
        )}

        {page === 'contact' && (
          <PageWrap key="contact">
            <Contact onBack={() => setPage('dashboard')} user={userInfo} />
          </PageWrap>
        )}

        {page === 'terms' && (
          <PageWrap key="terms">
            <Terms onBack={() => setPage('dashboard')} />
          </PageWrap>
        )}

        {page === 'contractors' && (
          <PageWrap key="contractors">
            <div className="form-page">
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 12 }}>Find workers for your next job</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>Posting jobs on Chamba is completely free. Browse skilled workers in your area and hire the right person fast.</p>
              <div style={{ marginTop: 24, marginBottom: 32 }}>
                <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 15 }} onClick={() => setPage('auth')}>Post a job for free</button>
              </div>
              <div className="steps">
                <div className="step"><div className="step-num">1</div><div><strong>Create a free account</strong><p>Sign up as a contractor in under a minute.</p></div></div>
                <div className="step"><div className="step-num">2</div><div><strong>Post your job</strong><p>Describe what you need, when, and where. It is free to post.</p></div></div>
                <div className="step"><div className="step-num">3</div><div><strong>Browse and hire</strong><p>Browse worker profiles, check ratings, and reach out directly.</p></div></div>
              </div>
              <button className="btn-back" onClick={() => setPage('home')} style={{ marginTop: 24 }}>Back</button>
            </div>
          </PageWrap>
        )}

        {page === 'how' && (
          <PageWrap key="how">
            <div className="form-page">
              <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px', marginBottom: 24 }}>How Chamba works</h2>
              <div className="steps">
                <div className="step"><div className="step-num">1</div><div><strong>Create your profile</strong><p>List your trade, skills, experience, and availability. Takes 2 minutes.</p></div></div>
                <div className="step"><div className="step-num">2</div><div><strong>Browse open jobs near you</strong><p>See contractor job posts in your area — daily work, short term, and long term gigs.</p></div></div>
                <div className="step"><div className="step-num">3</div><div><strong>Get hired and get paid</strong><p>Connect directly with the contractor, show up, and get paid. No middleman taking a cut of your wages.</p></div></div>
              </div>
              <button className="btn-back" onClick={() => setPage('home')} style={{ marginTop: 24 }}>Back</button>
            </div>
          </PageWrap>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;