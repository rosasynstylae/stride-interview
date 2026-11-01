import { Flex } from "@chakra-ui/react/flex";
import type { TSelectOption } from "../ui/SelectField";
import {
  AppointmentEndFields,
  AppointmentProviderField,
  AppointmentStatusField,
  AppointmentStartFields,
  AppointmentTypeField,
} from "./FormFields";

interface TAppointmentFormProps {
  providers: TSelectOption[];
}

function AppointmentForm({ providers }: TAppointmentFormProps) {
  return (
    <Flex direction="column" gap={4}>
      <AppointmentStartFields />
      <AppointmentEndFields />
      <AppointmentTypeField />
      <AppointmentStatusField />
      <AppointmentProviderField providers={providers} />
    </Flex>
  );
}

export { AppointmentForm };
