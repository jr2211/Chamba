import React, { useState } from 'react';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

const tradeOptions = [
  'Appliance repair',
  'Auto mechanic',
  'Car detailing',
  'Carpenter',
  'Concrete & flatwork',
  'Drywall',
  'Electrician',
  'Flooring installer',
  'General laborer',
  'Glass & glazing',
  'Handyman',
  'HVAC',
  'Insulation installer',
  'Landscaper',
  'Locksmith',
  'Mason',
  'Mover',
  'Painter',
  'Pest control',
  'Plumber',
  'Pool technician',
  'Power washing',
  'Roofer',
  'Security system installer',
  'Solar installer',
  'Tile setter',
  'Tree trimmer',
  'Welder',
  'Window & door installer',
  'Other',
];

const skillOptions = {
  'Appliance repair': ['Washer/dryer repair', 'Refrigerator repair', 'Dishwasher repair', 'Oven/stove repair', 'Microwave repair', 'HVAC appliances', 'Garbage disposal', 'Ice maker repair'],
  'Auto mechanic': ['Oil changes', 'Brake service', 'Engine repair', 'Transmission', 'Electrical systems', 'Suspension', 'Diagnostics', 'Tire rotation & alignment'],
  'Car detailing': ['Interior cleaning', 'Exterior wash & wax', 'Paint correction', 'Ceramic coating', 'Upholstery cleaning', 'Engine bay cleaning', 'Window tinting', 'Odor elimination'],
  Carpenter: ['Framing', 'Finish work', 'Cabinets', 'Decks', 'Drywall', 'Flooring', 'Trim', 'Doors & windows', 'Stairs & railings', 'Custom furniture'],
  'Concrete & flatwork': ['Slab pour', 'Driveways', 'Sidewalks', 'Stamped concrete', 'Concrete repair', 'Retaining walls', 'Foundations', 'Concrete cutting'],
  Drywall: ['Hanging drywall', 'Taping & mudding', 'Texture', 'Patching', 'Finish sanding', 'Soundproofing', 'Fire rated assemblies', 'Level 5 finish'],
  Electrician: ['Panel upgrades', 'EV charger install', 'Wiring', 'Outlets', 'Lighting', 'Service calls', 'Conduit', 'Code compliance', 'Generator hookup', 'Smart home wiring'],
  'Flooring installer': ['Hardwood', 'Laminate', 'Vinyl plank', 'Tile', 'Carpet', 'Subfloor prep', 'Baseboards', 'Epoxy flooring'],
  'General laborer': ['Demo', 'Site cleanup', 'Material handling', 'Painting', 'Landscaping', 'Moving', 'Loading', 'Trenching'],
  'Glass & glazing': ['Window installation', 'Glass replacement', 'Shower doors', 'Mirrors', 'Storefronts', 'Skylights', 'Glass repair', 'Frameless glass'],
  Handyman: ['General repairs', 'Furniture assembly', 'Drywall patching', 'Painting', 'Fixture installation', 'Caulking', 'Door & window repair', 'TV mounting'],
  HVAC: ['AC install', 'Furnace repair', 'Duct work', 'Refrigerants', 'Thermostats', 'Mini splits', 'Air quality systems', 'Commercial HVAC'],
  'Insulation installer': ['Batt insulation', 'Blown-in insulation', 'Spray foam', 'Attic insulation', 'Wall insulation', 'Vapor barrier', 'Radiant barrier', 'Crawl space insulation'],
  Landscaper: ['Lawn mowing', 'Irrigation systems', 'Tree planting', 'Sod installation', 'Hardscaping', 'Cleanup & debris removal', 'Fertilizing', 'Retaining walls'],
  Locksmith: ['Lock installation', 'Lockouts', 'Rekeying', 'Safe installation', 'Electronic locks', 'Commercial locks', 'Deadbolt install', 'Master key systems'],
  Mason: ['Brick', 'Block', 'Stone', 'Concrete', 'Stucco', 'Tile', 'Chimney repair', 'Tuckpointing'],
  Mover: ['Residential moves', 'Commercial moves', 'Furniture assembly', 'Packing & unpacking', 'Piano moving', 'Long distance moves', 'Storage solutions', 'Junk removal'],
  Painter: ['Interior', 'Exterior', 'Spray painting', 'Drywall prep', 'Texture', 'Cabinet painting', 'Deck staining', 'Epoxy floors'],
  'Pest control': ['Rodent control', 'Termite treatment', 'Bed bug treatment', 'Ant & roach control', 'Fumigation', 'Preventative treatment', 'Wildlife removal', 'Wasp & bee removal'],
  Plumber: ['Pipe repair', 'Water heaters', 'Drain cleaning', 'Gas lines', 'Sewer', 'Full repiping', 'Fixtures', 'Water filtration'],
  'Pool technician': ['Pool cleaning', 'Chemical balancing', 'Filter maintenance', 'Pump repair', 'Tile cleaning', 'Pool plastering', 'Leak detection', 'Heater repair'],
  'Power washing': ['Driveways', 'Decks & patios', 'House exterior', 'Fences', 'Roofs', 'Commercial properties', 'Graffiti removal', 'Fleet washing'],
  Roofer: ['Shingle install', 'Flat roofing', 'Repairs', 'Gutters', 'Flashing', 'Inspections', 'Skylight install', 'Metal roofing'],
  'Security system installer': ['Camera installation', 'Alarm systems', 'Access control', 'Smart home integration', 'Commercial security', 'Intercoms', 'Motion sensors', 'Video doorbells'],
  'Solar installer': ['Panel installation', 'Inverter setup', 'Battery storage', 'Electrical connection', 'Roof mounting', 'System monitoring', 'EV charger integration', 'Ground mount systems'],
  'Tile setter': ['Floor tile', 'Wall tile', 'Backsplash', 'Shower tile', 'Grout & caulk', 'Stone installation', 'Mosaic tile', 'Large format tile'],
  'Tree trimmer': ['Tree trimming', 'Tree removal', 'Stump grinding', 'Emergency tree service', 'Crown reduction', 'Deadwood removal', 'Cabling & bracing', 'Land clearing'],
  Welder: ['MIG', 'TIG', 'Stick', 'Structural', 'Pipe welding', 'Fabrication', 'Aluminum welding', 'Stainless steel'],
  'Window & door installer': ['Window replacement', 'Door installation', 'Sliding doors', 'French doors', 'Window repair', 'Weatherproofing', 'Storm doors', 'Garage doors'],
  Other: ['General construction', 'Labor', 'Maintenance', 'Repairs', 'Cleaning', 'Assembly', 'Installation', 'Inspection'],
};

