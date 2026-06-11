# Task 5 - Staff & Admin Panels + API Routes

## Summary
Created all required API routes and the two major panel components (StaffPanel and AdminPanel) for the Prestigio Roleplay portal.

## Files Created

### API Routes (11 files)
1. `/src/app/api/tasks/route.ts` - GET (list with date filter) + POST (create task)
2. `/src/app/api/tasks/[id]/route.ts` - PATCH (update task) + DELETE (delete task)
3. `/src/app/api/gallery/route.ts` - GET (list with tag filter) + POST (upload image)
4. `/src/app/api/gallery/[id]/route.ts` - DELETE (delete image)
5. `/src/app/api/notifications/route.ts` - GET (by userId) + PATCH (mark read)
6. `/src/app/api/audit/route.ts` - GET (with date & actorId filters)
7. `/src/app/api/users/route.ts` - GET (list all users)
8. `/src/app/api/users/[id]/route.ts` - PATCH (update user, e.g. role)
9. `/src/app/api/stats/route.ts` - GET (aggregate stats)
10. `/src/app/api/whitelist/route.ts` - GET (list apps with status filter) + POST (submit app)
11. `/src/app/api/whitelist/[id]/route.ts` - PATCH (approve/reject with reason)

### Components (2 files)
1. `/src/components/staff/StaffPanel.tsx` - 4-tab staff panel:
   - Whitelist Inbox: table with filter, detail dialog with approve/reject, reject reason textarea
   - Tareas Diarias: date picker, task table with inline status/priority editing, add/delete tasks
   - Actividad del Staff: date picker, audit log table
   - Notificaciones: notification list with mark-read, unread count badge

2. `/src/components/admin/AdminPanel.tsx` - 4-tab admin panel:
   - Métricas: stat cards (total users, pending/approved/rejected WL, active tasks) + bar chart
   - Gestión de Usuarios: user table with role change dropdown (USER/STAFF/ADMIN)
   - Galería: upload form, tag filter, image grid with delete button
   - Auditoría: full audit log table with date/actor filters, CSV export

## Styling
- All panels use neon theme: bg-[#0f172a], neon-border, neon-glow, neon-text-glow
- Tab navigation with active glow effect
- Status/priority badges with color-coded backgrounds
- Consistent dark theme with purple/cyan accents

## Lint Status
- All files pass `bun run lint` with zero errors
