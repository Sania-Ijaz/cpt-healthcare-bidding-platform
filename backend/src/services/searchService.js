const CPTData = require('../models/CPTData');

/**
 * Search CPT codes with optional filters
 */
const searchCPT = async ({ cpt, zip, page = 1, limit = 20 }) => {
  const query = {};

  if (cpt) {
    query.$or = [
      { cptCode: { $regex: cpt, $options: 'i' } },
      { description: { $regex: cpt, $options: 'i' } },
    ];
  }

  if (zip) {
    query.zipCode = zip;
  }

  const skip = (page - 1) * limit;
  const [results, total] = await Promise.all([
    CPTData.find(query).skip(skip).limit(limit).lean(),
    CPTData.countDocuments(query),
  ]);

  return {
    results,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { searchCPT };
