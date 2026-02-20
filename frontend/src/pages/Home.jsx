import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import { fadeInUp, staggerContainer } from '../animations/framerMotion';

const features = [
  {
    icon: '🔍',
    title: 'Smart CPT Search',
    desc: 'Search by CPT code or description across thousands of healthcare procedures with location filtering.',
  },
  {
    icon: '💼',
    title: 'Competitive Bidding',
    desc: 'Place bids on CPT codes with real-time reserve amount validation and transparent pricing.',
  },
  {
    icon: '📊',
    title: 'Dashboard Analytics',
    desc: 'Track all your bids, monitor approval status, and manage your healthcare cost strategy.',
  },
  {
    icon: '🔒',
    title: 'Secure & Compliant',
    desc: 'Enterprise-grade security with JWT authentication and role-based access control.',
  },
];

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose HealthBid?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-gray-500 max-w-2xl mx-auto">
              A comprehensive platform for healthcare cost management and competitive bidding.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeInUp} className="card text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '10,000+', label: 'CPT Codes' },
              { num: '50+', label: 'Specialties' },
              { num: '1000+', label: 'Active Bidders' },
              { num: '99.9%', label: 'Uptime' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold text-white">{num}</p>
                <p className="text-blue-200 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
