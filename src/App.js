import React, { useState } from 'react';
import './App.css';
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
import { LeaveReview, ViewReviews } from './Reviews';
import { EditProfile, NotificationsSettings, Privacy, Help, Contact, Terms } from './Settings';
import NotificationsPanel, { useNotifications } from './Notifications';
import ChambaLogo from './HardhatIcon';
import OnboardingCarousel from './Onboarding';

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
        const chatId = [userInfo?.uid || 'guest', worker.id || worker.uid || worker.name].sort().join('_');
        setChatData({ chatId, otherPerson: worker });
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
                    {!user && <span onClick={() => setPage('contractors')}>For contractors</span>}
                    {user && user.role === 'worker' && <span onClick={() => setPage('jobfeed')}>Jobs</span>}
                    {user && user.role === 'contractor' && <span onClick={() => setPage('feed')}>Find workers</span>}
                    {user && user.role === 'contractor' && <span onClick={() => setPage('postjob')}>Post a job</span>}
                    {!user && <button className="nav-cta" onClick={() => setPage('auth')}>Get started</button>}
                    {!user && <button className="btn-outline" style={{ fontSize: 13, padding: '7px 16px' }} onClick={() => setPage('auth')}>Log in</button>}
                    {user && (
                        <div className="notif-bell" onClick={() => setShowNotifs(!showNotifs)}>
                            <span className="notif-bell-icon">🔔</span>
                            {unreadCount > 0 && (
                                <div className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>
                            )}
                        </div>
                    )}
                    {user && (
                        <span style={{ fontSize: 13, color: '#1D9E75', cursor: 'pointer', fontWeight: 500 }} onClick={() => setPage('dashboard')}>
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

            {page === 'home' && (
                <div className="hero">
                    <div className="badge">Built for the trades</div>
                    <h1>Connect with contractors who need skilled workers today</h1>
                    <p>No more standing outside Home Depot. Chamba connects electricians, plumbers, carpenters, and general laborers directly with contractors who have open jobs right now.</p>
                    <div className="hero-btns">
                        <button className="btn-primary" onClick={() => setPage('auth')}>Find work near me</button>
                        <button className="btn-outline" onClick={() => setPage('auth')}>I need workers</button>
                    </div>
                    <div className="stats-row">
                        <div className="stat"><div className="stat-num">800+</div><div className="stat-label">Active workers</div></div>
                        <div className="stat"><div className="stat-num">200+</div><div className="stat-label">Contractors hiring</div></div>
                        <div className="stat"><div className="stat-num">4.8★</div><div className="stat-label">Avg. rating</div></div>
                    </div>
                </div>
            )}

            {page === 'onboarding' && (
                <WorkerOnboarding
                    user={userInfo}
                    onComplete={(data) => {
                        setUserInfo(prev => ({ ...prev, ...data, onboarded: true }));
                        setPage('membership');
                    }}
                />
            )}

            {page === 'membership' && (
                <div className="form-page">
                    <div className="auth-card" style={{ maxWidth: 560 }}>
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                            <h2 style={{ marginBottom: 8 }}>Welcome to Chamba!</h2>
                            <p style={{ fontSize: 14, color: '#555' }}>Chamba is completely free during our launch period. No credit card needed — just start finding work.</p>
                        </div>

                        <div style={{ background: '#e1f5ee', border: '1px solid #1D9E75', borderRadius: 12, padding: '20px', marginBottom: 20, textAlign: 'center' }}>
                            <div style={{ fontSize: 24, marginBottom: 8 }}>🚀</div>
                            <div style={{ fontSize: 16, fontWeight: 600, color: '#0f6e56', marginBottom: 6 }}>Free Launch Access</div>
                            <div style={{ fontSize: 14, color: '#0f6e56' }}>All features are free while we grow. We will give you plenty of notice before introducing any paid plans.</div>
                        </div>

                        <div style={{ background: '#f9f9f9', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 10 }}>What you get for free:</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {['Apply to jobs near you', 'Your profile visible to contractors', 'Direct messaging with contractors', 'Job offers and instant notifications', 'Keep 100% of your wages — always'].map(item => (
                                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#444' }}>
                                        <span style={{ color: '#1D9E75', fontWeight: 600 }}>✓</span>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%', padding: 14, fontSize: 15 }}
                            onClick={() => {
                                setUserInfo(prev => ({ ...prev, membership: 'basic' }));
                                setPage('jobfeed');
                            }}
                        >
                            Start finding work — it's free
                        </button>

                        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#aaa' }}>
                            No credit card required. Free during launch period.
                        </div>
                    </div>
                </div>
            )}

            {page === 'jobfeed' && (
                <JobFeed
                    user={userInfo}
                    onBack={() => setPage('home')}
                    onLeaveReview={(job) => handleLeaveReview({ id: job.contractorId, name: job.contractorName }, job.title)}
                    onUpgrade={() => setPage('membership')}
                />
            )}

            {page === 'postjob' && (
                <PostJob
                    contractor={userInfo}
                    onBack={() => setPage('feed')}
                    onPosted={() => setPage('feed')}
                />
            )}

            {page === 'auth' && (
                <Auth onSuccess={handleAuthSuccess} />
            )}

            {page === 'worker' && (
                <WorkerProfile
                    worker={selectedWorker}
                    contractor={userInfo}
                    onBack={() => setPage('feed')}
                    onSendOffer={handleSendOffer}
                    onChat={handleChat}
                    onLeaveReview={(w) => handleLeaveReview(w, '')}
                    onViewReviews={handleViewReviews}
                />
            )}

            {page === 'offer' && (
                <JobOffer
                    worker={selectedWorker}
                    contractor={userInfo}
                    onBack={() => setPage('worker')}
                    onSent={() => setPage('feed')}
                />
            )}

            {page === 'chat' && chatData && (
                <Chat
                    chatId={chatData.chatId}
                    user={userInfo}
                    otherPerson={chatData.otherPerson}
                    onBack={() => setPage(user?.role === 'worker' ? 'jobfeed' : 'worker')}
                />
            )}

            {page === 'leavereview' && reviewData && (
                <LeaveReview
                    reviewer={userInfo}
                    revieweeId={reviewData.revieweeId}
                    revieweeName={reviewData.revieweeName}
                    jobTitle={reviewData.jobTitle}
                    onBack={() => setPage(user?.role === 'worker' ? 'jobfeed' : 'worker')}
                    onDone={() => setPage(user?.role === 'worker' ? 'jobfeed' : 'worker')}
                />
            )}

            {page === 'viewreviews' && reviewData && (
                <ViewReviews
                    userId={reviewData.revieweeId}
                    userName={reviewData.revieweeName}
                    onBack={() => setPage('worker')}
                />
            )}

            {page === 'feed' && (
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
            )}

            {page === 'dashboard' && (
                <Dashboard
                    user={{ ...user, ...userInfo }}
                    onSignOut={() => { setUser(null); setUserInfo(null); setPage('home'); }}
                    onNavigate={(p) => setPage(p)}
                />
            )}

            {page === 'editprofile' && (
                <EditProfile
                    user={{ uid: userInfo?.uid, name: userInfo?.name, email: userInfo?.email, phone: userInfo?.phone, zip: userInfo?.zip, trade: userInfo?.trade, role: user?.role }}
                    onBack={() => setPage('dashboard')}
                    onSave={(updated) => { setUserInfo(prev => ({ ...prev, ...updated })); setPage('dashboard'); }}
                />
            )}

            {page === 'offers' && (
                <Offers
                    user={{ ...user, ...userInfo }}
                    onBack={() => setPage('dashboard')}
                />
            )}

            {page === 'myjobs' && (
                <MyJobs
                    contractor={userInfo}
                    onBack={() => setPage('dashboard')}
                    onChat={(worker) => {
                        const chatId = [userInfo?.uid || 'guest', worker.uid || worker.name].sort().join('_');
                        setChatData({ chatId, otherPerson: worker });
                        setPage('chat');
                    }}
                />
            )}

            {page === 'notifications' && <NotificationsSettings onBack={() => setPage('dashboard')} />}
            {page === 'privacy' && (
                <Privacy
                    onBack={() => setPage('dashboard')}
                    user={userInfo}
                    onDeleteAccount={() => { setUser(null); setUserInfo(null); setPage('home'); }}
                />
            )}
            {page === 'help' && <Help onBack={() => setPage('dashboard')} />}
            {page === 'contact' && <Contact onBack={() => setPage('dashboard')} user={userInfo} />}
            {page === 'terms' && <Terms onBack={() => setPage('dashboard')} />}

            {page === 'contractors' && (
                <div className="form-page">
                    <h2>Find workers for your next job</h2>
                    <p>Posting jobs on Chamba is completely free. Browse skilled workers in your area and hire the right person fast.</p>
                    <div style={{ marginTop: 24, marginBottom: 32 }}>
                        <button className="btn-primary" style={{ padding: '13px 32px', fontSize: 15 }} onClick={() => setPage('auth')}>Post a job for free</button>
                    </div>
                    <div className="steps">
                        <div className="step"><div className="step-num">1</div><div><strong>Create a free account</strong><p>Sign up as a contractor in under a minute.</p></div></div>
                        <div className="step"><div className="step-num">2</div><div><strong>Post your job</strong><p>Describe what you need, when, and where. It is free to post.</p></div></div>
                        <div className="step"><div className="step-num">3</div><div><strong>Browse and hire</strong><p>Browse worker profiles, check ratings, and reach out directly.</p></div></div>
                    </div>
                    <button className="btn-back" onClick={() => setPage('home')}>Back</button>
                </div>
            )}

            {page === 'how' && (
                <div className="form-page">
                    <h2>How Chamba works</h2>
                    <div className="steps">
                        <div className="step"><div className="step-num">1</div><div><strong>Create your profile</strong><p>List your trade, skills, experience, and availability. Takes 2 minutes.</p></div></div>
                        <div className="step"><div className="step-num">2</div><div><strong>Browse open jobs near you</strong><p>See contractor job posts in your area — daily work, short term, and long term gigs.</p></div></div>
                        <div className="step"><div className="step-num">3</div><div><strong>Get hired and get paid</strong><p>Connect directly with the contractor, show up, and get paid. No middleman taking a cut of your wages.</p></div></div>
                    </div>
                    <button className="btn-back" onClick={() => setPage('home')}>Back</button>
                </div>
            )}

        </div>
    );
}

export default App;