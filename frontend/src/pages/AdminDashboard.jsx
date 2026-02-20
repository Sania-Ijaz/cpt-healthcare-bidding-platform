import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as adminAPI from '../api/adminAPI';
import Loading from '../components/Loading';
import { formatCurrency, formatDate, formatDateTime, capitalizeFirst } from '../utils/formatters';
import { STATUS_COLORS, USER_TYPES } from '../utils/constants';
import { fadeInUp, staggerContainer } from '../animations/framerMotion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [bids, setBids] = useState([]);
  const [usersPagination, setUsersPagination] = useState(null);
  const [bidsPagination, setBidsPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userBids, setUserBids] = useState(null);
  const [bidActionLoading, setBidActionLoading] = useState(null);
  const [comment, setComment] = useState('');

  const fetchUsers = async (type = '', page = 1) => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllUsers({ type, page, limit: 10 });
      setUsers(res.data.data.users);
      setUsersPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async (status = '', page = 1) => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllBids({ status, page, limit: 10 });
      setBids(res.data.data.bids);
      setBidsPagination(res.data.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bids.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers(typeFilter);
    if (activeTab === 'bids') fetchBids(statusFilter);
  }, [activeTab]);

  const handleTypeFilter = (e) => {
    setTypeFilter(e.target.value);
    fetchUsers(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    fetchBids(e.target.value);
  };

  const handleViewUserBids = async (userId) => {
    setSelectedUserId(userId);
    try {
      const res = await adminAPI.getUserBids(userId);
      setUserBids(res.data.data);
    } catch {
      setUserBids(null);
    }
  };

  const handleBidAction = async (bidId, status) => {
    setBidActionLoading(bidId);
    try {
      await adminAPI.updateBidStatus(bidId, { status, adminComments: comment });
      // Refresh bids
      fetchBids(statusFilter);
      if (userBids) handleViewUserBids(selectedUserId);
      setComment('');
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    } finally {
      setBidActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-blue-700 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-purple-200 mt-1">Manage users, bids, and platform activity.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm mb-6 w-fit">
          {['users', 'bids'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {capitalizeFirst(tab)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="font-semibold text-gray-900">
                All Users ({usersPagination?.total || 0})
              </h2>
              <select value={typeFilter} onChange={handleTypeFilter} className="input-field w-auto text-sm">
                <option value="">All Types</option>
                <option value={USER_TYPES.PATIENT}>Patient</option>
                <option value={USER_TYPES.BROKER}>Broker</option>
                <option value={USER_TYPES.EMPLOYER}>Employer</option>
              </select>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <motion.div variants={fadeInUp} className="overflow-x-auto rounded-2xl shadow-sm">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      {['Name', 'Email', 'Type', 'ZIP', 'Bids', 'Joined', 'Actions'].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {u.firstName} {u.lastName}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{u.email}</td>
                        <td className="px-5 py-4">
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                            {capitalizeFirst(u.type)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{u.zipCode}</td>
                        <td className="px-5 py-4 text-center font-semibold text-blue-600">
                          {u.bidCount || 0}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleViewUserBids(u._id)}
                            className="text-blue-600 hover:underline text-xs font-medium"
                          >
                            View Bids
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {/* User bids drawer */}
            {userBids && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="mt-6 bg-white rounded-2xl shadow-sm p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Bids for {userBids.user.firstName} {userBids.user.lastName}
                  </h3>
                  <button
                    onClick={() => { setUserBids(null); setSelectedUserId(null); }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                {userBids.bids.length === 0 ? (
                  <p className="text-gray-500 text-sm">No bids yet.</p>
                ) : (
                  <div className="space-y-3">
                    {userBids.bids.map((bid) => (
                      <div
                        key={bid._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 rounded-xl p-4 gap-3"
                      >
                        <div>
                          <span className="font-mono text-blue-600 font-semibold">
                            {bid.cptDataId?.cptCode}
                          </span>
                          <p className="text-sm text-gray-600">{bid.cptDataId?.description}</p>
                          <div className="flex gap-4 mt-1 text-sm">
                            <span>Bid: <strong>{formatCurrency(bid.bidAmount)}</strong></span>
                            <span>Reserve: <strong className="text-purple-600">{formatCurrency(bid.cptDataId?.reserveAmount)}</strong></span>
                          </div>
                          {bid.adminComments && (
                            <p className="text-xs text-gray-500 mt-1">Note: {bid.adminComments}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[bid.status]}`}>
                            {capitalizeFirst(bid.status)}
                          </span>
                          {bid.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBidAction(bid._id, 'approved')}
                                disabled={bidActionLoading === bid._id}
                                className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleBidAction(bid._id, 'denied')}
                                disabled={bidActionLoading === bid._id}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 disabled:opacity-50"
                              >
                                Deny
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Bids Tab */}
        {activeTab === 'bids' && (
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <h2 className="font-semibold text-gray-900">
                All Bids ({bidsPagination?.total || 0})
              </h2>
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="input-field w-auto text-sm"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <motion.div variants={fadeInUp} className="overflow-x-auto rounded-2xl shadow-sm">
                <table className="w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      {['User', 'CPT Code', 'Bid', 'Reserve', 'Status', 'Date', 'Actions'].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bids.map((bid) => (
                      <tr key={bid._id} className="hover:bg-gray-50">
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {bid.userId?.firstName} {bid.userId?.lastName}
                        </td>
                        <td className="px-5 py-4 font-mono text-blue-600 font-semibold">
                          {bid.cptDataId?.cptCode}
                        </td>
                        <td className="px-5 py-4 font-semibold">{formatCurrency(bid.bidAmount)}</td>
                        <td className="px-5 py-4 text-purple-600 font-medium">
                          {formatCurrency(bid.cptDataId?.reserveAmount)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[bid.status]}`}>
                            {capitalizeFirst(bid.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-500">
                          {formatDateTime(bid.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          {bid.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBidAction(bid._id, 'approved')}
                                disabled={bidActionLoading === bid._id}
                                className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                              >
                                ✓
                              </button>
                              <button
                                onClick={() => handleBidAction(bid._id, 'denied')}
                                disabled={bidActionLoading === bid._id}
                                className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-50"
                              >
                                ✗
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
