import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { searchCPT } from '../api/searchAPI';
import useSearch from '../hooks/useSearch';
import CPTCard from '../components/CPTCard';
import BidModal from '../components/BidModal';
import Loading from '../components/Loading';
import { fadeInUp, staggerContainer } from '../animations/framerMotion';

const Results = () => {
  const { searchParams, setSearchParams, results, setResults, pagination, setPagination } =
    useSearch();

  const [cpt, setCpt] = useState(searchParams.cpt || '');
  const [zip, setZip] = useState(searchParams.zip || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCPT, setSelectedCPT] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.cpt || searchParams.zip) {
      performSearch(searchParams.cpt, searchParams.zip);
    }
  }, []);

  const performSearch = async (cptVal, zipVal, page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await searchCPT({ cpt: cptVal, zip: zipVal, page, limit: 12 });
      setResults(res.data.data.results);
      setPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ cpt, zip });
    performSearch(cpt, zip);
  };

  const handleBidSuccess = () => {
    setSuccessMsg('🎉 Your bid was placed successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search bar */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={cpt}
              onChange={(e) => setCpt(e.target.value)}
              placeholder="CPT code or description"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              placeholder="ZIP code"
              maxLength={5}
              className="w-full sm:w-32 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Success notification */}
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 text-green-800 px-6 py-3 rounded-lg mb-6 text-center font-medium"
          >
            {successMsg}
          </motion.div>
        )}

        {/* Results header */}
        {pagination && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {pagination.total} result{pagination.total !== 1 ? 's' : ''} found
            </h2>
          </div>
        )}

        {loading && <Loading text="Searching CPT codes..." />}
        {error && (
          <div className="text-center py-12 text-red-500">
            <p className="text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && (pagination || searchParams.cpt || searchParams.zip) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search terms or ZIP code.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {results.map((item) => (
              <CPTCard key={item._id} cptData={item} onBid={setSelectedCPT} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => performSearch(cpt, zip, page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === pagination.page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border hover:bg-blue-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {selectedCPT && (
        <BidModal
          cptData={selectedCPT}
          onClose={() => setSelectedCPT(null)}
          onSuccess={handleBidSuccess}
        />
      )}
    </div>
  );
};

export default Results;
