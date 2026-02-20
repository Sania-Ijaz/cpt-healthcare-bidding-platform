require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const CPTData = require('../models/CPTData');

const sampleCPTData = [
  {
    specialty: 'Cardiology',
    cptCode: '93000',
    description: 'Electrocardiogram, routine ECG with at least 12 leads',
    county: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    avgCharge: 150,
    minCharge: 80,
    maxCharge: 220,
    reserveAmount: 100,
  },
  {
    specialty: 'Radiology',
    cptCode: '71046',
    description: 'Radiologic examination, chest; 2 views',
    county: 'Cook',
    state: 'IL',
    zipCode: '60601',
    avgCharge: 200,
    minCharge: 120,
    maxCharge: 300,
    reserveAmount: 150,
  },
  {
    specialty: 'Orthopedics',
    cptCode: '27447',
    description: 'Arthroplasty, knee, condyle and plateau; medial and lateral compartments',
    county: 'Harris',
    state: 'TX',
    zipCode: '77001',
    avgCharge: 15000,
    minCharge: 10000,
    maxCharge: 25000,
    reserveAmount: 12000,
  },
  {
    specialty: 'General Surgery',
    cptCode: '47562',
    description: 'Laparoscopic cholecystectomy',
    county: 'Maricopa',
    state: 'AZ',
    zipCode: '85001',
    avgCharge: 8000,
    minCharge: 5000,
    maxCharge: 12000,
    reserveAmount: 6500,
  },
  {
    specialty: 'Pathology',
    cptCode: '88305',
    description: 'Level IV - Surgical pathology, gross and microscopic examination',
    county: 'King',
    state: 'WA',
    zipCode: '98101',
    avgCharge: 400,
    minCharge: 200,
    maxCharge: 650,
    reserveAmount: 280,
  },
  {
    specialty: 'Emergency Medicine',
    cptCode: '99285',
    description: 'Emergency department visit, high complexity medical decision making',
    county: 'Miami-Dade',
    state: 'FL',
    zipCode: '33101',
    avgCharge: 900,
    minCharge: 600,
    maxCharge: 1400,
    reserveAmount: 750,
  },
  {
    specialty: 'Anesthesiology',
    cptCode: '00840',
    description: 'Anesthesia for intraabdominal procedures',
    county: 'Fulton',
    state: 'GA',
    zipCode: '30301',
    avgCharge: 1800,
    minCharge: 1200,
    maxCharge: 2800,
    reserveAmount: 1500,
  },
  {
    specialty: 'Dermatology',
    cptCode: '17000',
    description: 'Destruction of premalignant lesions; first lesion',
    county: 'Philadelphia',
    state: 'PA',
    zipCode: '19101',
    avgCharge: 250,
    minCharge: 150,
    maxCharge: 400,
    reserveAmount: 200,
  },
  {
    specialty: 'Ophthalmology',
    cptCode: '66984',
    description: 'Extracapsular cataract removal with insertion of intraocular lens prosthesis',
    county: 'Multnomah',
    state: 'OR',
    zipCode: '97201',
    avgCharge: 3500,
    minCharge: 2200,
    maxCharge: 5500,
    reserveAmount: 2800,
  },
  {
    specialty: 'Neurology',
    cptCode: '95819',
    description: 'Electroencephalogram (EEG); awake and drowsy',
    county: 'Denver',
    state: 'CO',
    zipCode: '80201',
    avgCharge: 600,
    minCharge: 350,
    maxCharge: 900,
    reserveAmount: 450,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cpt-healthcare');
    console.log('Connected to MongoDB for seeding...');

    await CPTData.deleteMany({});
    console.log('Cleared existing CPT data...');

    await CPTData.insertMany(sampleCPTData);
    console.log(`Seeded ${sampleCPTData.length} CPT records successfully.`);

    await mongoose.connection.close();
    console.log('Seeding complete. Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