const toolOptions = {
  'Appliance repair': ['Multimeter', 'Screwdriver set', 'Pliers set', 'Soldering iron', 'Refrigerant gauges', 'Voltage tester', 'Appliance dolly'],
  'Auto mechanic': ['Socket set', 'Torque wrench', 'OBD scanner', 'Jack stands', 'Floor jack', 'Impact wrench', 'Brake bleeder kit'],
  'Car detailing': ['Pressure washer', 'Polisher/buffer', 'Wet/dry vacuum', 'Steam cleaner', 'Detail brushes', 'Microfiber towels', 'Foam cannon'],
  Carpenter: ['Circular saw', 'Miter saw', 'Framing square', 'Level', 'Nail gun', 'Tape measure', 'Chisels', 'Router', 'Table saw', 'Speed square'],
  'Concrete & flatwork': ['Concrete mixer', 'Bull float', 'Trowels', 'Screed board', 'Edger', 'Concrete saw', 'Vibrator'],
  Drywall: ['Drywall lift', 'Taping knives', 'Mud pan', 'Corner bead tool', 'Sander', 'Screw gun', 'T-square'],
  Electrician: ['Wire stripper', 'Conduit bender', 'Multi-meter', 'Fish tape', 'Voltage tester', 'Lineman pliers', 'Cable puller', 'Drill & bits', 'Pipe bender'],
  'Flooring installer': ['Flooring nailer', 'Miter saw', 'Tapping block', 'Pull bar', 'Knee pads', 'Tile saw', 'Notched trowel'],
  'General laborer': ['Shovel', 'Wheelbarrow', 'Sledgehammer', 'Pry bar', 'Hand truck', 'Power drill', 'Utility knife', 'Own truck/vehicle'],
  'Glass & glazing': ['Glass cutter', 'Suction cups', 'Glazing knife', 'Heat gun', 'Silicone gun', 'Glass pliers', 'Measuring tools'],
  Handyman: ['Power drill', 'Level', 'Stud finder', 'Caulk gun', 'Utility knife', 'Hammer', 'Screwdriver set', 'Ladder', 'Tape measure'],
  HVAC: ['Refrigerant gauges', 'Vacuum pump', 'Leak detector', 'Multimeter', 'Pipe cutter', 'Drill & bits', 'Tin snips', 'Recovery machine'],
  'Insulation installer': ['Insulation blower', 'Spray foam gun', 'Utility knife', 'Staple gun', 'Safety gear', 'Measuring tape', 'Respirator'],
  Landscaper: ['Lawn mower', 'Weed trimmer', 'Leaf blower', 'Hedge trimmer', 'Shovel & rake', 'Wheelbarrow', 'Irrigation tools', 'Own truck/trailer'],
  Locksmith: ['Lock pick set', 'Key cutter', 'Plug follower', 'Tension wrenches', 'Drill', 'RFID programmer', 'Scope'],
  Mason: ['Trowel set', 'Masonry saw', 'Level', 'Mixing drill', 'Grout bag', 'Jointing tool', 'Cold chisel', 'Brick hammer'],
  Mover: ['Furniture dolly', 'Appliance dolly', 'Moving straps', 'Furniture blankets', 'Stretch wrap', 'Box cutter', 'Own truck/van'],
  Painter: ['Airless sprayer', 'Roller set', 'Brush set', 'Ladder', 'Paint tray', 'Tape & plastic', 'Caulk gun', 'Sander', 'Drop cloths'],
  'Pest control': ['Sprayer', 'Duster', 'Bait stations', 'Inspection light', 'Respirator', 'Safety gear', 'Drill for wall treatment'],
  Plumber: ['Pipe wrench', 'Pipe cutter', 'Drain snake', 'Press fitting tool', 'Torch & solder kit', 'Channel locks', 'PEX crimper', 'Pipe threader'],
  'Pool technician': ['Test kit', 'Pool vacuum', 'Skimmer net', 'Brush', 'Chemical kit', 'Filter wrench', 'Pump tester'],
  'Power washing': ['Pressure washer', 'Surface cleaner attachment', 'Extension wand', 'Nozzle set', 'Chemical injector', 'Own truck/trailer'],
  Roofer: ['Roofing nailer', 'Pry bar', 'Roofing shovel', 'Ladder', 'Safety harness', 'Chalk line', 'Utility knife', 'Heat gun'],
  'Security system installer': ['Cable tester', 'Drill & bits', 'Fish tape', 'Multimeter', 'Crimping tool', 'Laptop for programming', 'Lift/ladder'],
  'Solar installer': ['Drill & bits', 'Torque wrench', 'Multimeter', 'Wire stripper', 'Conduit bender', 'Safety harness', 'Mounting hardware tools'],
  'Tile setter': ['Tile saw', 'Notched trowel', 'Grout float', 'Level', 'Tile spacers', 'Rubber mallet', 'Knee pads', 'Angle grinder'],
  'Tree trimmer': ['Chainsaw', 'Pole saw', 'Wood chipper', 'Climbing gear', 'Safety harness', 'Stump grinder', 'Own truck/trailer'],
  Welder: ['MIG welder', 'TIG welder', 'Stick welder', 'Angle grinder', 'Welding helmet', 'Chipping hammer', 'Wire brush', 'Plasma cutter'],
  'Window & door installer': ['Drill & bits', 'Level', 'Pry bar', 'Caulk gun', 'Shims', 'Measuring tape', 'Utility knife', 'Miter saw'],
  Other: ['Power drill', 'Level', 'Tape measure', 'Utility knife', 'Ladder', 'Safety gear', 'Hand tools', 'Own truck/vehicle'],
};

