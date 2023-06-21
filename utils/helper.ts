export const isCurrentPage = (page: string) => {
  if (global?.window?.location) {
    // console.log(page, global.window.location, isCurrentPage(page) )
    return global.window.location.pathname.includes(page)
  } else return false;
}