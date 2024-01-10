import { useRouter } from "next/router"

export const useCurrentPage = () => {
  const router = useRouter();
  return router.route
}