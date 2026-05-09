import React, { useState } from 'react';

const slides = [
    {
        emoji: '👷',
        title: 'Find work near you',
        description: 'Browse jobs posted by contractors and homeowners in your area. Electricians, plumbers, carpenters, and more — all in one place.',
        color: '#1D9E75',
    },
    {
        emoji: '🏗️',
        title: 'Get hired fast',
        description: 'Create your profile in 2 minutes, set your availability, and contractors will reach out directly. No middleman, no waiting.',
        color: '#0f6e56',
    },
    {
        emoji: '💰',
        title: 'Keep 100% of your wages',
        description: 'Chamba never takes a cut of what you earn. You and the contractor agree on pay directly. Simple, fair, transparent.',
        color: '#1D9E75',
    },
];

export default function OnboardingCarousel({ onDone }) {
    const [current, setCurrent] = useState(0);
    const [touchStart, setTouchStart] = useState(null);

    function next() {
        if (current < slides.length - 1) setCurrent(current + 1);
        else onDone();
    }

    function prev() {
        if (current > 0) setCurrent(current - 1);
    }

    function handleTouchStart(e) {
        setTouchStart(e.touches[0].clientX);
    }

    function handleTouchEnd(e) {
        if (touchStart === null) return;
        const diff = touchStart - e.changedTouches[0].clientX;
        if (diff > 50) next();
        if (diff < -50) prev();
        setTouchStart(null);
    }

    const slide = slides[current];

    return (
        <div
            style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'white', userSelect: 'none' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>

                <div style={{ width: 120, height: 120, borderRadius: '50%', background: '#e1f5ee', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', fontSize: 56 }}>
                    {slide.emoji}
                </div>

                <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111', marginBottom: 16, lineHeight: 1.3 }}>
                    {slide.title}
                </h1>

                <p style={{ fontSize: 16, color: '#555', lineHeight: 1.7, marginBottom: 48 }}>
                    {slide.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40 }}>
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrent(i)}
                            style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? slide.color : '#ddd', cursor: 'pointer', transition: 'all 0.3s' }}
                        />
                    ))}
                </div>

                <button
                    onClick={next}
                    style={{ width: '100%', padding: '15px', background: slide.color, color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}
                >
                    {current === slides.length - 1 ? 'Get started' : 'Next'}
                </button>

                {current < slides.length - 1 && (
                    <button
                        onClick={onDone}
                        style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 14, cursor: 'pointer', padding: 8 }}
                    >
                        Skip
                    </button>
                )}

            </div>
        </div>
    );
}