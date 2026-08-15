/**
 * Utility to calculate page ranges with ellipsis for pagination components
 */
export function getPaginationRange(currentPage: number, totalPages: number, maxVisible: number = 5): (number | string)[] {
  if (totalPages <= 1) return [1];

  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  return pages;
}