export default function WorkerOnboarding({ user, onComplete }) {
  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState('');
  const [experience, setExperience] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkill, setCustomSkill] = useState('');
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

  function addCustomSkill() {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed)) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setCustomSkill('');
    }
  }

  function handleTradeSelect(t) {
    setTrade(t);
    setSelectedSkills([]);
    setSelectedTools([]);
    setCustomSkill('');
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
    <div key={0}>
      <h2>What is your main trade?</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Pick the one that best describes your primary skill.</p>
      <div className="opt-grid">
        {tradeOptions.map(t => (
          <div key={t} className={`opt ${trade === t ? 'selected' : ''}`} onClick={() => handleTradeSelect(t)}>{t}</div>
        ))}
      </div>
      <div className="btn-row">
        <span></span>
        <button className="btn-primary" disabled={!trade} onClick={() => setStep(1)}>Next</button>
      </div>
    </div>,

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

    <div key={2}>
      <h2>What are your skills?</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Select all that apply. You can also add your own.</p>
      <div className="opt-grid">
        {(skillOptions[trade] || skillOptions.Other).map(s => (
          <div key={s} className={`opt ${selectedSkills.includes(s) ? 'selected' : ''}`} onClick={() => toggleSkill(s)}>{s}</div>
        ))}
      </div>

      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#111', marginBottom: 8 }}>Don't see your skill? Add it:</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            className="text-input"
            placeholder="e.g. Solar panel wiring"
            value={customSkill}
            onChange={e => setCustomSkill(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomSkill()}
            style={{ flex: 1 }}
          />
          <button
            className="btn-outline"
            style={{ padding: '10px 16px', fontSize: 13, whiteSpace: 'nowrap' }}
            onClick={addCustomSkill}
            disabled={!customSkill.trim()}
          >
            + Add
          </button>
        </div>
      </div>

      {selectedSkills.filter(s => !(skillOptions[trade] || skillOptions.Other).includes(s)).length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Your custom skills:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {selectedSkills
              .filter(s => !(skillOptions[trade] || skillOptions.Other).includes(s))
              .map(s => (
                <div
                  key={s}
                  style={{ background: '#e1f5ee', color: '#0f6e56', fontSize: 13, padding: '5px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  {s}
                  <span
                    style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
                    onClick={() => setSelectedSkills(prev => prev.filter(x => x !== s))}
                  >×</span>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="btn-row">
        <button className="btn-back" onClick={() => setStep(1)}>Back</button>
        <button className="btn-primary" disabled={selectedSkills.length === 0} onClick={() => setStep(3)}>Next</button>
      </div>
    </div>,

    <div key={3}>
      <h2>What tools do you own?</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>
        Select everything you have. Contractors love workers who come prepared.
        {trade && <span style={{ color: '#1D9E75', fontWeight: 500 }}> Showing tools for {trade}.</span>}
      </p>
      <div className="opt-grid">
        {(toolOptions[trade] || toolOptions.Other).map(t => (
          <div key={t} className={`opt ${selectedTools.includes(t) ? 'selected' : ''}`} onClick={() => toggleTool(t)}>{t}</div>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn-back" onClick={() => setStep(2)}>Back</button>
        <button className="btn-primary" disabled={selectedTools.length === 0} onClick={() => setStep(4)}>Next</button>
      </div>
    </div>,

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