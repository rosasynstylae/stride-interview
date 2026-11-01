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

## Appointment Create Times
Always update the end date/end time when the start date/end date updates
such that the same amount of time between the start and end remains.
I decided to do this to make it a little less clunky to update 
appointments to different days/times, as I am assuming that
appointments are generally the same amount of time (defaulted to 1hr)

# Nice to Haves
- Cleaner Scheduling UI for appointments (the date/time fields is a little clunky)
- Patient list filtering (frontend only, obvs)
- Patient details header/title use the patient name
- Appointment details header/title use the patient name + appointment date
- check appointment over booking for a patient (providers may have multiple people at the same time, but patients can't have multiple providers at the same time)
- appointment create page: swap patient dropdown to a searchable select
- pre-commit linting (maybe tsc?)
- consistent router urls (to make it DRYer/more maintainable)
- save provider details in a global context, rather than re-fetching so much
- Easier "check in" flow
- Ability to filter out "completed" appointments

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

## Settings
Related to feature flags, would be good to have settings set up.
The setting I can think of needing currently is the "default appointment time" for auto-fill on the appointment create.
