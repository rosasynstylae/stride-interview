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

## "Prod"

You can see a "Prod" version at:
https://stride-interview.vercel.app/

# Tech Info

I tended to focus on using a View/Container setup, with composibility.

I did not use context/redux, as I did not see an urgent, good use case for global state
on this small, non-prod set up.

I used react-query with functions that used fetch to handle API calls.

## Pages
I used react-router to split the system to several pages:

- Home
- Appointment Creation
- Patient List
- Patient Details

### Home

- does no fetching or data management (aside from if nav is open/closed)
- renders a header bar (with navigation)
  - handles nav open/close state
- renders a list of pre-defined links

```text
              +----------+
              |   Home   |
              +----------+
                   |
         +---------+---------+
         |                   |
+------------------+   +------------+
|    HeaderBar     |   | QuickLinks |
| (nav open/close) |   +------------+
+------------------+
```

### Appointment creation page:

- renders a header bar (with navigation)
  - handles nav open/close state
- renders AppointmentCreationContainer
- AppointmentCreationContainer fetches providers and patients
- AppointmentCreationContainer renders an error, spinner, or the AppointmentCreateFormContainer
- AppointmentCreateFormContainer handles form state, submitting to the api + rendering the AppointmentForm (patient dropdown version)

```text
           +-------------------------+
           | AppointmentCreationPage |
           +-------------------------+
                        |
         +--------------+-------------+
         |                            |
+------------------+   +------------------------------+
|    HeaderBar     |   | AppointmentCreationContainer |
| (nav open/close) |   | (fetches providers/patients) |
+------------------+   +------------------------------+
                                      |
           +--------------+-----------+---------------+
           |              |                           |
      +---------+   +------------+   +---------------------------------+
      | Spinner |   | ErrorAlert |   |  AppointmentCreateFormContainer |
      +---------+   +------------+   | (form state, create api hookup) |
                                     +---------------------------------+
                                                      |
                                           +----------+-------------+
                                           |                        |
                               +------------------------+   +---------------+
                               | AppointmentFormPatient |   | Submit Button |
                               +------------------------+   +---------------+
```

### Patient List

- renders a header bar (with navigation)
  - handles nav open/close state
- renders PatientListContainer
- PatientListContainer fetches the patient list
- PatientListContainer renders an error, spinner, or the PatientList and PatientCreateDialog
- PatientList renders a table of patients, where the name cell is a link to the details page
- PatientCreateDialog handles the create form state, submitting to the api + rendering the PatientForm

```text
                     +-----------------+
                     | PatientListPage |
                     +-----------------+
                              |
               +--------------+------------+
               |                           |
      +------------------+     +------------------------+
      |    HeaderBar     |     |  PatientListContainer  |
      | (nav open/close) |     | (fetches patient list) |
      +------------------+     +------------------------+
                                           |
     +--------------+----------------------+---------------------------+
     |              |                      |                           |
+---------+   +------------+   +------------------------+   +---------------------+
| Spinner |   | ErrorAlert |   |      PatientList       |   | PatientCreateDialog |
+---------+   +------------+   |    (patients table,    |   |     (form state,    |
                               | name links to details) |   |  create api hookup) |
                               +------------------------+   +---------------------+
                                                                       |
                                                           +-----------+-----+
                                                           |                 |
                                                    +-------------+   +-------------+
                                                    | PatientForm |   | Save Button |
                                                    +-------------+   +-------------+
```

### Patient Details

- grabs the id from the URL
- renders a header bar (with navigation)
  - handles nav open/close state
