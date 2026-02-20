import { motion } from 'framer-motion';
import { formatCurrency, formatFieldLabel } from '../utils/formatters';
import { fadeInUp, cardHover } from '../animations/framerMotion';

const EXCLUDED_FIELDS = ['_id', '__v', 'createdAt', 'updatedAt'];
const HIGHLIGHTED_FIELDS = ['reserveAmount'];
const LABEL_FIELDS = ['cptCode', 'specialty', 'description', 'county', 'state', 'zipCode'];
const CURRENCY_FIELDS = ['avgCharge', 'minCharge', 'maxCharge', 'reserveAmount'];

const CPTCard = ({ cptData, onBid }) => {
  const labelFields = LABEL_FIELDS.filter((f) => cptData[f] !== undefined);
  const otherFields = Object.keys(cptData).filter(
    (k) => !EXCLUDED_FIELDS.includes(k) && !LABEL_FIELDS.includes(k)
  );

  const renderValue = (key, value) => {
    if (CURRENCY_FIELDS.includes(key)) return formatCurrency(value);
    return value !== undefined && value !== null ? String(value) : 'N/A';
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="card border border-gray-100 group"
    >
      <motion.div variants={cardHover}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-1">
              {cptData.specialty}
            </span>
            <h3 className="text-2xl font-bold text-gray-900">{cptData.cptCode}</h3>
          </div>
          {cptData.reserveAmount !== undefined && (
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Reserve</p>
              <p className="text-xl font-bold text-purple-600">
                {formatCurrency(cptData.reserveAmount)}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        {cptData.description && (
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{cptData.description}</p>
        )}

        {/* Location */}
        <div className="flex flex-wrap gap-2 mb-4">
          {cptData.county && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              📍 {cptData.county}, {cptData.state}
            </span>
          )}
          {cptData.zipCode && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              🗺 {cptData.zipCode}
            </span>
          )}
        </div>

        {/* Charge Fields */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['minCharge', 'avgCharge', 'maxCharge'].map(
            (field) =>
              cptData[field] !== undefined && (
                <div key={field} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 capitalize">
                    {field.replace('Charge', '')}
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {formatCurrency(cptData[field])}
                  </p>
                </div>
              )
          )}
        </div>

        {/* Dynamic extra fields */}
        {otherFields
          .filter((f) => !['minCharge', 'avgCharge', 'maxCharge', 'reserveAmount'].includes(f))
          .map((field) => (
            <div key={field} className="flex justify-between py-1 border-t border-gray-50">
              <span className="text-xs text-gray-500">{formatFieldLabel(field)}</span>
              <span className="text-xs text-gray-800 font-medium">
                {renderValue(field, cptData[field])}
              </span>
            </div>
          ))}

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onBid && onBid(cptData)}
          className="w-full mt-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
        >
          Place Bid
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CPTCard;
