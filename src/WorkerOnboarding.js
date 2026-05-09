import React, { useState } from 'react';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

const tradeOptions = ['Electrician', 'Plumber', 'Carpenter', 'General laborer', 'HVAC', 'Painter', 'Roofer', 'Welder', 'Mason', 'Other'];
const skillOptions = {
    Electrician: ['Panel upgrades', 'EV charger install', 'Wiring', 'Outlets', 'Lighting', 'Service calls', 'Conduit', 'Code compliance'],
    Plumber: ['Pipe repair', 'Water heaters', 'Drain cleaning', 'Gas lines', 'Sewer', 'Full repiping', 'Fixtures'],
    Carpenter: ['Framing', 'Finish work', 'Cabinets', 'Decks', 'Drywall', 'Flooring', 'Trim', 'Doors & windows'],
    'General laborer': ['Demo', 'Site cleanup', 'Material handling', 'Painting', 'Landscaping', 'Moving', 'Loading'],
    HVAC: ['AC install', 'Furnace repair', 'Duct work', 'Refrigerants', 'Thermostats', 'Mini splits'],
    Painter: ['Interior', 'Exterior', 'Spray painting', 'Drywall prep', 'Texture', 'Cabinet painting'],
    Roofer: ['Shingle install', 'Flat roofing', 'Repairs', 'Gutters', 'Flashing', 'Inspections'],
    Welder: ['MIG', 'TIG', 'Stick', 'Structural', 'Pipe welding', 'Fabrication'],
    Mason: ['Brick', 'Block', 'Stone', 'Concrete', 'Stucco', 'Tile'],
    Other: ['General construction', 'Labor', 'Maintenance', 'Repairs'],
};
const toolOptions = ['Power drill', 'Circular saw', 'Multi-meter', 'Pipe wrench', 'Nail gun', 'Level', 'Conduit bender', 'Oscillating tool', 'Angle grinder', 'Ladder', 'Own truck/vehicle'];

export default function WorkerOnboarding({ user, onComplete }) {
    const [step, setStep] = useState(0);
    const [trade, setTrade] = useState('');
    const [experience, setExperience] = useState('');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedTools, setSelectedTools] = useState([]);
    const [availability, setAvailability] = useState('');
    const [rate, setRate] = useState('');
    const [zip, setZip] = useState('');
    const [bio, setBio] = useState('');
    const [saving, setSaving] = useState(false);

    const progress = ((step) / 5) * 100;

    function toggleSkill(skill) {
        setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    }

    function toggleTool(tool) {
        setSelectedTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
    }

    async function handleFinish() {
        setSaving(true);
        try {
            await updateDoc(doc(db, 'users', user.uid), {
                trade, experience, skills: selectedSkills, tools: selectedTools,
                availability, rate, zip, bio, onboarded: true,
            });
            onComplete({ trade, experience, skills: selectedSkills, tools: selectedTools, availability, rate, zip, bio });
        } catch (e) {
            console.error(e);
            setSaving(false);
        }
    }

    const steps = [
        // Step 0 - Trade
        <div key={0}>
            <h2>What is your main trade?</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Pick the one that best describes your primary skill.</p>
            <div className="opt-grid">
                {tradeOptions.map(t => (
                    <div key={t} className={`opt ${trade === t ? 'selected' : ''}`} onClick={() => setTrade(t)}>{t}</div>
                ))}
            </div>
            <div className="btn-row">
                <span></span>
                <button className="btn-primary" disabled={!trade} onClick={() => setStep(1)}>Next</button>
            </div>
        </div>,

        // Step 1 - Experience
        <div key={1}>
            <h2>How much experience do you have?</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Be honest — contractors will see this on your profile.</p>
            <div className="opt-grid">
                {['Less than 1 year', '1 - 3 years', '3 - 7 years', '7+ years'].map(e => (
                    <div key={e} className={`opt ${experience === e ? 'selected' : ''}`} onClick={() => setExperience(e)}>{e}</div>
                ))}
            </div>
            <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(0)}>Back</button>
                <button className="btn-primary" disabled={!experience} onClick={() => setStep(2)}>Next</button>
            </div>
        </div>,

        // Step 2 - Skills
        <div key={2}>
            <h2>What are your skills?</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Select all that apply. This helps contractors find you for the right jobs.</p>
            <div className="opt-grid">
                {(skillOptions[trade] || skillOptions.Other).map(s => (
                    <div key={s} className={`opt ${selectedSkills.includes(s) ? 'selected' : ''}`} onClick={() => toggleSkill(s)}>{s}</div>
                ))}
            </div>
            <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(1)}>Back</button>
                <button className="btn-primary" disabled={selectedSkills.length === 0} onClick={() => setStep(3)}>Next</button>
            </div>
        </div>,

        // Step 3 - Tools
        <div key={3}>
            <h2>What tools do you own?</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Contractors love workers who come prepared. Select everything you have.</p>
            <div className="opt-grid">
                {toolOptions.map(t => (
                    <div key={t} className={`opt ${selectedTools.includes(t) ? 'selected' : ''}`} onClick={() => toggleTool(t)}>{t}</div>
                ))}
            </div>
            <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(2)}>Back</button>
                <button className="btn-primary" disabled={selectedTools.length === 0} onClick={() => setStep(4)}>Next</button>
            </div>
        </div>,

        // Step 4 - Availability, rate, zip
        <div key={4}>
            <h2>Last details</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>This is what contractors see first when browsing workers.</p>

            <label className="field-label">When are you available?</label>
            <div className="opt-grid" style={{ marginBottom: 20 }}>
                {['Right now', 'This week', 'Next week', 'Flexible'].map(a => (
                    <div key={a} className={`opt ${availability === a ? 'selected' : ''}`} onClick={() => setAvailability(a)}>{a}</div>
                ))}
            </div>

            <label className="field-label">Your hourly rate</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 16, color: '#555' }}>$</span>
                <input className="text-input" type="number" placeholder="e.g. 35" value={rate} onChange={e => setRate(e.target.value)} style={{ maxWidth: 120 }} />
                <span style={{ fontSize: 14, color: '#888' }}>/hr</span>
            </div>

            <label className="field-label">Your zip code</label>
            <input className="text-input" type="text" maxLength={5} placeholder="e.g. 94550" value={zip} onChange={e => setZip(e.target.value)} style={{ marginBottom: 16 }} />

            <label className="field-label">Short bio (optional)</label>
            <textarea className="text-input" rows={3} placeholder="Tell contractors a bit about yourself and your work..." value={bio} onChange={e => setBio(e.target.value)} style={{ resize: 'none', lineHeight: 1.5 }} />

            <div className="btn-row">
                <button className="btn-back" onClick={() => setStep(3)}>Back</button>
                <button className="btn-primary" disabled={!availability || !rate || zip.length !== 5 || saving} onClick={handleFinish}>
                    {saving ? 'Saving...' : 'Finish setup'}
                </button>
            </div>
        </div>,
    ];

    return (
        <div className="form-page">
            <div className="progress-bar" style={{ marginBottom: 8 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="step-label" style={{ marginBottom: 20 }}>Step {step + 1} of 5</p>
            {steps[step]}
        </div>
    );
}