import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Incident from './models/Incident.js';
import Alert from './models/Alert.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const EXAMPLE_INCIDENTS = [
  {
    customId: "INC-2026-001",
    title: "Residential Structure Fire (Alert Level 1)",
    category: "fire",
    incidentType: "Fire",
    severity: "critical",
    urgency: "Critical",
    status: "Dispatched",
    locationName: "Sitio Centro near Barangay Hall, Anupul",
    purok: "Sitio Centro",
    exactLocation: "Sitio Centro near Barangay Hall, Anupul",
    lat: 15.2898,
    lng: 120.5721,
    reportedBy: "Resident Maria Santos",
    reporterName: "Resident Maria Santos",
    reporterContact: "0918-222-3333",
    isUserReport: false,
    description: "Thick black smoke emitting from two-story residential house near Barangay Hall. BFP Bamban fire truck en route.",
    responder: "BFP Firefighters 🚒",
    votes: 8,
    createdAt: new Date(Date.now() - 12 * 60 * 1000),
  },
  {
    customId: "INC-2026-002",
    title: "Electrical Transformer Spark / Cable Line Fire",
    category: "fire",
    incidentType: "Fire",
    severity: "high",
    urgency: "High",
    status: "In Progress",
    locationName: "MacArthur Highway cor. Sitio Manga, Anupul",
    purok: "Sitio Manga",
    exactLocation: "MacArthur Highway cor. Sitio Manga, Anupul",
    lat: 15.2912,
    lng: 120.5735,
    reportedBy: "Store Owner Arthur V.",
    reporterName: "Store Owner Arthur V.",
    reporterContact: "0917-888-9999",
    isUserReport: false,
    description: "Sparks flying from overhead electric transformer along MacArthur Highway near convenience mart.",
    responder: "BFP & Meralco ⚡",
    votes: 5,
    createdAt: new Date(Date.now() - 24 * 60 * 1000),
  },
  {
    customId: "INC-2026-003",
    title: "Trash & Brush Fire Threatening Perimeter Fence",
    category: "fire",
    incidentType: "Fire",
    severity: "medium",
    urgency: "Medium",
    status: "Pending Review",
    locationName: "Sitio Priority Vacant Lot, Anupul",
    purok: "Sitio Priority",
    exactLocation: "Sitio Priority Vacant Lot, Anupul",
    lat: 15.2940,
    lng: 120.5762,
    reportedBy: "Barangay Tanod Patrol",
    reporterName: "Barangay Tanod Patrol",
    reporterContact: "0919-333-4444",
    isUserReport: false,
    description: "Illegal burning of dry cogon grass spreading dangerously near residential wooden fence.",
    responder: "BFP & Tanod 🚒",
    votes: 3,
    createdAt: new Date(Date.now() - 38 * 60 * 1000),
  },
  {
    customId: "INC-2026-004",
    title: "Knee-Deep Gutter Flood / Clogged Drainage Culvert",
    category: "flood",
    incidentType: "Flood",
    severity: "high",
    urgency: "High",
    status: "In Progress",
    locationName: "Sitio Binitagan Interior Access Road, Anupul",
    purok: "Sitio Binitagan",
    exactLocation: "Sitio Binitagan Interior Access Road, Anupul",
    lat: 15.2881,
    lng: 120.5708,
    reportedBy: "Juan Dela Cruz",
    reporterName: "Juan Dela Cruz",
    reporterContact: "09171234567",
    isUserReport: true,
    description: "Water has reached knee level, impassable to light tricycles. Trash and silt blocking drainage grates.",
    responder: "DRRMO & Engineering 🌊",
    votes: 14,
    createdAt: new Date(Date.now() - 18 * 60 * 1000),
  },
  {
    customId: "INC-2026-005",
    title: "Rising Creek Overflow Near Lowland Boundary",
    category: "flood",
    incidentType: "Flood",
    severity: "critical",
    urgency: "Critical",
    status: "In Progress",
    locationName: "Sitio Baguingit Creek Bank, Anupul",
    purok: "Sitio Baguingit",
    exactLocation: "Sitio Baguingit Creek Bank, Anupul",
    lat: 15.2872,
    lng: 120.5695,
    reportedBy: "Tanod Watch Post 4",
    reporterName: "Tanod Watch Post 4",
    reporterContact: "0919-444-5555",
    isUserReport: false,
    description: "Creek water level reached Orange Alert threshold. Low-lying riverside homes placed on evacuation standby.",
    responder: "DRRMO Rescue Unit 🌊",
    votes: 21,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    customId: "INC-2026-006",
    title: "Submerged Alleyway - Stranded Senior Residents",
    category: "flood",
    incidentType: "Flood",
    severity: "critical",
    urgency: "Critical",
    status: "Dispatched",
    locationName: "Sitio Mape Lowland Compound, Anupul",
    purok: "Sitio Mape",
    exactLocation: "Sitio Mape Lowland Compound, Anupul",
    lat: 15.2858,
    lng: 120.5684,
    reportedBy: "Resident Cora Diaz",
    reporterName: "Resident Cora Diaz",
    reporterContact: "0918-333-2222",
    isUserReport: false,
    description: "Two elderly residents unable to exit home due to 2-foot stormwater pooling inside interior alley.",
    responder: "DRRMO & Barangay Ambulance 🚑",
    votes: 9,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
  {
    customId: "INC-2026-007",
    title: "Drainage Backflow into Driveways",
    category: "flood",
    incidentType: "Flood",
    severity: "medium",
    urgency: "Medium",
    status: "Pending Review",
    locationName: "Sitio Pag-asa Main Pathway, Anupul",
    purok: "Sitio Pag-asa",
    exactLocation: "Sitio Pag-asa Main Pathway, Anupul",
    lat: 15.2865,
    lng: 120.5711,
    reportedBy: "Resident Ben Perez",
    reporterName: "Resident Ben Perez",
    reporterContact: "0917-555-1234",
    isUserReport: false,
    description: "Stormwater bubbling through drainage grates during heavy monsoon rains.",
    responder: "Engineering Team 🛠️",
    votes: 4,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    customId: "INC-2026-008",
    title: "Elderly Citizen Severe Breathing Distress",
    category: "medical",
    incidentType: "Medical Emergency",
    severity: "critical",
    urgency: "Critical",
    status: "Dispatched",
    locationName: "Sitio San Joseph, Anupul",
    purok: "Sitio San Joseph",
    exactLocation: "Sitio San Joseph, Anupul",
    lat: 15.2925,
    lng: 120.5742,
    reportedBy: "Family Member Ana G.",
    reporterName: "Family Member Ana G.",
    reporterContact: "0918-777-6655",
    isUserReport: false,
    description: "72yo resident experiencing shortness of breath. Barangay ambulance and oxygen assistance requested.",
    responder: "BHERT & Barangay Ambulance 🚑",
    votes: 2,
    createdAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    customId: "INC-2026-009",
    title: "Motorcycle Fall Injury - First Aid Administered",
    category: "medical",
    incidentType: "Medical Emergency",
    severity: "medium",
    urgency: "Medium",
    status: "Resolved",
    locationName: "MacArthur Highway near Anupul Elementary School",
    purok: "MacArthur Highway / Main Road",
    exactLocation: "MacArthur Highway near Anupul Elementary School",
    lat: 15.2905,
    lng: 120.5728,
    reportedBy: "Traffic Marshall",
    reporterName: "Traffic Marshall",
    reporterContact: "0919-888-7766",
    isUserReport: false,
    description: "Rider slipped on wet highway road markings. Minor lacerations on knees, treated on site by BHERT.",
    responder: "BHERT Medic 🚑",
    votes: 6,
    createdAt: new Date(Date.now() - 120 * 60 * 1000),
  },
  {
    customId: "INC-2026-010",
    title: "Commercial Store Break-In & Theft Attempt",
    category: "police",
    incidentType: "Crime / Violence",
    severity: "medium",
    urgency: "Medium",
    status: "In Progress",
    locationName: "Sitio Centro Commercial Strip, Anupul",
    purok: "Sitio Centro",
    exactLocation: "Sitio Centro Commercial Strip, Anupul",
    lat: 15.2891,
    lng: 120.5716,
    reportedBy: "Juan Dela Cruz",
    reporterName: "Juan Dela Cruz",
    reporterContact: "09171234567",
    isUserReport: true,
    description: "Sari-sari store break-in attempt and property theft reported. Tanod / Police investigation requested.",
    responder: "Barangay Tanod Patrol 👮",
    votes: 7,
    createdAt: new Date(Date.now() - 50 * 60 * 1000),
  },
  {
    customId: "INC-2026-011",
    title: "Two-Vehicle Collision Blocking Highway Lane",
    category: "accident",
    incidentType: "Vehicular Accident",
    severity: "high",
    urgency: "High",
    status: "Dispatched",
    locationName: "MacArthur Highway cor. Bamban Boundary, Anupul",
    purok: "MacArthur Highway / Main Road",
    exactLocation: "MacArthur Highway cor. Bamban Boundary, Anupul",
    lat: 15.2850,
    lng: 120.5690,
    reportedBy: "Motorist Carlo R.",
    reporterName: "Motorist Carlo R.",
    reporterContact: "0920-111-3333",
    isUserReport: false,
    description: "Delivery tricycle and utility van sideswiped. Southbound lane partially blocked, Tanod traffic control en route.",
    responder: "Traffic Tanod & Tow Unit ⚠️",
    votes: 11,
    createdAt: new Date(Date.now() - 28 * 60 * 1000),
  },
  {
    customId: "INC-2026-012",
    title: "Downed Acacia Tree Branch Leaning on Power Wires",
    category: "hazard",
    incidentType: "Fallen Tree / Powerline",
    severity: "medium",
    urgency: "Medium",
    status: "Pending Review",
    locationName: "Sitio San Roque Entry Road, Anupul",
    purok: "Sitio San Roque",
    exactLocation: "Sitio San Roque Entry Road, Anupul",
    lat: 15.2931,
    lng: 120.5750,
    reportedBy: "Homeowners Association",
    reporterName: "Homeowners Association",
    reporterContact: "0921-222-4444",
    isUserReport: false,
    description: "Large tree limb snapped during gusty wind, resting dangerously on telecommunications lines.",
    responder: "Barangay Maintenance ⚡",
    votes: 5,
    createdAt: new Date(Date.now() - 65 * 60 * 1000),
  },
];

