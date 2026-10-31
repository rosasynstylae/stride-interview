import type { TProvider } from "@/utils/types/provider";

const getProviderById = (
  providers: TProvider[],
  id: string,
): TProvider | undefined => providers.find((p) => p.id === id);

export { getProviderById };
