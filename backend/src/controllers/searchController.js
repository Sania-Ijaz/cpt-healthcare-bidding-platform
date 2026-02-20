const searchService = require('../services/searchService');
const successResponse = require('../utils/successResponse');

/**
 * GET /api/search?cpt=XXX&zip=YYY
 */
const search = async (req, res, next) => {
  try {
    const { cpt, zip, page, limit } = req.query;
    const data = await searchService.searchCPT({ cpt, zip, page, limit });
    return successResponse(res, 200, 'Search results retrieved.', data);
  } catch (error) {
    next(error);
  }
};

module.exports = { search };
