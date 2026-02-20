import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { placeBid } from '../api/bidAPI';
import { formatCurrency } from '../utils/formatters';
import { validateBidAmount } from '../utils/validators';
import { modalBackdrop, modalContent } from '../animations/framerMotion';

const BidModal = ({ cptData, onClose, onSuccess }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(bidAmount);
    if (!validateBidAmount(amount, cptData.reserveAmount)) {
      setError(
        `Bid amount must be greater than the reserve amount of ${formatCurrency(cptData.reserveAmount)}.`
      );
      return;
    }

    setLoading(true);
    try {
      await placeBid({ cptDataId: cptData._id, bidAmount: amount });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={modalBackdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={modalContent}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Place a Bid</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* CPT Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-600 font-medium">{cptData.cptCode}</p>
            <p className="text-gray-700 text-sm mt-1">{cptData.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Reserve Amount</span>
              <span className="text-lg font-bold text-purple-600">
                {formatCurrency(cptData.reserveAmount)}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Bid Amount ($)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min: ${formatCurrency(cptData.reserveAmount + 0.01)}`}
                min={cptData.reserveAmount + 0.01}
                step="0.01"
                className="input-field"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Must exceed reserve amount of {formatCurrency(cptData.reserveAmount)}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary flex-1">
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Placing Bid...' : 'Place Bid'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BidModal;