const EXAMPLE_ALERTS = [
  {
    title: "Advisory: Rainfall Warning & Lowland Drainage Clearing Operation",
    type: "Flood",
    severity: "High",
    description: "Residents in low-lying riverside areas are advised to monitor creek water levels. Tanod and maintenance crews have deployed water pumps to assist drainage backflow.",
    instructions: "Evacuate if creek reaches critical bank marker. Call barangay hotlines for assistance.",
    targetPuroks: ["Sitio Baguingit", "Sitio Mape", "Sitio Binitagan"],
    status: "Active",
    issuerName: "Barangay DRRMO & Engineering Unit",
  },
  {
    title: "Barangay Emergency Hotline Directory",
    type: "General Advisory",
    severity: "Moderate",
    description: "For immediate emergency dispatch: Barangay Operations Center (0917-111-2222), Police Substation (0919-333-4444), BFP Fire Substation (0918-222-3333), Ambulance (0921-555-6666).",
    instructions: "Save hotlines on your mobile phones for 24/7 emergency response.",
    targetPuroks: ["All Puroks"],
    status: "Active",
    issuerName: "Barangay Council of Anupul",
  },
  {
    title: "Community Fire Prevention & Gas Tank Inspection Drive",
    type: "Fire",
    severity: "Moderate",
    description: "Barangay fire volunteers will conduct free LPG hose checks and electrical line inspections across residential areas this coming weekend.",
    instructions: "Allow accredited barangay Tanod and BFP inspection teams to verify safety valves.",
    targetPuroks: ["Sitio Centro", "Sitio Manga", "Sitio Priority"],
    status: "Active",
    issuerName: "BFP Bamban Fire Station",
  },
];

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('❌ MONGO_URI is missing from .env');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas.');

    // 1. Check for any existing customId collisions with user-created reports
    const existingIncidents = await Incident.find({});
    console.log(`Found ${existingIncidents.length} existing incident(s) in database.`);

    const exampleIds = new Set(EXAMPLE_INCIDENTS.map((i) => i.customId));
    let nextAvailableSuffix = 13;

    for (const inc of existingIncidents) {
      // If an existing record has INC-2026-001 or INC-2026-002 but is NOT the example title
      const isExample = EXAMPLE_INCIDENTS.some(
        (ex) => ex.customId === inc.customId && ex.title === inc.title
      );
      if (exampleIds.has(inc.customId) && !isExample) {
        const newCustomId = `INC-2026-${String(nextAvailableSuffix++).padStart(3, '0')}`;
        console.log(`Preserving user report "${inc.title}" -> Reassigning ID from ${inc.customId} to ${newCustomId}`);
        inc.customId = newCustomId;
        await inc.save();
      }
    }

    // 2. Upsert the 12 canonical example incidents
    console.log(`Seeding ${EXAMPLE_INCIDENTS.length} example incidents...`);
    for (const incidentData of EXAMPLE_INCIDENTS) {
      await Incident.findOneAndUpdate(
        { customId: incidentData.customId },
        { $set: incidentData },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('✅ Successfully seeded example incidents into MongoDB!');

    // 3. Seed example alerts if collection is empty
    const alertCount = await Alert.countDocuments();
    if (alertCount === 0) {
      console.log('Seeding example emergency alerts/advisories...');
      await Alert.insertMany(EXAMPLE_ALERTS);
      console.log('✅ Successfully seeded example alerts into MongoDB!');
    } else {
      console.log(`Alerts collection already contains ${alertCount} document(s).`);
    }

    const totalCount = await Incident.countDocuments();
    console.log(`📊 Total incidents now in MongoDB: ${totalCount}`);

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB. Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
