export const isCurrentPage = (testPage: string, currentPage: string) => {
  if (currentPage && testPage) {
    return currentPage === testPage;
  } else return false;
};
