// A form's date + "HH:mm" are the user's local time; the API stores UTC instants
const toISODateTime = (date: string, time: string): string =>
  new Date(`${date}T${time}`).toISOString();

export { toISODateTime };
