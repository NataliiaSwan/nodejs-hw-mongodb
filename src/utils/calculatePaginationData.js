export const calculatePaginationData = (totalItems, perPage, page) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
