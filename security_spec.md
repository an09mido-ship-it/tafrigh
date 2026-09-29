# Security Specification

## 1. Data Invariants
- Every user in `/users/{userId}` must have their document ID match their authenticated UID (`request.auth.uid == userId`).
- Standard users cannot promote themselves to `admin` or unblock themselves (`status: 'blocked'`).
- The `role` and `status` fields can only be modified by an authorized Admin (`isAdmin()`).
- Initial creation of `/users/{userId}` requires `status: 'active'` (unless predetermined admin), `uid == request.auth.uid`, and immutable `createdAt`.
- Only Admins have `list` permission over the `/users` collection to prevent email scraping or user enumeration.
- Admin privilege is determined strictly and exclusively for administrator email: `ahmedschoolp@gmail.com` (and `ahmed schoolp@gmail.com`). All other registered accounts are standard users without permissions to list users or modify user statuses.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Read on /users**: Anonymous user attempts to list `/users` collection -> `PERMISSION_DENIED`.
2. **ID Spoofing on User Profile Creation**: User with `uid_A` attempts to write document to `/users/uid_B` -> `PERMISSION_DENIED`.
3. **Privilege Escalation on Signup**: Standard user creates `/users/{uid}` with `role: 'admin'` without being an authorized admin email -> `PERMISSION_DENIED`.
4. **Self-Unblock Attempt**: User whose status is `'blocked'` attempts to update their own document to `status: 'active'` -> `PERMISSION_DENIED`.
5. **Unauthorized Admin List**: Non-admin user attempts `list` on `/users` -> `PERMISSION_DENIED`.
6. **Self-Promotion to Admin Record**: Non-admin user creates `/admins/{request.auth.uid}` -> `PERMISSION_DENIED`.
7. **Cross-User Profile Tampering**: User `uid_A` attempts to update displayName or lastLoginAt of `uid_B` -> `PERMISSION_DENIED`.
8. **Shadow Field Injection**: Non-admin user attempts update to include undocumented fields or modified `uid` -> `PERMISSION_DENIED`.
9. **Creation with Malformed UID**: Document ID containing path traversal or invalid characters -> `PERMISSION_DENIED`.
10. **Admin Record Deletion by Non-Admin**: Standard user attempts delete on `/admins/{userId}` -> `PERMISSION_DENIED`.
11. **Excessive String Payload**: User attempts writing `blockedReason` or `displayName` with 50KB payload exceeding limits -> `PERMISSION_DENIED`.
12. **Unverified Email Spoofing**: User spoofing admin email with unverified token trying to access admin sub-resources -> `PERMISSION_DENIED`.

## 3. Test Runner Specification
The test suite validates each invariant and guarantees that all unauthorized reads and mutations return `PERMISSION_DENIED`.
