import type { TSelectOption } from "@/components/ui/SelectField";
import type { TPatient } from "./types/patient";
import type { TProvider } from "./types/provider";

const toProviderOption = (p: TProvider): TSelectOption => ({
  label: `${p.firstName} ${p.lastName}`,
  value: p.id,
});

const toPatientOption = (p: TPatient): TSelectOption => ({
  label: `${p.firstName} ${p.lastName}`,
  value: String(p.id),
});

export { toProviderOption, toPatientOption };
