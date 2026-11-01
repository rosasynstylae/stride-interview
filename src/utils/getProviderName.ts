import { getProviderById } from "./getProviderById";
import type { TProvider } from "./types/provider";

/** "First Last" for the provider, or "Provider #id" when they're not in the list */
const getProviderName = (providers: TProvider[], id: string): string => {
  const provider = getProviderById(providers, id);
  return provider
    ? `${provider.firstName} ${provider.lastName}`
    : `Provider #${id}`;
};

export { getProviderName };
