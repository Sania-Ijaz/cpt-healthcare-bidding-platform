import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getDashboard } from '../api/userAPI';
import Loading from '../components/Loading';
import { formatCurrency, formatDate, formatDateTime, capitalizeFirst } from '../utils/formatters';
import { STATUS_COLORS } from '../utils/constants';
import { fadeInUp, staggerContainer } from '../animations/framerMotion';

const UserDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDashboard();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loading text="Loading dashboard..." />;
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        <p>{error}</p>
      </div>
    );

  const { user, bids, totalBids } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
          {/* Profile Summary */}
          <motion.div variants={fadeInUp} className="card">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {capitalizeFirst(user.type)}
                  </span>
                  {user.role === 'admin' && (
                    <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span>📞 {user.phone}</span>
                  <span>📍 {user.zipCode}</span>
                  <span>📅 Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{totalBids}</p>
                <p className="text-sm text-gray-500">Total Bids</p>
              </div>
            </div>
          </motion.div>

          {/* Bids */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Bids</h2>
            {bids.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-gray-500">No bids yet. Start searching for CPT codes!</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl shadow-sm">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        CPT Code
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Bid Amount
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Reserve
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bids.map((bid) => (
                      <tr key={bid._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-blue-600 font-semibold">
                          {bid.cptDataId?.cptCode || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                          {bid.cptDataId?.description || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                          {formatCurrency(bid.bidAmount)}
                        </td>
                        <td className="px-6 py-4 text-right text-purple-600 font-medium">
                          {formatCurrency(bid.cptDataId?.reserveAmount)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[bid.status]}`}
                          >
                            {capitalizeFirst(bid.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDateTime(bid.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;
