const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });
const timeFormat = new Intl.DateTimeFormat(undefined, { timeStyle: "short" });

// Birthdays are calendar dates, not instants: read them in UTC so viewers
// west of UTC don't see the previous day.
const birthDateFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeZone: "UTC",
});

/** Date of an instant, in the viewer's timezone */
const formatDate = (iso: string): string => dateFormat.format(new Date(iso));

/** Time of an instant, in the viewer's timezone */
const formatTime = (iso: string): string => timeFormat.format(new Date(iso));

/** A date of birth, which should read the same in every timezone */
const formatBirthDate = (iso: string): string =>
  birthDateFormat.format(new Date(iso));

export { formatDate, formatTime, formatBirthDate };