- renders PatientNotFound if no patient id
- renders PatientDetailsContainer
- PatientDetailsContainer fetches the patient information, appointments list, and provider list
- PatientDetailsContainer renders an error, spinner, or the PatientInfoContainer and AppointmentListContainer
- PatientInfoContainer manages the open/close state on the edit form for the Patient
- PatientInfoContainer renders either the PatientFormContainer or the read-only PatientInfo
- PatientFormContainer handles the edit form state, submitting to the api + rendering the PatientForm
- AppointmentListContainer renders an error, spinner (both based on appointments fetching state), or the AppointmentList, AppointmentCreateDialog, and the rendering for the date/time cell in the AppointmentList to include the AppointmentDetailsDrawer
- AppointmentCreateDialog handles the create form state, submitting to the api + rendering the AppointmentForm (without patient dropdown)
- AppointmentList renders a list of appointments where the date/time cell render function can be passed in
- AppointmentDetailsDrawer handles open/close state for itself
- AppointmentDetailsDrawer renders AppointmentDetailsContainer
- AppointmentDetailsContainer fetches the appointment information, appointment notes, and provider list
  - might consider using context for the appointment information, as it was already grabbed earlier on the page
- AppointmentDetailsContainer renders a loading spinner, error page, or the AppointmentInfoContainer, AppointmentNoteCreateDialog, and the NotesList
- AppointmentInfoContainer handles the open/close state for the edit form
- AppointmentInfoContainer renders either the AppointmentEditContainer or read-only AppointmentInformation and a button to allow for editting
- AppointmentEditContainer handles the edit form state, submitting to the api + rendering the AppointmentForm
- AppointmentNoteCreateDialog handles open/close state of the dialog
- AppointmentNoteCreateDialog renders the AppointmentNoteCreateForm
- AppointmentNoteCreateForm handles the create form state, submitting to the api + rendering the AppointmentNoteDialogContent (the form)
- NotesList renders a spinner, error message (based on notes fetching state), empty notes message, or a list of AppointmentNotes, each with an AppointmentNoteEditDialog
- AppointmentNotes renders read-only note information
- AppointmentNoteEditDialog handles the open/close state for the dialog
- AppointmentNoteEditDialog renders the AppointmentNoteEditForm
- AppointmentNoteEditForm handles the edit form state, submitting to the api + rendering AppointmentNoteDialogContent (the form)

```text
                      +--------------------+
                      | PatientDetailsPage |
                      |   (id from URL)    |
                      +--------------------+
                                |
         +----------------------+-------------------------+
         |                      |                         |
+------------------+   +-----------------+   +-------------------------+
|    HeaderBar     |   | PatientNotFound |   | PatientDetailsContainer |
| (nav open/close) |   |     (no id)     |   |     (diagram below)     |
+------------------+   +-----------------+   +-------------------------+
```

```text
                               +--------------------------+
                               | PatientDetailsContainer  |
                               |    (fetches patient,     |
                               | appointments, providers) |
                               +--------------------------+
                                            |
         +----------------------------------+------------------------------------+
         |                                  |                                    |
+-----------------+              +----------------------+          +---------------------------+
|    Spinner /    |              | PatientInfoContainer |          | AppointmentsListContainer |
|   ErrorAlert /  |              |  (edit open/close)   |          |      (diagram below)      |
| PatientNotFound |              +----------------------+          +---------------------------+
+-----------------+                         |
                                 +----------+-----------+
                                 |                      |
                      +----------------------+   +-------------+
                      | PatientFormContainer |   | PatientInfo |
                      |     (form state,     |   | (read-only) |
                      |  update api hookup)  |   +-------------+
                      +----------------------+
                                 |
                                 |
                                 |
                          +-------------+
                          | PatientForm |
                          +-------------+
```

```text
                   +---------------------------+
                   | AppointmentsListContainer |
                   +---------------------------+
                                 |
      +-----------------------+--+--------------------------+
      |                       |                             |
+------------+   +-------------------------+       +-----------------+
| Spinner /  |   | AppointmentCreateDialog |       | AppointmentList |
| ErrorAlert |   |       (form state,      |       | (date/time cell |
+------------+   |    create api hookup)   |       |    passed in)   |
                 +-------------------------+       +-----------------+
                              |                             |
                              |                             |
                              |                             |
                     +-----------------+       +--------------------------+
                     | AppointmentForm |       | AppointmentDetailsDrawer |
                     +-----------------+       |       (open/close,       |
                                               |      diagram below)      |
                                               +--------------------------+
```

