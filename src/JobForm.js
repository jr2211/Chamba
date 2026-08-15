import React, { useState, useMemo } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   TRADE CATALOG  (45 trades)
───────────────────────────────────────────────────────────────────────────── */
const TRADES = [
  { value: 'electrician',     label: 'Electrician',             icon: '⚡' },
  { value: 'plumber',         label: 'Plumber',                 icon: '🔧' },
  { value: 'carpenter',       label: 'Carpenter',               icon: '🪚' },
  { value: 'hvac',            label: 'HVAC',                    icon: '❄️'  },
  { value: 'painter',         label: 'Painter',                 icon: '🎨' },
  { value: 'roofer',          label: 'Roofer',                  icon: '🏠' },
  { value: 'landscaper',      label: 'Landscaper',              icon: '🌿' },
  { value: 'aquascaper',      label: 'Aquascaper',              icon: '🐠' },
  { value: 'mason',           label: 'Mason / Concrete',        icon: '🧱' },
  { value: 'welder',          label: 'Welder / Fabricator',     icon: '🔥' },
  { value: 'flooring',        label: 'Flooring Installer',      icon: '🪵' },
  { value: 'drywaller',       label: 'Drywaller',               icon: '📋' },
  { value: 'insulation',      label: 'Insulation',              icon: '🧤' },
  { value: 'tile',            label: 'Tile Setter',             icon: '◻️'  },
  { value: 'glazier',         label: 'Glazier / Glass',         icon: '🪟' },
  { value: 'pool',            label: 'Pool & Spa',              icon: '🏊' },
  { value: 'solar',           label: 'Solar Installer',         icon: '☀️'  },
  { value: 'fire_protection', label: 'Fire Protection',         icon: '🚒' },
  { value: 'irrigation',      label: 'Irrigation Tech',         icon: '💧' },
  { value: 'fence',           label: 'Fence Installer',         icon: '🚧' },
  { value: 'cabinet',         label: 'Cabinet Maker',           icon: '🗄️'  },
  { value: 'countertop',      label: 'Countertop Installer',    icon: '🔲' },
  { value: 'appliance',       label: 'Appliance Repair',        icon: '🛠️'  },
  { value: 'locksmith',       label: 'Locksmith',               icon: '🔐' },
  { value: 'paving',          label: 'Asphalt / Paving',        icon: '🛣️'  },
  { value: 'demolition',      label: 'Demolition',              icon: '💥' },
  { value: 'tree_service',    label: 'Tree Service / Arborist', icon: '🌳' },
  { value: 'pest_control',    label: 'Pest Control',            icon: '🐛' },
  { value: 'window_door',     label: 'Window & Door',           icon: '🚪' },
  { value: 'stucco',          label: 'Stucco / Plaster',        icon: '🏛️'  },
  { value: 'security',        label: 'Security Systems',        icon: '📷' },
  { value: 'av',              label: 'Audio / Visual',          icon: '📺' },
  { value: 'moving',          label: 'Moving / Hauling',        icon: '📦' },
  { value: 'septic',          label: 'Septic Systems',          icon: '🪣' },
  { value: 'well',            label: 'Well Drilling / Pumps',   icon: '🕳️'  },
  { value: 'elevator',        label: 'Elevator / Lift',         icon: '🛗' },
  { value: 'marine',          label: 'Marine / Boat Repair',    icon: '⛵' },
  { value: 'automotive',      label: 'Automotive / Mechanic',   icon: '🚗' },
  { value: 'snow_removal',    label: 'Snow Removal',            icon: '🌨️'  },
  { value: 'scaffolding',     label: 'Scaffolding',             icon: '📏' },
  { value: 'ironworker',      label: 'Steel / Iron Worker',     icon: '⚙️'  },
  { value: 'crane',           label: 'Crane Operator',          icon: '🏗️'  },
  { value: 'equipment',       label: 'Equipment Operator',      icon: '🚜' },
  { value: 'surveyor',        label: 'Surveyor',                icon: '📐' },
  { value: 'laborer',         label: 'General Laborer',         icon: '👷' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   SKILLS BY TRADE  (~30–45 skills per trade)
───────────────────────────────────────────────────────────────────────────── */
const SKILLS = {
  electrician: [
    'Residential Wiring', 'Commercial Wiring', 'Industrial Wiring',
    'Panel Upgrades & Replacements', 'Circuit Breaker Installation',
    'Outlet & Switch Installation', 'Recessed Lighting', 'Ceiling Fan Installation',
    'EV Charger Installation', 'Solar PV Wiring', 'Generator Installation',
    'Transfer Switch Installation', 'Underground Conduit & Wiring',
    'EMT Conduit Bending', 'Rigid Conduit Bending', 'PVC Conduit Installation',
    'Wire Pulling & Termination', 'Low Voltage Wiring', 'Smart Home Integration',
    'Fire Alarm Systems', 'Security Camera Wiring', 'Cat5e / Cat6 Cabling',
    'Motor Control Wiring', 'VFD Installation', 'Three-Phase Systems',
    'Transformer Installation', 'High Voltage (480V+)', 'Grounding & Bonding',
    'Electrical Troubleshooting', 'Code Compliance & Inspection Prep',
    'Energy Management Systems', 'Lighting Controls & Dimmers',
    'Disconnect Switches', 'Temporary Power Setup', 'Load Calculations',
    'Arc Flash Studies', 'Metering & CT Installation',
  ],
  plumber: [
    'Copper Pipe Installation', 'PVC Pipe Installation', 'PEX Pipe Installation',
    'ABS Drain Piping', 'CPVC Piping', 'Drain Cleaning',
    'Hydrojetting', 'Leak Detection & Repair', 'Water Heater Installation (Tank)',
    'Tankless Water Heater Installation', 'Bathroom Fixture Installation',
    'Kitchen Plumbing', 'Sewer Line Repair', 'Sewer Line Replacement',
    'Trenchless Pipe Lining', 'Camera Inspection (CCTV)',
    'Backflow Prevention Device Installation', 'Gas Line Installation',
    'Gas Pressure Testing', 'Water Softener Installation',
    'Water Filtration Systems', 'Radiant Floor Heating',
    'Septic System Service', 'Well Pump Service', 'Commercial Plumbing',
    'Steam Systems', 'Medical Gas Piping', 'Grease Trap Installation',
    'Fire Suppression Plumbing', 'Storm Drain Systems',
    'Shower Pan & Waterproofing', 'Toilet Repair & Replacement',
    'Faucet Repair & Replacement', 'Water Pressure Regulation',
    'Expansion Tank Installation', 'Pipe Insulation',
  ],
  carpenter: [
    'Rough Framing', 'Finish Carpentry', 'Cabinet Making',
    'Door Hanging & Adjustment', 'Window Installation',
    'Deck Building', 'Pergola & Arbor Construction',
    'Stairs & Railing Installation', 'Crown Molding & Casing',
    'Baseboard & Trim', 'Built-ins & Custom Shelving',
    'Hardwood Flooring Installation', 'Laminate Flooring Installation',
    'Engineered Wood Flooring', 'Furniture Building',
    'Architectural Millwork', 'Timber Framing', 'Post & Beam Construction',
    'Subfloor Installation', 'Shed & Structure Building',
    'Concrete Formwork', 'Wood Carving & Detail Work',
    'Acoustic Panel Installation', 'Wall Paneling & Wainscoting',
    'Coffered Ceiling Installation', 'Exterior Siding Installation',
    'Soffit & Fascia', 'Pocket Door Installation', 'Barn Door Installation',
    'Skylight Framing', 'Attic Conversion Framing',
    'Garage Conversion Framing', 'Trellis & Garden Structure',
  ],
  hvac: [
    'Residential HVAC Installation', 'Commercial HVAC Installation',
    'Ductwork Fabrication', 'Duct Installation', 'Duct Sealing',
    'Duct Insulation', 'System Maintenance & Tune-up',
    'Refrigerant Handling (EPA 608)', 'Mini-Split Installation',
    'Multi-Zone Mini-Split', 'Heat Pump Installation',
    'Boiler Installation', 'Boiler Service & Repair',
    'Radiant Heating', 'Geothermal System Installation',
    'Zoning System Design', 'Air Balancing', 'Indoor Air Quality Systems',
    'UV Light & Air Purifier Install', 'HEPA Filtration',
    'Energy Recovery Ventilator (ERV)', 'HRV Installation',
    'Exhaust Fan Installation', 'Commercial Refrigeration',
    'Walk-in Cooler / Freezer', 'Chiller Systems',
    'BMS / Building Controls', 'Load Calculations (Manual J)',
    'Thermostat & Controls Programming', 'Smart Thermostat Installation',
    'Air Handler Replacement', 'Condenser Unit Replacement',
    'Coil Cleaning', 'Drain Line Cleaning', 'Emergency HVAC Repair',
  ],
  painter: [
    'Interior Painting', 'Exterior Painting', 'Commercial Painting',
    'Industrial Coating', 'Spray Application (HVLP)',
    'Airless Spray Application', 'Cabinet Painting',
    'Cabinet Refinishing', 'Deck Staining', 'Deck Sealing',
    'Fence Staining', 'Faux Finish', 'Venetian Plaster Finish',
    'Decorative Painting', 'Epoxy Floor Coating',
    'Anti-Graffiti Coatings', 'Wallpaper Hanging', 'Wallpaper Removal',
    'Surface Preparation & Repair', 'Lead Paint Testing & Removal',
    'Texture Matching', 'Orange Peel Texture', 'Knockdown Texture',
    'Popcorn Ceiling Removal', 'EIFS / Stucco Painting',
    'Line Marking & Striping', 'Safety Coatings',
    'Electrostatic Painting', 'Wood Staining & Varnishing',
    'Lacquer Finishing', 'Roof Coating', 'Concrete Floor Sealing',
  ],
  roofer: [
    'Asphalt Shingle Installation', 'Architectural Shingle Installation',
    'Metal Roofing (Standing Seam)', 'Metal Roofing (Corrugated)',
    'Tile Roofing (Clay)', 'Tile Roofing (Concrete)',
    'Slate Roofing', 'TPO Flat Roofing', 'EPDM Flat Roofing',
    'Modified Bitumen', 'Built-Up Roofing (BUR)',
    'Spray Foam Roofing', 'Roof Coating & Restoration',
    'Roof Repair & Patching', 'Emergency Roof Tarping',
    'Roof Inspection & Assessment', 'Gutter Installation',
    'Gutter Cleaning & Repair', 'Gutter Guard Installation',
    'Flashing Installation', 'Valley Flashing', 'Step Flashing',
    'Chimney Flashing & Repair', 'Skylight Installation',
    'Solar Panel Roofing Integration', 'Green / Living Roof',
    'Cedar Shake & Shingle', 'Ice & Water Shield Application',
    'Fascia & Soffit Repair', 'Ridge Vent Installation',
    'Power Vent Installation', 'Decking & Sheathing Replacement',
    'Drip Edge Installation',
  ],
  landscaper: [
    'Lawn Maintenance & Mowing', 'Edging & Trimming',
    'Sod Installation', 'Hydroseeding', 'Overseeding',
    'Lawn Aeration', 'Dethatching', 'Fertilizing',
    'Weed Control & Herbicide Application', 'Pest Control (Lawn)',
    'Planting & Transplanting', 'Flower Bed Design & Installation',
    'Perennial & Annual Planting', 'Shrub & Hedge Installation',
    'Tree Planting', 'Mulching & Ground Cover',
    'Rock & Gravel Landscaping', 'Decorative Stone Work',
    'Irrigation System Design', 'Drip Irrigation',
    'Smart Irrigation Controllers', 'Irrigation Repair',
    'Retaining Wall Construction', 'Garden Wall Design',
    'Grading & Drainage', 'French Drain Installation',
    'Dry Creek Bed Installation', 'Pathway & Walkway Design',
    'Patio Installation', 'Artificial Turf Installation',
    'Xeriscaping', 'Native Plant Landscaping',
    'Drought-Tolerant Design', 'Outdoor Lighting Installation',
    'Landscape Design & Planning', 'Erosion Control',
    'Compost & Soil Amendment', 'Rain Garden Construction',
    'Bioswale Installation', 'Wildflower Meadow Establishment',
  ],
  aquascaper: [
    'Freshwater Planted Aquarium Setup', 'Marine / Reef Tank Setup',
    'Biotope Aquarium Design', 'Dutch Style Aquascape',
    'Iwagumi Style Aquascape', 'Nature Aquarium Design',
    'Hardscape Layout (Rocks)', 'Hardscape Layout (Driftwood)',
    'CO2 System Installation', 'Pressurized CO2 Setup',
    'DIY CO2 Systems', 'Canister Filter Installation',
    'Sump System Design', 'Protein Skimmer Setup',
    'Refugium Design', 'LED Lighting System Design',
    'PAR Measurement & Optimization', 'Water Chemistry Management',
    'EI / PPS Pro Dosing Setup', 'Automated Dosing Pump Setup',
    'Fish & Coral Stocking', 'Live Rock Aquascaping',
    'Nano Tank Design', 'Large Display Tank Setup',
    'Rimless Tank Installation', 'Custom Sump Fabrication',
    'Acrylic Tank Repair', 'Glass Tank Repair',
    'Pond Construction', 'Koi Pond Design',
    'Koi Pond Filtration', 'Waterfall & Stream Features',
    'Bog Filter Setup', 'Aquaponics System Design',
    'Aquaponics System Build', 'Terrarium Design',
    'Paludarium Design', 'Vivarium Construction',
    'Plant Propagation & Trimming', 'Algae Management & Prevention',
    'Tank Maintenance Programs', 'Custom Aquarium Cabinetry',
  ],
  mason: [
    'Brick Laying', 'Block Laying (CMU)',
    'Stone Masonry', 'Veneer Stone Installation',
    'Concrete Pouring & Finishing', 'Concrete Flatwork',
    'Concrete Stamping', 'Decorative Concrete',
    'Concrete Repair & Patching', 'Foundation Work',
    'Footing Installation', 'Retaining Wall (Concrete Block)',
    'Retaining Wall (Natural Stone)', 'Fireplace Construction',
    'Outdoor Kitchen Construction', 'Fire Pit Construction',
    'Chimney Construction & Repair', 'Tuckpointing & Repointing',
    'Masonry Waterproofing', 'Concrete Sealing',
    'Epoxy Injection (Crack Repair)', 'Mortar Mixing & Application',
    'Wall Coping', 'Steps & Stairs (Masonry)',
    'Arches & Lintels', 'Historic Masonry Restoration',
    'Shotcrete Application', 'Paving Stone Installation',
    'Brick Patio Installation', 'Concrete Block Walls',
  ],
  welder: [
    'MIG Welding (GMAW)', 'TIG Welding (GTAW)',
    'Stick Welding (SMAW)', 'Flux Core Welding (FCAW)',
    'Oxy-Acetylene Welding', 'Plasma Cutting',
    'Structural Steel Welding', 'Pipe Welding',
    'Pipe Welding (Certified)', 'Aluminum Welding',
    'Stainless Steel Welding', 'Cast Iron Welding & Repair',
    'Sheet Metal Fabrication', 'Custom Metal Fabrication',
    'Ornamental Iron Work', 'Handrail & Gate Fabrication',
    'Roll Cage Fabrication', 'Trailer Fabrication & Repair',
    'Heavy Equipment Repair', 'Pressure Vessel Welding',
    'Boiler Welding', 'Weld Inspection (CWI)',
    'Blueprint Reading', 'CNC Plasma Operation',
    'Metal Bending & Forming', 'Sandblasting & Surface Prep',
    'Grinding & Polishing', 'Underwater Welding',
  ],
  flooring: [
    'Hardwood Flooring Installation', 'Engineered Hardwood Installation',
    'Laminate Flooring Installation', 'Luxury Vinyl Plank (LVP)',
    'Luxury Vinyl Tile (LVT)', 'Sheet Vinyl Installation',
    'Carpet Installation', 'Carpet Stretching & Repair',
    'Tile Flooring Installation', 'Porcelain Tile Flooring',
    'Ceramic Tile Flooring', 'Natural Stone Flooring',
    'Slate Flooring', 'Travertine Flooring',
    'Concrete Flooring Finishing', 'Epoxy Floor Coating',
    'Metallic Epoxy', 'Polished Concrete',
    'Terrazzo Installation', 'Rubber Flooring',
    'Cork Flooring', 'Bamboo Flooring',
    'Subfloor Repair & Leveling', 'Self-Leveling Compound',
    'Moisture Barrier Installation', 'Radiant Heat Under Flooring',
    'Hardwood Floor Refinishing', 'Hardwood Floor Sanding',
    'Floor Staining', 'Floor Sealing & Finishing',
    'Transition Strip Installation', 'Commercial Flooring',
    'Athletic / Gym Flooring',
  ],
  drywaller: [
    'Drywall Hanging', 'Drywall Finishing (Level 5)',
    'Drywall Taping', 'Drywall Mudding',
    'Drywall Sanding', 'Drywall Repair & Patching',
    'Fire-Rated Drywall (Type X)', 'Moisture-Resistant Drywall',
    'Soundproof Drywall (QuietRock)', 'Exterior Sheathing',
    'Ceiling Drywall', 'Barrel Vault Ceiling',
    'Coffered Ceiling Framing', 'Tray Ceiling Framing',
    'Metal Stud Framing', 'Wood Stud Framing',
    'Curved Wall Framing', 'Shaft Wall Systems',
    'ACT (Acoustic Ceiling Tile)', 'Grid Ceiling Installation',
    'Spray Texture Application', 'Skip Trowel Texture',
    'Orange Peel Texture', 'Knockdown Texture',
    'Smooth Wall Finish', 'Skim Coating',
    'Blueboard & Veneer Plaster', 'Lath & Plaster Repair',
    'Commercial Drywall Systems',
  ],
  insulation: [
    'Fiberglass Batt Insulation', 'Blown-In Fiberglass',
    'Blown-In Cellulose', 'Mineral Wool / Rockwool Installation',
    'Open Cell Spray Foam', 'Closed Cell Spray Foam',
    'Rigid Foam Board Insulation', 'Polyiso Board Installation',
    'XPS Insulation', 'Radiant Barrier Installation',
    'Attic Insulation', 'Crawl Space Insulation',
    'Wall Cavity Insulation', 'Basement Rim Joist Insulation',
    'Pipe Insulation', 'Duct Insulation',
    'Thermal Bypass Sealing', 'Air Sealing',
    'Blower Door Testing', 'Energy Audit Support',
    'Weatherstripping', 'Caulking & Sealing',
    'Vapor Barrier Installation', 'Spray Foam for Roofing',
    'Commercial Insulation', 'Industrial Pipe Insulation',
    'High-Temperature Insulation', 'Sound / Acoustic Insulation',
  ],
  tile: [
    'Ceramic Tile Installation', 'Porcelain Tile Installation',
    'Natural Stone Tile (Marble)', 'Natural Stone Tile (Granite)',
    'Travertine Tile', 'Slate Tile', 'Glass Tile',
    'Mosaic Tile', 'Large Format Tile (24×24+)',
    'Rectified Tile Installation', 'Subway Tile',
    'Herringbone Pattern', 'Chevron Pattern',
    'Basketweave Pattern', 'Custom Tile Design',
    'Bathroom Tile Installation', 'Kitchen Backsplash',
    'Shower Tile & Pan', 'Steam Shower Construction',
    'Floor Tile Installation', 'Outdoor Tile Installation',
    'Pool Tile Installation', 'Fireplace Surround Tile',
    'Grout Application & Sealing', 'Grout Color Matching',
    'Epoxy Grout Application', 'Tile Removal & Replacement',
    'Membrane Waterproofing (Schluter)', 'Heated Floor Installation',
    'Tile Layout & Planning', 'Lippage Correction',
    'Concrete Backer Board', 'Schluter Systems',
  ],
  glazier: [
    'Storefront Glass Installation', 'Curtain Wall Installation',
    'Residential Window Glass Replacement', 'Commercial Glass Replacement',
    'Tempered Glass Installation', 'Laminated Glass',
    'Insulated Glass Unit (IGU) Replacement', 'Shower Door Installation',
    'Frameless Shower Glass', 'Glass Partition Installation',
    'Glass Balustrade / Railing', 'Mirror Installation',
    'Decorative Glass', 'Stained Glass Installation',
    'Glass Repair & Glazing Compound', 'Glass Block Installation',
    'Fire-Rated Glass', 'Blast-Resistant Glass',
    'Bullet-Resistant Glass', 'Glass Etching',
    'Window Tinting', 'Caulking & Sealing',
    'Aluminum Framing Systems', 'Storefront Door Installation',
    'Skylights Installation', 'Auto Glass Repair',
  ],
  pool: [
    'New Pool Construction (Gunite/Shotcrete)',
    'Fiberglass Pool Installation',
    'Vinyl Liner Pool Installation',
    'Above Ground Pool Installation',
    'Pool Renovation & Remodeling',
    'Pool Plastering & Re-plastering',
    'Pebble Tec / Aggregate Finish',
    'Pool Tile Installation & Repair',
    'Coping Installation & Replacement',
    'Pool Deck Construction', 'Pool Deck Resurfacing',
    'Pool Equipment Installation (Pump / Filter)',
    'Variable Speed Pump Installation',
    'Pool Heater Installation (Gas)',
    'Pool Heater Installation (Heat Pump)',
    'Solar Pool Heating', 'Pool Lighting (LED)',
    'Water Feature Installation', 'Waterfall & Rock Feature',
    'Spa / Hot Tub Installation', 'In-Ground Spa Construction',
    'Swim Jet Installation', 'Pool Automation Systems',
    'Salt Chlorine Generator', 'Pool Chemical Service',
    'Weekly Pool Maintenance', 'Pool Opening & Closing',
    'Pool Leak Detection', 'Pool Drain & Clean',
    'Algae Treatment', 'Plumbing Repair (Pool)',
    'Filter Media Replacement', 'Automatic Pool Cover Installation',
  ],
  solar: [
    'Residential Solar PV Installation', 'Commercial Solar PV Installation',
    'Utility-Scale Solar', 'Rooftop Solar Mounting',
    'Ground Mount Solar', 'Carport Solar Canopy',
    'Solar Tracking Systems', 'String Inverter Installation',
    'Microinverter Installation (Enphase)', 'Power Optimizer Systems (SolarEdge)',
    'Battery Storage Installation (Tesla Powerwall)',
    'Battery Storage (LG Chem / Generac)',
    'Off-Grid Solar System Design', 'Hybrid Solar System',
    'EV Charging Integration', 'Solar Monitoring Setup',
    'Conduit & Wiring for Solar', 'DC Disconnect Installation',
    'AC Disconnect Installation', 'Net Metering Setup',
    'Utility Interconnection', 'Solar Permit & Inspection Prep',
    'Solar Panel Cleaning & Maintenance', 'Solar Panel Repair',
    'Rapid Shutdown Compliance', 'Shade Analysis',
    'Energy Production Modeling (PVWatts)', 'BIPV (Building Integrated PV)',
  ],
  fire_protection: [
    'Wet Pipe Sprinkler System Installation',
    'Dry Pipe Sprinkler System', 'Pre-Action System',
    'Deluge Sprinkler System', 'CPVC Pipe for Fire Sprinkler',
    'Steel Pipe for Fire Sprinkler', 'Sprinkler Head Installation',
    'Sprinkler System Inspection', 'Sprinkler System Testing',
    'Backflow Preventer (Fire)', 'Fire Alarm Panel Installation',
    'Fire Alarm Device Wiring', 'Smoke Detector Installation',
    'Heat Detector Installation', 'Duct Smoke Detector',
    'Pull Station Installation', 'Notification Appliances (Horn / Strobe)',
    'Voice Evacuation Systems', 'Emergency Lighting',
    'Exit Sign Installation', 'Fire Suppression (Kitchen Hood)',
    'FM-200 / Clean Agent Suppression', 'CO2 Suppression System',
    'Fire Pump Installation', 'Jockey Pump Setup',
    'Standpipe System Installation', 'Hydrant Flow Testing',
    'NFPA 13 Compliance', 'NFPA 72 Compliance',
    'Ansul System Installation', 'Fire Door Hardware',
  ],
  irrigation: [
    'Residential Irrigation Design', 'Commercial Irrigation Design',
    'Sports Field Irrigation', 'Drip Irrigation System',
    'Micro-Sprinkler System', 'Rotary Nozzle Installation',
    'Hunter Controller Programming', 'Rain Bird Controller Programming',
    'Smart Irrigation Controllers (Rachio)', 'Flow Sensor Installation',
    'Rain Sensor Installation', 'Soil Moisture Sensor',
    'Backflow Preventer Installation', 'PVB Installation',
    'Mainline Installation', 'Lateral Line Installation',
    'Valve Box Installation', 'Zone Valve Replacement',
    'Irrigation System Repair', 'Leak Detection (Irrigation)',
    'Sprinkler Head Adjustment', 'Winterization / Blowout',
    'Spring Startup & Check', 'Pressure Regulation',
    'Irrigation Audit', 'ET-Based Scheduling',
    'Fertigation System', 'Agricultural Irrigation Systems',
    'Pivot Irrigation', 'Subsurface Drip Design',
  ],
  fence: [
    'Wood Privacy Fence', 'Cedar Fence Installation',
    'Redwood Fence', 'Picket Fence',
    'Split Rail Fence', 'Post & Rail Fence',
    'Chain Link Fence', 'Vinyl / PVC Fence',
    'Aluminum Fence', 'Wrought Iron Fence',
    'Steel Panel Fence', 'Ornamental Iron Fence',
    'Electric Security Fence', 'Farm & Ranch Fencing',
    'Barbed Wire Fence', 'High Tensile Wire Fence',
    'Horse / Livestock Fencing', 'Dog Run Construction',
    'Pool Code Fence (Safety Barrier)', 'Anti-Climb Fence',
    'Concrete Post Setting', 'Steel Post Setting',
    'Wooden Post Setting & Treatment', 'Fence Gate Installation',
    'Automatic Gate Installation', 'Sliding Gate Systems',
    'Swing Gate Systems', 'Gate Operator Installation',
    'Fence Repair & Board Replacement', 'Fence Staining & Sealing',
    'Sound Wall Construction', 'Fence Removal & Demolition',
  ],
  cabinet: [
    'Custom Cabinet Design', 'Semi-Custom Cabinet Installation',
    'Stock Cabinet Installation', 'Kitchen Cabinet Installation',
    'Bathroom Vanity Installation', 'Laundry Room Cabinetry',
    'Garage Cabinet Systems', 'Home Office Built-ins',
    'Entertainment Center Build', 'Mudroom Lockers',
    'Pantry Shelving Systems', 'Walk-In Closet Systems',
    'Reach-In Closet Organizers', 'Face Frame Construction',
    'Frameless / European Box Construction',
    'Dovetail Drawer Boxes', 'Soft-Close Hardware Installation',
    'Push-to-Open Hardware', 'Pull-Out Shelf Installation',
    'Lazy Susan Installation', 'Blind Corner Solutions',
    'Pull-Out Trash Bin', 'Cabinet Crown Molding',
    'Under-Cabinet LED Lighting', 'Glass Door Inserts',
    'Cabinet Painting & Refacing', 'Cabinet Refinishing',
    'Cabinet Repair & Touch-Up', 'Island Construction & Installation',
    'Floating Shelf Installation', 'Thermofoil Replacement',
  ],
  countertop: [
    'Granite Countertop Installation', 'Quartz Countertop Installation',
    'Marble Countertop Installation', 'Quartzite Countertop',
    'Soapstone Countertop', 'Slate Countertop',
    'Concrete Countertop Fabrication', 'Butcher Block Installation',
    'Laminate Countertop Installation', 'Solid Surface (Corian) Installation',
    'Stainless Steel Countertop', 'Dekton Countertop',
    'Porcelain Slab Countertop', 'Recycled Glass Countertop',
    'Countertop Templating (Digital)', 'CNC Fabrication',
    'Sink Cutout & Undermount Sink', 'Drop-In Sink Cutout',
    'Waterfall Edge Installation', 'Mitered Edge Detail',
    'Ogee Edge Profile', 'Eased Edge Profile',
    'Seam Placement & Polishing', 'Stone Sealing & Impregnation',
    'Countertop Repair & Chip Fill', 'Honed Finish',
    'Leather / Brushed Finish', 'Outdoor Countertop (BBQ / Kitchen)',
  ],
  appliance: [
    'Refrigerator Repair', 'Washer Repair',
    'Dryer Repair', 'Dishwasher Repair',
    'Oven / Range Repair', 'Microwave Repair',
    'Garbage Disposal Repair', 'Ice Maker Repair',
    'Wine Cooler Repair', 'Chest Freezer Repair',
    'Front-Load Washer Repair', 'Top-Load Washer Repair',
    'Dryer Heating Element Replacement', 'Control Board Replacement',
    'Motor Replacement', 'Compressor Diagnosis',
    'Refrigerant Recharge', 'Gas Appliance Repair',
    'Electric Appliance Repair', 'Smart Appliance Calibration',
    'Gas Range Installation', 'Electric Range Installation',
    'Cooktop Installation', 'Dishwasher Installation',
    'Over-Range Microwave Installation', 'Ventilation Hood Installation',
    'Refrigerator Water Line', 'Dryer Vent Cleaning',
  ],
  locksmith: [
    'Residential Lock Installation', 'Commercial Lock Installation',
    'Lock Rekeying', 'Master Key System Design',
    'High-Security Lock Installation (Medeco / Mul-T-Lock)',
    'Deadbolt Installation', 'Knob & Lever Replacement',
    'Mortise Lock Service', 'Panic Bar / Exit Device',
    'Electronic Keypad Lock Installation', 'Smart Lock Installation',
    'Access Control Systems', 'Card Reader Installation',
    'Keyless Entry Systems', 'Biometric Lock Installation',
    'Safe Opening & Repair', 'Safe Installation',
    'Automotive Lockout Service', 'Automotive Key Programming',
    'Transponder Key Cutting', 'Key Duplication',
    'Door Frame Repair (Lock-Related)', 'Strike Plate Replacement',
    'Security Door Installation', 'Cabinet Lock Installation',
    'Mailbox Lock Replacement', 'Emergency Lockout Service',
  ],
  paving: [
    'Asphalt Paving (New)', 'Asphalt Resurfacing / Overlay',
    'Asphalt Repair & Patching', 'Pothole Repair',
    'Crack Sealing & Filling', 'Sealcoating',
    'Parking Lot Line Striping', 'Traffic Control Layout',
    'Concrete Paving', 'Concrete Repair',
    'Curb & Gutter Installation', 'Sidewalk Construction',
    'Driveway Paving (Asphalt)', 'Driveway Paving (Concrete)',
    'Paver Stone Driveway', 'Gravel Driveway',
    'Drainage & Grading (Paving)', 'Base Course Compaction',
    'Sub-Base Preparation', 'Road Base Installation',
    'Tar & Chip (Chip Seal)', 'Permeable Paving',
    'Speed Bump Installation', 'Wheel Stop Installation',
    'ADA Ramp Installation', 'Milling (Cold Planer)',
    'Paving Equipment Operation',
  ],
  demolition: [
    'Interior Demolition', 'Exterior Demolition',
    'Selective Demolition', 'Full Structure Demolition',
    'Concrete Breaking & Removal', 'Jackhammering',
    'Saw Cutting (Concrete / Asphalt)', 'Load-Bearing Wall Removal',
    'Non-Load-Bearing Wall Removal', 'Floor Removal',
    'Tile Demolition', 'Hardwood Floor Removal',
    'Carpet Removal', 'Cabinet & Fixture Removal',
    'Pool Demolition', 'Chimney Demolition',
    'Asbestos Abatement', 'Lead Abatement',
    'Mold Remediation', 'Hazmat Disposal',
    'Debris Removal & Hauling', 'Dumpster Management',
    'Excavation (Small Scale)', 'Foundation Removal',
    'Underground Utility Marking', 'Salvage & Deconstruction',
    'Soft Demo (Fixtures Only)', 'Mechanical Demo',
  ],
  tree_service: [
    'Tree Trimming & Pruning', 'Crown Reduction',
    'Crown Thinning', 'Crown Lifting / Raising',
    'Deadwood Removal', 'Tree Removal',
    'Stump Grinding', 'Stump Removal',
    'Root Pruning', 'Deep Root Fertilization',
    'Tree Risk Assessment', 'Arborist Report (ISA)',
    'Tree Cabling & Bracing', 'Air Spading',
    'Soil Aeration (Deep)', 'Insect & Disease Treatment',
    'Tree Injection Treatments', 'Fire Clearance Trimming',
    'Hazardous Tree Removal', 'Emergency Tree Service',
    'Storm Damage Cleanup', 'Large Tree Crane Removal',
    'Tree Planting & Establishment', 'Palm Tree Trimming',
    'Palm Tree Removal', 'Land Clearing',
    'Brush Clearing', 'Chip & Mulch Recycling',
    'Log Splitting', 'Firewood Processing',
  ],
  pest_control: [
    'General Pest Inspection', 'Termite Inspection',
    'Termite Treatment (Liquid)', 'Termite Treatment (Bait)',
    'Fumigation (Tent)', 'Heat Treatment',
    'Rodent Control (Mice)', 'Rodent Control (Rats)',
    'Rodent Exclusion & Proofing', 'Bed Bug Treatment',
    'Bed Bug Heat Treatment', 'Cockroach Treatment',
    'Ant Control', 'Spider Control',
    'Wasp & Bee Removal', 'Beehive Relocation',
    'Mosquito Control', 'Flea & Tick Treatment',
    'Gopher & Mole Control', 'Bird Exclusion',
    'Pigeon Control', 'Wildlife Trapping & Removal',
    'Squirrel Exclusion', 'Raccoon Removal',
    'Organic / Green Pest Control', 'IPM (Integrated Pest Management)',
    'Pre-Construction Termite Treatment', 'Wood Destroying Pest Report (WDO)',
    'Fumigation Clearance Certificate',
  ],
  window_door: [
    'Window Replacement (Single / Double Hung)',
    'Window Replacement (Casement)', 'Window Replacement (Sliding)',
    'Window Replacement (Awning)', 'Bay & Bow Window Installation',
    'Egress Window Installation', 'Window Well Installation',
    'Vinyl Window Installation', 'Aluminum Window Installation',
    'Fiberglass Window Installation', 'Wood Window Restoration',
    'New Window Rough-In Framing', 'Exterior Door Installation',
    'Interior Door Installation', 'Prehung Door Installation',
    'French Door Installation', 'Bi-Fold Door Installation',
    'Pocket Door Installation', 'Sliding Glass Door Installation',
    'Patio Door Installation', 'Folding Glass Wall (NanaWall)',
    'Steel Security Door', 'Fiberglass Door Installation',
    'Door Frame Repair', 'Threshold Replacement',
    'Weatherstripping Installation', 'Door Sweep Installation',
    'Window & Door Caulking', 'Screen Repair & Replacement',
    'Window Trim & Casing', 'Barn Door Hardware Installation',
  ],
  stucco: [
    '3-Coat Stucco System', '2-Coat Stucco System',
    'One-Coat Stucco (Parex / EWI)', 'EIFS Installation',
    'EIFS Repair', 'Stucco Repair & Patching',
    'Stucco Crack Repair', 'Wire Lath Application',
    'Foam Lath Application', 'Scratch Coat Application',
    'Brown Coat Application', 'Finish Coat Application',
    'Smooth Stucco Finish', 'Sand Finish',
    'Dash / Float Texture', 'Cat Face Texture',
    'Santa Barbara Finish', 'El Dorado Finish',
    'Venetian Plaster Application', 'Interior Plaster (3-Coat)',
    'Interior Plaster (2-Coat)', 'Skim Coat Plaster',
    'Lime Plaster', 'Gypsum Plaster',
    'Ornamental Plaster Work', 'Plaster Molding & Restoration',
    'Stucco Waterproofing & Sealing', 'Foam Trim Molding',
    'Foam Cornice Installation', 'Color Coat Application',
  ],
  security: [
    'Security Camera (CCTV) Installation', 'IP Camera System',
    'Analog Camera System', 'PTZ Camera Installation',
    'NVR / DVR Setup & Programming', 'Video Surveillance Design',
    'Access Control System Installation', 'Door Buzzer & Entry System',
    'Card Reader Installation (HID / Fob)',
    'Biometric Access Control', 'Intercom System Installation',
    'Video Doorbell Installation', 'Alarm System Installation',
    'Motion Detector Installation', 'Door & Window Sensors',
    'Glass Break Sensor', 'Panic Button Installation',
    'Alarm Panel Programming', 'Smart Home Security Integration',
    'Network Setup for Security', 'Low Voltage Wiring',
    'Fiber Optic Cabling for Security', 'Fire Alarm Integration',
    'License Plate Recognition (LPR)', 'Perimeter Intrusion Detection',
    'Central Station Monitoring Setup', 'Remote Viewing Configuration',
    'Security System Maintenance',
  ],
  av: [
    'Home Theater Installation', 'Projector & Screen Installation',
    'In-Ceiling Speaker Installation', 'In-Wall Speaker Installation',
    'Outdoor Speaker System', 'Subwoofer Placement & Setup',
    'AV Receiver Installation & Calibration', 'TV Wall Mounting',
    'Motorized TV Lift', 'Motorized Screen Installation',
    'Whole-Home Audio (Sonos / Denon)', 'Multi-Zone Audio Distribution',
    'Smart Home AV Integration (Control4 / Lutron)',
    'Low Voltage & AV Wiring', 'HDMI Cable Management',
    'Conduit for AV Runs', 'Rack Build & Equipment Staging',
    'Commercial AV System', 'Conference Room AV',
    'Digital Signage Installation', 'LED Video Wall',
    'Intercom System', 'Distributed Video System',
    'Network AV (AV over IP)', 'Acoustic Panel Placement',
    'Soundproofing (Room-in-Room)', 'Telephone / VOIP System',
    'Antenna & Satellite Dish', 'Structured Wiring (Home)',
  ],
  moving: [
    'Local Moving', 'Long-Distance Moving',
    'Residential Moving', 'Commercial / Office Moving',
    'Piano Moving', 'Furniture Moving',
    'Heavy Item Moving', 'Hot Tub / Spa Moving',
    'Safe Moving', 'Appliance Moving',
    'Art & Antique Moving', 'Library / Book Moving',
    'Packing Services (Full)', 'Packing Services (Partial)',
    'Unpacking Services', 'Furniture Disassembly & Reassembly',
    'Truck Loading & Unloading', 'Packing Material Supply',
    'Climate-Controlled Transport', 'White-Glove Moving',
    'Senior Moving Services', 'Estate Moving',
    'Storage Unit Loading', 'Junk Removal & Hauling',
    'Debris Hauling', 'Construction Debris Removal',
    'Yard Waste Hauling', 'Donation Drop-Off Service',
  ],
  septic: [
    'Septic System Installation (New)', 'Septic Tank Pumping',
    'Septic Inspection', 'Percolation Test (Perc Test)',
    'Drain Field Design', 'Drain Field Installation',
    'Drain Field Repair / Replacement', 'Mound System Installation',
    'Aerobic Treatment Unit (ATU)', 'Drip Dispersal System',
    'Pressure Distribution System', 'Septic Tank Risers',
    'Septic Tank Repair & Replacement', 'Sewage Pump Installation',
    'Effluent Filter Maintenance', 'Root Intrusion Removal',
    'Septic System Troubleshooting', 'Septic Permit Assistance',
    'Grease Trap Pumping', 'Holding Tank Service',
    'Alternative Septic Technology', 'Composting Toilet Systems',
    'Septic Monitoring Systems', 'Sewer Tie-In Connection',
  ],
  well: [
    'Water Well Drilling', 'Well Casing Installation',
    'Well Screen Installation', 'Submersible Pump Installation',
    'Jet Pump Installation', 'Pressure Tank Replacement',
    'Well Yield Testing', 'Pump Flow Testing',
    'Water Quality Testing', 'Well Disinfection',
    'Well Rehabilitation', 'Well Abandonment / Decommissioning',
    'Pressure Switch Replacement', 'Control Box Replacement',
    'Pitless Adapter Installation', 'Well Seal & Cap Replacement',
    'Geothermal Well Drilling', 'Monitoring Well Installation',
    'Irrigation Well', 'Agricultural Well',
    'Well Water Filtration', 'Iron Filter Installation',
    'Arsenic Treatment Systems', 'Reverse Osmosis Install (Well)',
    'Well Pump Troubleshooting',
  ],
  elevator: [
    'Traction Elevator Installation', 'Hydraulic Elevator Installation',
    'MRL (Machine Room-Less) Elevator', 'Residential Elevator Installation',
    'Home Lift Installation', 'Platform Lift (LULA)',
    'Wheelchair Lift Installation', 'Escalator Installation',
    'Moving Walkway Installation', 'Dumbwaiter Installation',
    'Freight Elevator Installation', 'Car & Counterweight Rigging',
    'Elevator Door Operator Replacement', 'Control System Modernization',
    'Safety Device Testing (Governor)', 'Buffer Testing',
    'Pit Equipment Installation', 'Guide Rail Installation',
    'Elevator Cab Renovation', 'Elevator Inspection Prep',
    'Annual Maintenance Contract', 'Emergency Elevator Repair',
    'ADA Compliance Upgrade', 'Capacity Upgrade',
    'Elevator Troubleshooting & Diagnostics',
  ],
  marine: [
    'Outboard Engine Repair', 'Inboard Engine Service',
    'Sterndrive Service (MerCruiser / OMC)', 'Jet Drive Service',
    'Marine Electrical Wiring', 'Marine Electronics Installation',
    'GPS / Chartplotter Installation', 'VHF Radio Installation',
    'Fish Finder Installation', 'Autopilot System',
    'Bilge Pump Installation', 'Bilge Pump Repair',
    'Marine AC / DC Systems', 'Shore Power Connection',
    'Inverter / Charger Installation', 'Solar for Boats',
    'Gel Coat Repair', 'Fiberglass Repair',
    'Osmotic Blister Repair', 'Hull Painting & Bottom Paint',
    'Teak Deck Restoration', 'Canvas & Upholstery Repair',
    'Fuel System Repair', 'Fuel Tank Replacement',
    'Marine Plumbing', 'Through-Hull Fitting',
    'Propeller Repair / Replacement', 'Shaft Alignment',
    'Steering System Repair', 'Hydraulic Steering',
    'Trailer Bearing Service', 'Winterization / Commissioning',
  ],
  automotive: [
    'Oil Change & Lube', 'Brake Pad & Rotor Replacement',
    'Brake Caliper Service', 'Brake Line Repair',
    'Engine Diagnostics (OBD-II)', 'Engine Repair & Rebuild',
    'Timing Belt / Chain Replacement', 'Water Pump Replacement',
    'Radiator Repair & Replacement', 'Cooling System Flush',
    'Transmission Service', 'Transmission Rebuild',
    'Clutch Replacement', 'CV Axle Replacement',
    'Suspension Repair (Struts / Shocks)', 'Ball Joint Replacement',
    'Control Arm Replacement', 'Tie Rod Replacement',
    'Wheel Alignment', 'Tire Rotation & Balance',
    'Tire Mounting', 'Exhaust System Repair',
    'Catalytic Converter Replacement', 'Muffler Replacement',
    'AC Recharge & Repair', 'Heater Core Replacement',
    'Electrical Diagnosis', 'Alternator / Starter Replacement',
    'Battery Replacement', 'Fuel System Cleaning',
    'Fuel Pump Replacement', 'Oxygen Sensor Replacement',
    'Turbo / Supercharger Service', 'Custom Lift Kit Installation',
    'Lowering Springs / Coilovers', 'Window Tint',
    'Remote Start Installation',
  ],
  snow_removal: [
    'Residential Driveway Plowing', 'Commercial Parking Lot Plowing',
    'HOA / Condo Snow Removal', 'Road & Street Plowing',
    'Sidewalk Snow Removal', 'Walkway Salt & De-Icing',
    'Anti-Icing Pre-Treatment', 'Liquid De-Icing Application',
    'Calcium Chloride Application', 'Magnesium Chloride Application',
    'Ice Scraping & Chipping', 'Snow Blowing (Walk-Behind)',
    'Snow Blowing (Tractor-Mount)', 'Snow Relocation & Hauling',
    'Loader / Skid Steer Snow Stacking', 'Roof Snow Removal',
    'Ice Dam Removal', 'Loading Dock Clearing',
    'Fire Hydrant Clearance', 'Snow Melt System Monitoring',
    'Heated Driveway System Service', 'Emergency Snow Response',
    'Season Contract Snow Service',
  ],
  scaffolding: [
    'System Scaffold Erection (Ringlock / Cuplock)',
    'Frame Scaffold Erection', 'Tube & Clamp Scaffold',
    'Hanging / Suspended Scaffold', 'Swing Stage Scaffold',
    'Mast Climber Setup', 'Scissor Lift Operation',
    'Aerial Work Platform (AWP)', 'Rolling Tower Scaffold',
    'Shoring & Reshoring', 'Aluminum Scaffolding',
    'Scaffold Inspection', 'OSHA Scaffold Compliance',
    'Engineer-Stamped Scaffold Plans', 'Access Stairways',
    'Scaffold Decking & Guard Rail', 'Scaffold Netting & Containment',
    'Heavy-Duty Bearing Scaffold', 'Cantilevered Scaffold',
    'Outrigger Scaffold', 'Marine / Offshore Scaffold',
    'Scaffold Dismantling', 'Scaffold Load Calculations',
  ],
  ironworker: [
    'Structural Steel Erection', 'Structural Steel Fabrication',
    'Steel Column Setting', 'Steel Beam Erection',
    'Metal Deck Installation', 'Floor Deck',
    'Roof Deck', 'Rebar Placing & Tying',
    'Post-Tensioning (PT) Cables', 'Curtain Wall Steel',
    'Precast Concrete Erection', 'Pre-Engineered Metal Building (PEMB)',
    'Miscellaneous Iron (Stairs / Railing)', 'Ornamental Iron',
    'Handrail Fabrication & Install', 'Steel Grating Installation',
    'Anchor Bolt Setting', 'Shear Stud Installation',
    'Bolting (Structural)', 'Rigging & Hoisting',
    'Crane Signaling / Rigging', 'Steel Joist Installation (Bar Joist)',
    'Angle Iron & Channel Work', 'Plate Girder Erection',
    'Seismic Brace Installation',
  ],
  crane: [
    'Mobile Crane Operation (All-Terrain)', 'Mobile Crane (Rough Terrain)',
    'Crawler Crane Operation', 'Tower Crane Operation',
    'Telescoping Boom Operation', 'Lattice Boom Crane',
    'Hydro Crane Operation', 'Pick & Carry Operations',
    'Tandem Lift Coordination', 'Critical Lift Planning',
    'NCCCO Certified Crane Operator', 'Rigging Signaling',
    'Load Chart Reading', 'Ground Bearing Calculations',
    'Outrigger Pad Setup', 'Crane Assembly & Disassembly',
    'Crane Maintenance Inspection', 'Wind Speed Monitoring',
    'Blind Pick Operations', 'OSHA 1926.1400 Compliance',
    'Pre-Lift Planning & Safety',
  ],
  equipment: [
    'Excavator Operation', 'Bulldozer Operation',
    'Skid Steer / Bobcat Operation', 'Track Loader Operation',
    'Wheel Loader Operation', 'Backhoe Operation',
    'Grader Operation', 'Compactor / Roller Operation',
    'Trenching Machine Operation', 'Dump Truck Operation',
    'Articulated Hauler Operation', 'Forklift Operation (Sit-Down)',
    'Forklift Operation (Reach Truck)', 'Telehandler / Lull Operation',
    'Aerial Lift (Boom Lift)', 'Scissor Lift Operation',
    'Scraper Operation', 'Asphalt Paver Operation',
    'Milling Machine Operation', 'Pipe Layer (Equipment)',
    'GPS Machine Control', 'Grade Checking',
    'Equipment Pre-Operation Inspection', 'Minor Equipment Maintenance',
    'OSHA 1926 Compliance (Earthmoving)',
  ],
  surveyor: [
    'Boundary Survey', 'Topographic Survey',
    'Construction Layout / Staking', 'As-Built Survey',
    'ALTA / NSPS Land Title Survey', 'Subdivision Survey',
    'Legal Description Writing', 'Plat Preparation',
    'GPS / GNSS Survey', 'Total Station Survey',
    'Robotic Total Station', 'Drone / UAV Survey (Part 107)',
    'LiDAR Scanning', 'Terrestrial Laser Scanning (TLS)',
    'Elevation Certificate', 'Flood Zone Determination',
    'FEMA LOMA / LOMR', 'Corner Monumenting',
    'Right-of-Way Survey', 'Easement Survey',
    'Hydrographic Survey', 'Mine Survey',
    'Construction Monitoring (Deformation)', 'Volume Calculation (Cut / Fill)',
    'GIS Data Collection', 'AutoCAD Civil 3D',
    'Data Collector Programming',
  ],
  laborer: [
    'Site Cleanup & Debris Removal', 'Material Handling & Loading',
    'Concrete Mixing & Pouring (Manual)', 'Trenching (Hand)',
    'Landscaping Assistance', 'Demo / Tearout Assistance',
    'Drywall Carrying & Staging', 'Rebar Tying (Assist)',
    'Painting Prep (Masking / Taping)', 'Scaffold Erection Assist',
    'Tool & Equipment Transport', 'Traffic Control Flagger',
    'Fence Post Setting (Manual)', 'Grade Checking (Visual)',
    'Shoveling & Compaction', 'Sandbag Filling & Placement',
    'Pressure Washing', 'Power Tool Operation (Basic)',
    'Blueprint Reading (Basic)', 'Safety Spotting / Observation',
    'Lock Out / Tag Out Assist', 'First Aid / CPR Certified',
    'OSHA 10 Certified', 'Forklift Spotter',
    'General Maintenance Tasks', 'Moving & Relocation Assist',
  ],
};

/* ─────────────────────────────────────────────────────────────────────────────
   FOLLOW-UP STEPS (experience → availability → work type)
───────────────────────────────────────────────────────────────────────────── */
const FOLLOW_UP_STEPS = [
  {
    key: 'experience',
    title: 'How much experience do you have?',
    hint: 'Be honest — contractors will see this on your profile.',
    options: [
      { label: 'Less than 1 year', value: 'entry' },
      { label: '1 – 3 years',      value: 'junior' },
      { label: '3 – 7 years',      value: 'mid' },
      { label: '7+ years',         value: 'senior' },
    ],
  },
  {
    key: 'availability',
    title: 'When are you available?',
    hint: 'Contractors will filter by availability so be accurate.',
    options: [
      { label: 'Right now',   value: 'now' },
      { label: 'This week',   value: 'week' },
      { label: 'Next week',   value: 'nextweek' },
      { label: 'Flexible',    value: 'flexible' },
    ],
  },
  {
    key: 'type',
    title: 'What kind of work are you looking for?',
    hint: 'You can update this anytime from your profile.',
    options: [
      { label: 'Daily / as needed',      value: 'daily' },
      { label: 'Short term (1–4 weeks)', value: 'short' },
      { label: 'Long term (1+ months)',  value: 'long' },
      { label: 'Any',                    value: 'any' },
    ],
  },
];

const TOTAL_STEPS = 6;

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────────────────────── */
const S = {
  tradeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    margin: '20px 0 24px',
    maxHeight: '420px',
    overflowY: 'auto',
    paddingRight: '4px',
  },
  tradeCard: (selected) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 8px',
    borderRadius: '12px',
    border: selected ? '2px solid #FF6B35' : '2px solid #e5e7eb',
    background: selected ? '#fff5f1' : '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    userSelect: 'none',
  }),
  tradeIcon: { fontSize: '24px', lineHeight: 1 },
  tradeLabel: (selected) => ({
    fontSize: '11px',
    fontWeight: selected ? '600' : '500',
    color: selected ? '#FF6B35' : '#374151',
    textAlign: 'center',
    lineHeight: '1.3',
  }),
  searchWrap: { position: 'relative', marginBottom: '4px' },
  searchInput: {
    width: '100%',
    padding: '10px 14px 10px 36px',
    borderRadius: '10px',
    border: '1.5px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fafafa',
  },
  searchIcon: {
    position: 'absolute',
    left: '11px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  skillsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  skillsCount: { fontSize: '12px', color: '#6b7280' },
  selectAll: {
    fontSize: '12px',
    color: '#FF6B35',
    cursor: 'pointer',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    maxHeight: '380px',
    overflowY: 'auto',
    paddingRight: '4px',
    marginBottom: '20px',
  },
  skillChip: (checked) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '9px 10px',
    borderRadius: '10px',
    border: checked ? '1.5px solid #FF6B35' : '1.5px solid #e5e7eb',
    background: checked ? '#fff5f1' : '#fafafa',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 0.12s ease',
  }),
  checkbox: (checked) => ({
    width: '16px',
    height: '16px',
    minWidth: '16px',
    borderRadius: '4px',
    border: checked ? '2px solid #FF6B35' : '2px solid #d1d5db',
    background: checked ? '#FF6B35' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '1px',
    transition: 'all 0.12s ease',
  }),
  checkmark: { color: '#fff', fontSize: '10px', fontWeight: 'bold', lineHeight: 1 },
  skillLabel: (checked) => ({
    fontSize: '12px',
    fontWeight: checked ? '600' : '400',
    color: checked ? '#FF6B35' : '#374151',
    lineHeight: '1.4',
  }),
  tradePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#fff5f1',
    border: '1.5px solid #FF6B35',
    borderRadius: '20px',
    padding: '4px 12px',
    marginBottom: '16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#FF6B35',
  },
  hint: { fontSize: '13px', color: '#6b7280', marginBottom: '16px', marginTop: '-4px' },
};

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function JobForm({ onBack }) {
  const [step, setStep]                     = useState(0);
  const [trade, setTrade]                   = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [answers, setAnswers]               = useState({});
  const [tradeSearch, setTradeSearch]       = useState('');
  const [skillSearch, setSkillSearch]       = useState('');
  const [name, setName]                     = useState('');
  const [phone, setPhone]                   = useState('');
  const [zip, setZip]                       = useState('');
  const [done, setDone]                     = useState(false);

  const filteredTrades = useMemo(() =>
    TRADES.filter(t => t.label.toLowerCase().includes(tradeSearch.toLowerCase())),
    [tradeSearch]);

  const currentSkills = useMemo(() =>
    trade ? (SKILLS[trade] || []) : [], [trade]);

  const filteredSkills = useMemo(() =>
    currentSkills.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())),
    [currentSkills, skillSearch]);

  const selectedTrade = TRADES.find(t => t.value === trade);
  const progress  = (step / TOTAL_STEPS) * 100;
  const stepLabel = `Step ${step + 1} of ${TOTAL_STEPS}`;

  function pickTrade(val) { setTrade(val); setSelectedSkills([]); setSkillSearch(''); }
  function toggleSkill(skill) {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  }
  function toggleAll() {
    const allVisible = filteredSkills.length > 0 &&
      filteredSkills.every(s => selectedSkills.includes(s));
    setSelectedSkills(allVisible ? [] : filteredSkills);
  }
  function selectAnswer(key, val) { setAnswers(prev => ({ ...prev, [key]: val })); }
  function next() { if (step < TOTAL_STEPS - 1) setStep(s => s + 1); }
  function back() { if (step === 0) onBack(); else setStep(s => s - 1); }

  // ── Done ──
  if (done) return (
    <div className="form-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Profile created!</h2>
        <p>Contractors in your area can now find you. We'll text you when someone wants to hire you.</p>
        <button className="btn-primary" onClick={onBack}>Back to home</button>
      </div>
    </div>
  );

  // ── Step 5: Contact ──
  if (step === TOTAL_STEPS - 1) return (
    <div className="form-page">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <p className="step-label">{stepLabel}</p>
      <h2>Last step — your contact info</h2>
      <p>Your phone number is kept private until you accept a job.</p>
      <label className="field-label">Your name</label>
      <input className="text-input" type="text" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} style={{ marginBottom: 16 }} />
      <label className="field-label">Phone number</label>
      <input className="text-input" type="tel" placeholder="(555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} style={{ marginBottom: 16 }} />
      <label className="field-label">Your zip code</label>
      <input className="text-input" type="text" maxLength={5} placeholder="e.g. 94550" value={zip} onChange={e => setZip(e.target.value)} />
      <div className="btn-row">
        <button className="btn-back" onClick={back}>← Back</button>
        <button className="btn-primary" disabled={name.length < 2 || phone.length < 10 || zip.length !== 5} onClick={() => setDone(true)}>Create my profile</button>
      </div>
    </div>
  );

  // ── Step 0: Trade ──
  if (step === 0) return (
    <div className="form-page">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <p className="step-label">{stepLabel}</p>
      <h2>What's your main trade?</h2>
      <p style={S.hint}>Pick the one that best describes your primary skill.</p>
      <div style={S.searchWrap}>
        <span style={S.searchIcon}>🔍</span>
        <input style={S.searchInput} type="text" placeholder="Search trades…" value={tradeSearch} onChange={e => setTradeSearch(e.target.value)} />
      </div>
      <div style={S.tradeGrid}>
        {filteredTrades.length === 0 && <p style={{ gridColumn: '1/-1', color: '#9ca3af', fontSize: '13px' }}>No trades match "{tradeSearch}"</p>}
        {filteredTrades.map(t => (
          <div key={t.value} style={S.tradeCard(trade === t.value)} onClick={() => pickTrade(t.value)}>
            <span style={S.tradeIcon}>{t.icon}</span>
            <span style={S.tradeLabel(trade === t.value)}>{t.label}</span>
          </div>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn-back" onClick={back}>← Back</button>
        <button className="btn-primary" disabled={!trade} onClick={next}>Next</button>
      </div>
    </div>
  );

  // ── Step 1: Skills ──
  if (step === 1) {
    const allVisible = filteredSkills.length > 0 && filteredSkills.every(s => selectedSkills.includes(s));
    return (
      <div className="form-page">
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <p className="step-label">{stepLabel}</p>
        <h2>Select your specific skills</h2>
        {selectedTrade && <div style={S.tradePill}><span>{selectedTrade.icon}</span><span>{selectedTrade.label}</span></div>}
        <p style={S.hint}>Check everything you can do — the more specific, the better your matches.</p>
        <div style={S.searchWrap}>
          <span style={S.searchIcon}>🔍</span>
          <input style={S.searchInput} type="text" placeholder="Filter skills…" value={skillSearch} onChange={e => setSkillSearch(e.target.value)} />
        </div>
        <div style={S.skillsHeader}>
          <span style={S.skillsCount}>{selectedSkills.length} selected · {currentSkills.length} total</span>
          <button style={S.selectAll} onClick={toggleAll}>{allVisible ? 'Deselect all' : 'Select all'}</button>
        </div>
        <div style={S.skillsGrid}>
          {filteredSkills.length === 0 && <p style={{ gridColumn: '1/-1', color: '#9ca3af', fontSize: '13px' }}>No skills match "{skillSearch}"</p>}
          {filteredSkills.map(skill => {
            const checked = selectedSkills.includes(skill);
            return (
              <div key={skill} style={S.skillChip(checked)} onClick={() => toggleSkill(skill)}>
                <div style={S.checkbox(checked)}>{checked && <span style={S.checkmark}>✓</span>}</div>
                <span style={S.skillLabel(checked)}>{skill}</span>
              </div>
            );
          })}
        </div>
        <div className="btn-row">
          <button className="btn-back" onClick={back}>← Back</button>
          <button className="btn-primary" disabled={selectedSkills.length === 0} onClick={next}>Next</button>
        </div>
      </div>
    );
  }

  // ── Steps 2–4: Experience / Availability / Type ──
  const current = FOLLOW_UP_STEPS[step - 2];
  return (
    <div className="form-page">
      <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <p className="step-label">{stepLabel}</p>
      <h2>{current.title}</h2>
      <p>{current.hint}</p>
      <div className="opt-grid">
        {current.options.map(opt => (
          <div key={opt.value} className={`opt ${answers[current.key] === opt.value ? 'selected' : ''}`} onClick={() => selectAnswer(current.key, opt.value)}>
            {opt.label}
          </div>
        ))}
      </div>
      <div className="btn-row">
        <button className="btn-back" onClick={back}>← Back</button>
        <button className="btn-primary" disabled={!answers[current.key]} onClick={next}>Next</button>
      </div>
    </div>
  );
}