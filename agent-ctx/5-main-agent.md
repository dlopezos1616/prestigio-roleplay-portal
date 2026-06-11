# Task 5 — Hash-Based URL Routing + Notification Bell

## Agent: Main Agent
## Status: Completed ✅

## Summary of Changes

### Change 1: Hash-Based URL Routing for SPA Deep Linking

**File: `/home/z/my-project/src/lib/navigation.ts`** (Modified)

- Added `pageToHash` and `hashToPage` mapping objects for bidirectional PageId ↔ URL hash conversion
- Added `getInitialPage()` function that reads `window.location.hash` on page load (SSR-safe with `typeof window !== 'undefined'` guard)
- Modified `navigate()` to also update `window.location.hash` — only when hash actually changes to avoid redundant history entries
- Added module-level `hashchange` event listener (client-only) that responds to browser back/forward by calling `useNavigation.setState()` directly — avoids loop since it doesn't re-set the hash
- 'home' maps to empty hash (`''`), all other pages map to their name (e.g., `#staff`, `#galeria`)

**Files Verified (no changes needed):**
- `/home/z/my-project/src/app/page.tsx` — Uses `useNavigation()` which now syncs with URL hash
- `/home/z/my-project/src/components/layout/Navbar.tsx` — Calls `navigate()` which handles hash
- `/home/z/my-project/src/components/layout/DevLogin.tsx` — Calls `navigate()` which handles hash

### Change 2: Notification Bell in Navbar

**File: `/home/z/my-project/src/app/api/notifications/unread-count/route.ts`** (Created)

- GET endpoint accepting `userId` query parameter
- Returns `{ unreadCount: number }` using Prisma `db.notification.count()` where `readAt` is null
- Returns 400 if userId is missing

**File: `/home/z/my-project/src/components/layout/Navbar.tsx`** (Modified)

- Added `NotificationBell` inline component:
  - Uses `Bell` icon from lucide-react
  - Only renders when user is logged in (`useSession`)
  - Polls `/api/notifications/unread-count?userId={dbId}` every 30 seconds
  - Shows red dot badge (w-2.5 h-2.5 bg-red-500 with glow) when unread count > 0
  - Animates bell icon with framer-motion shake (rotate + scale) when new notifications arrive
  - Click: navigates to staff page for STAFF/ADMIN, shows toast "No tienes notificaciones" for regular users
  - Positioned between nav items and user dropdown in the user menu area
- Added imports: `useRef` from react, `Bell` from lucide-react, `toast` from sonner
- Removed `useCallback` import (no longer needed)

## Lint Results
- Only pre-existing error remains in `useSession.ts` (setState in effect) — not introduced by this task
- No new lint errors introduced

## Dev Server
- Running successfully on port 3000
- Page loads correctly with hash-based routing
