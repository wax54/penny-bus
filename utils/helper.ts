export const isCurrentPage = (page: string) => {
  if (global?.window?.location) {
    return global.window.location.pathname.includes(page);
  } else return false;
};