```text
                              +--------------------------+
                              | AppointmentDetailsDrawer |
                              |       (open/close)       |
                              +--------------------------+
                                           |
                                           |
                                           |
                            +-----------------------------+
                            | AppointmentDetailsContainer |
                            |    (fetches appointment,    |
                            |      notes, providers)      |
                            +-----------------------------+
                                           |
      +------------------------------------+-----------------------------------+
      |                                    |                                   |
+------------+                +--------------------------+            +-----------------+
| Spinner /  |                | AppointmentInfoContainer |            |      Notes      |
| ErrorAlert |                |    (edit open/close)     |            | (diagram below) |
+------------+                +--------------------------+            +-----------------+
                                           |
                              +------------+-------------+
                              |                          |
                 +--------------------------+   +-----------------+
                 | AppointmentEditContainer |   | AppointmentInfo |
                 |       (form state,       |   |   (read-only)   |
                 |    update api hookup)    |   +-----------------+
                 +--------------------------+
                              |
                              |
                              |
                     +-----------------+
                     | AppointmentForm |
                     +-----------------+
```

```text
                 +-----------------------------+
                 | AppointmentDetailsContainer |
                 |           (notes)           |
                 +-----------------------------+
                                |
               +----------------+-----------------+
               |                                  |
+-----------------------------+         +--------------------+
| AppointmentNoteCreateDialog |         |     NotesList      |
|         (open/close)        |         | (spinner / error / |
+-----------------------------+         |   empty message)   |
               |                        +--------------------+
               |                                  |
               |                                  |
 +---------------------------+                    |
 | AppointmentNoteCreateForm |           +-----------------+
 |        (form state,       |           | AppointmentNote |
 |     create api hookup)    |           |   (read-only)   |
 +---------------------------+           +-----------------+
               |                                  |
               |                                  |
               |                                  |
+------------------------------+    +---------------------------+
| AppointmentNoteDialogContent |    | AppointmentNoteEditDialog |
|          (the form)          |    |        (open/close)       |
+------------------------------+    +---------------------------+
                                                  |
                                                  |
                                                  |
                                     +-------------------------+
                                     | AppointmentNoteEditForm |
                                     |       (form state,      |
                                     |    update api hookup)   |
                                     +-------------------------+
                                                  |
                                                  |
                                                  |
                                   +------------------------------+
                                   | AppointmentNoteDialogContent |
                                   |          (the form)          |
                                   +------------------------------+
```

## Choices

### Oxlint over ESLint

ESLint typescript doesn't support the newest version of typescript
Faster than ESLint
Most ESLint rules will run in Oxlint

### Chakra UI

Personal prefence over MUI
Generally I would go against CSS-in-JS (or at least use one that extracts on build rather than runtime), but wanted a fast set up

### React Router

Commonly used (and I'm familiar with it)
Easy way to split up the code

### @tanstack/react-query

Used this to easily handle fetching states and reduced-fetching on queries that are the same

### react-hook-form

quick way to get all of the validation/dirty state needed. zod because well used, small, and easy

### Appointment Create Times

Always update the end date/end time when the start date/end date updates
such that the same amount of time between the start and end remains.
I decided to do this to make it a little less clunky to update
appointments to different days/times, as I am assuming that
appointments are generally the same amount of time (defaulted to 1hr)

## Nice to Haves

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

Just some ideas on how to refine the system

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

## Metrics

Would be nice to have the ability to track quantitative metrics, such as:

- reduction in pain - overall and by provider
- time for initial eval to discarge - overall and by provider
- time for fix of chief complaint - overall and by provider
  I'm sure there's more I'm not thinking of right now
