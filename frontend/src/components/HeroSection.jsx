import { motion } from 'framer-motion';
import SearchModule from './SearchModule';
import { fadeInDown, fadeInUp, staggerContainer } from '../animations/framerMotion';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 flex items-center justify-center overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={fadeInDown}>
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full border border-white/30 mb-4">
              🏥 Healthcare CPT Code Bidding Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              Find the Best{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Healthcare Deals
              </span>
              <br />
              With Competitive Bids
            </h1>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed"
          >
            Search CPT codes, compare reserve amounts, and place competitive bids to secure the
            best healthcare pricing for patients, brokers, and employers.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              { icon: '🔍', text: 'Search CPT Codes' },
              { icon: '💰', text: 'Compare Prices' },
              { icon: '🏆', text: 'Place Winning Bids' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-blue-100">
                <span className="text-2xl">{icon}</span>
                <span className="font-medium">{text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-4">
            <SearchModule />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
