import { useQuery } from "@tanstack/react-query";
import { apiAction, getFullUrl } from "../api";
import { PROVIDER_URLS } from "../urls";
import { FETCH_PROVIDER_LIST_KEY } from "../keys";
import type { TProvider } from "@/utils/types/provider";

const fetchProviderList = (): Promise<TProvider[]> => {
  return apiAction(getFullUrl(PROVIDER_URLS.FETCH_LIST), { method: "GET" });
};

const useFetchProviderList = () =>
  useQuery({
    queryKey: FETCH_PROVIDER_LIST_KEY,
    queryFn: fetchProviderList,
    // Providers rarely change; don't refetch on every patient page
    staleTime: 5 * 60_000,
  });

export { fetchProviderList, useFetchProviderList };
