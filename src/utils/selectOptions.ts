import type { TSelectOption } from "@/components/ui/SelectField";
import type { TPatient } from "./types/patient";
import type { TProvider } from "./types/provider";
import { getPatientName } from "./getPatientName";

const toProviderOption = (p: TProvider): TSelectOption => ({
  label: `${p.firstName} ${p.lastName}`,
  value: p.id,
});

/**
 * Provider options that always include `currentId`. If the list doesn't have
 * that provider (still loading, failed, or not returned), a "Provider #id"
 * option is added first, so the select shows the real current value rather than
 * its placeholder while still submitting that id.
 */
const toProviderOptions = (
  providers: TProvider[],
  currentId?: string,
): TSelectOption[] => {
  const options = providers.map(toProviderOption);
  if (currentId && !providers.some((p) => p.id === currentId)) {
    options.unshift({ label: `Provider #${currentId}`, value: currentId });
  }
  return options;
};

const toPatientOption = (p: TPatient): TSelectOption => ({
  label: getPatientName(p),
  value: String(p.id),
});

export { toProviderOption, toProviderOptions, toPatientOption };
