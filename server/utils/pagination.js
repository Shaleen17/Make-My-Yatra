const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getPagination = (query = {}) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || DEFAULT_LIMIT, 1), MAX_LIMIT);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    isPaginated: query.page !== undefined || query.limit !== undefined,
  };
};

const buildPaginationMeta = ({ page, limit, total }) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit) || 0,
});

module.exports = {
  getPagination,
  buildPaginationMeta,
};
