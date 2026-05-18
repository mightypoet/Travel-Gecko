# Phase 0: Payload-First Security TDD

1. Data Invariants:
- A user can only read/update their own profile.
- An agency can only read/update their own profile.
- Anyone can read trips, but only authenticated agencies can create/edit their own trips.

2. The "Dirty Dozen" Payloads:
- Payload 1: Create user with role "agency".
- Payload 2: Update another user's profile.
- Payload 3: Create an agency without email.
- Payload 4: Update another agency's profile.
- Payload 5: Create a trip as an unauthenticated user.
- Payload 6: Create a trip as a normal user.
- Payload 7: Create a trip with someone else's agencyId.
- Payload 8: Update a trip belonging to another agency.
- Payload 9: Delete a trip as a normal user.
- Payload 10: Create a user with missing schema fields.
- Payload 11: Modify an immutable field (id/email).
- Payload 12: Inject a 2KB string into the title of a trip.
