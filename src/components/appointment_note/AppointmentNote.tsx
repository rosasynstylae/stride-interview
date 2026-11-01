import { useId } from "react";
import { DataList } from "@chakra-ui/react/data-list";
import { chakra } from "@chakra-ui/react/styled-system";
import type { TAppointmentNotes } from "@/utils/types/appointmentNotes";
import { ActionHeading } from "../ActionHeading";

interface TAppointmentNoteProps {
  note: TAppointmentNotes;
  /** e.g. "Note 1 · Jan 30, 2025"; names the article for screen readers */
  title: string;
  /** Rendered beside the title (e.g. an edit button) */
  headerAction?: React.ReactNode;
}

function AppointmentNote({ note, title, headerAction }: TAppointmentNoteProps) {
  const headingId = useId();

  return (
    <chakra.article aria-labelledby={headingId}>
      <ActionHeading
        title={title}
        headingId={headingId}
        headerAction={headerAction}
        headingLevel="h3"
        size="md"
        align="center"
        gap={2}
        mb={2}
      />
      {/* pre-wrap: keep line breaks typed into the textareas */}
      <DataList.Root orientation="vertical" gap={3}>
        <DataList.Item>
          <DataList.ItemLabel>Chief complaint</DataList.ItemLabel>
          <DataList.ItemValue whiteSpace="pre-wrap">
            {note.chiefComplaint}
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Treatment plan</DataList.ItemLabel>
          <DataList.ItemValue whiteSpace="pre-wrap">
            {note.treatmentPlan}
          </DataList.ItemValue>
        </DataList.Item>
        <DataList.Item>
          <DataList.ItemLabel>Progress</DataList.ItemLabel>
          <DataList.ItemValue whiteSpace="pre-wrap">
            {note.progress}
          </DataList.ItemValue>
        </DataList.Item>
      </DataList.Root>
    </chakra.article>
  );
}

export { AppointmentNote };
