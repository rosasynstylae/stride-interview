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
- Create appointment
  - patient id
  - date
  - start time
  - end time
  - type
  - status
  - provider id

## Patient Details
- Create appointment
  - date
  - start time
  - end time
  - type
  - status
  - provider id

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
- Appointment Edit
- Patient Edit
- Testing
- Patient list filtering
- Patient details header/title use the patient name (would use context, probably)
- full appointments list, regardless of patient

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

# Next Steps
## Auth
If there was auth on the backend, would worry about that

## Build Size
Build size is a little big; I would sit down and do some work to make it smaller