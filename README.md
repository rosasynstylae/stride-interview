# stride-interview
Patient Appointment Scheduler &amp; Documentation

# How to Run
## Development
In the base folder:

Run:
```
npm i
npm run dev
```

# TODO
## Appointment Set Up
- Create Form
  - Patient selection.
  - Date & time selection.
  - Provider selection (dropdown of available physical therapists).
  - Appointment type (Initial Evaluation, Follow-up, Discharge) `hardcoded enum`.
  - Status (Scheduled, Checked In, Canceled) `hardcoded enum`.

## Appointment View
- List of all appointments by date & time

## Patient List
- Create

## Patient Details
- Patient Details
  - name
  - date of birth
  - phone number
- Appointment List

## Appointment Details
- Appointment View
  - Clinical Notes List
    - chief complaint
    - treatment plan
    - progress notes
    - edit
  - Create Clinical Notes

## Misc
- nav link "current" styling
- error boundary

# Nice to Haves
## Appointment Edit
would be good to be able to edit an appointment

## Patient Edit
would be good to be able to edit a patient

## Testing
would be good to have tests

# Choices
## Oxlint over ESLint
ESLint typescript doesn't support the newest version of typescript
Faster than ESLint
Most ESLint rules will run in Oxlint

## Chakra UI
Personal prefence over MUI
Generally I would go against CSS-in-JS (or at least use one that extracts on build rather than runtime), but wanted a fast set up

## React Router
Commonly used (and I'm familiar with it)
Easy way to split up the code

## @tanstack/react-query
Used this to easily handle fetching states and reduced-fetching on queries that are the same

# Next Steps
## Auth
If there was auth on the backend, would worry about that

## Build Size
Build size is a little big; I would sit down and do some work to make it smaller