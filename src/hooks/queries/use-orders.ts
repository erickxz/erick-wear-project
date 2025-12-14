import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/actions/get-orders";

export const getOrdersQueryKey = () => ["orders"] as const;

export const useOrders = () => {
  return useQuery({
    queryKey: getOrdersQueryKey(),
    queryFn: getOrders,
  });
};
