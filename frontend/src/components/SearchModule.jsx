import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useSearch from '../hooks/useSearch';
import useAuth from '../hooks/useAuth';
import { fadeInUp } from '../animations/framerMotion';

const SearchModule = () => {
  const { searchParams, setSearchParams } = useSearch();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [cpt, setCpt] = useState(searchParams.cpt || '');
  const [zip, setZip] = useState(searchParams.zip || '');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!cpt && !zip) {
      setError('Please enter a CPT code or ZIP code to search.');
      return;
    }

    if (zip && !/^\d{5}$/.test(zip)) {
      setError('ZIP code must be exactly 5 digits.');
      return;
    }

    setSearchParams({ cpt, zip });

    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    navigate('/results');
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="glass rounded-2xl p-8 max-w-2xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-white mb-6 text-center">
        Search CPT Codes & Get Competitive Bids
      </h3>
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">
              CPT Code or Description
            </label>
            <input
              type="text"
              value={cpt}
              onChange={(e) => setCpt(e.target.value)}
              placeholder="e.g. 93000 or Cardiology"
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">ZIP Code</label>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="e.g. 90001"
              maxLength={5}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-300 text-sm bg-red-500/20 px-4 py-2 rounded-lg">{error}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg"
        >
          🔍 Search CPT Codes
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SearchModule;
