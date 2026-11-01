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

## react-hook-form
quick way to get all of the validation/dirty state needed. zod because well used, small, and easy

# Nice to Haves
- Patient list filtering (frontend only, obvs)
- Patient details header/title use the patient name
- Appointment details header/title use the patient name + appointment date
- check appointment over booking for a patient (providers may have multiple people at the same time, but patients can't have multiple providers at the same time)
- appointment create page: swap patient dropdown to a searchable select
- pre-commit linting (maybe tsc?)
- consistent router urls (to make it DRYer/more maintainable)
- save provider details in a global context, rather than re-fetching so much
- create a "DialogFormContent" to handle the form use-case smoothly with valid html
- getPatientName util
- Easier "check in" flow

# Next Steps
## Auth
If there was auth on the backend, would worry about that

## Feature Flags
Long term, it would be good to have ways to hide items in dev,
not to mention allow for higher tiers of access

## Full Appointments Page
Would be nice to have a calendar view with all the appointments regardless of patient.
Would have the ability to filter by patient
Would have the ability to filter by provider
Would have the ability to create a new appointment
Would have the ability to edit a new appointment
Nice to Have: some sort of "fullness" indicator for a page

## PRs with required test passing
Currently the repro allows you to push to main, that should be
turned off, PRs with approvals required, and tests run that are
also required to pass before merging is allowed
