import React, { useState } from 'react';

const steps = [
  {
    key: 'trade',
    title: "What's your main trade?",
    hint: 'Pick the one that best describes your primary skill.',
    options: [
      { label: 'Electrician', value: 'electrician' },
      { label: 'Plumber', value: 'plumber' },
      { label: 'Carpenter', value: 'carpenter' },
      { label: 'General laborer', value: 'laborer' },
      { label: 'HVAC', value: 'hvac' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    key: 'experience',
    title: 'How much experience do you have?',
    hint: 'Be honest — contractors will see this on your profile.',
    options: [
      { label: 'Less than 1 year', value: 'entry' },
      { label: '1 – 3 years', value: 'junior' },
      { label: '3 – 7 years', value: 'mid' },
      { label: '7+ years', value: 'senior' },
    ],
  },
  {
    key: 'availability',
    title: 'When are you available?',
    hint: 'Contractors will filter by availability so be accurate.',
    options: [
      { label: 'Right now', value: 'now' },
      { label: 'This week', value: 'week' },
      { label: 'Next week', value: 'nextweek' },
      { label: 'Flexible', value: 'flexible' },
    ],
  },
  {
    key: 'type',
    title: 'What kind of work are you looking for?',
    hint: 'You can update this anytime from your profile.',
    options: [
      { label: 'Daily / as needed', value: 'daily' },
      { label: 'Short term (1–4 weeks)', value: 'short' },
      { label: 'Long term (1+ months)', value: 'long' },
      { label: 'Any', value: 'any' },
    ],
  },
];

export default function JobForm({ onBack }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [done, setDone] = useState(false);

  const current = steps[step];
  const progress = ((step) / (steps.length + 1)) * 100;

  function select(key, val) {
    setAnswers(prev => ({ ...prev, [key]: val }));
  }

  function next() {
    if (step < steps.length) setStep(step + 1);
  }

  function back() {
    if (step === 0) onBack();
    else setStep(step - 1);
  }

  if (done) {
    return (
      <div className="form-page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Profile created!</h2>
          <p>Contractors in your area can now find you. We'll text you when someone wants to hire you.</p>
          <button className="btn-primary" onClick={onBack}>Back to home</button>
        </div>
      </div>
    );
  }

  if (step === steps.length) {
    return (
      <div className="form-page">
        <div className="progress-bar"><div className="progress-fill" style={{ width: '90%' }}></div></div>
        <p className="step-label">Step {step + 1} of {steps.length + 1}</p>
        <h2>Last step — your contact info</h2>
        <p>This is how contractors will reach you. Your phone number is kept private until you accept a job.</p>

        <label className="field-label">Your name</label>
        <input
          className="text-input"
          type="text"
          placeholder="First and last name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <label className="field-label">Phone number</label>
        <input
          className="text-input"
          type="tel"
          placeholder="(555) 000-0000"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <label className="field-label">Your zip code</label>
        <input
          className="text-input"
          type="text"
          maxLength={5}
          placeholder="e.g. 94550"
          value={zip}
          onChange={e => setZip(e.target.value)}
        />

        <div className="btn-row">
          <button className="btn-back" onClick={back}>← Back</button>
          <button
            className="btn-primary"
            disabled={name.length < 2 || phone.length < 10 || zip.length !== 5}
            onClick={() => setDone(true)}
          >
            Create my profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="step-label">Step {step + 1} of {steps.length + 1}</p>
      <h2>{current.title}</h2>
      <p>{current.hint}</p>

      <div className="opt-grid">
        {current.options.map(opt => (
          <div
            key={opt.value}
            className={`opt ${answers[current.key] === opt.value ? 'selected' : ''}`}
            onClick={() => select(current.key, opt.value)}
          >
            {opt.label}
          </div>
        ))}
      </div>

      <div className="btn-row">
        <button className="btn-back" onClick={back}>← Back</button>
        <button
          className="btn-primary"
          disabled={!answers[current.key]}
          onClick={next}
        >
          Next
        </button>
      </div>
    </div>
  );
}