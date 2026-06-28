-- ============================================================
-- Prestigio Roleplay Portal — Schema SQL para PostgreSQL (Neon)
-- ============================================================
-- Pega todo este contenido en el SQL Editor de Neon y ejecútalo:
--   1. Entra en https://neon.tech → tu proyecto
--   2. Menú izquierdo: "SQL Editor"
--   3. Pega este contenido completo
--   4. Click en "Run"
-- ============================================================

-- Tabla de usuarios (vinculados a Discord)
CREATE TABLE IF NOT EXISTS "User" (
    "id"            TEXT PRIMARY KEY,
    "discordId"     TEXT NOT NULL UNIQUE,
    "username"      TEXT NOT NULL,
    "avatar"        TEXT,
    "role"          TEXT NOT NULL DEFAULT 'USER',
    "accessToken"   TEXT,
    "refreshToken"  TEXT,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabla de solicitudes de whitelist
CREATE TABLE IF NOT EXISTS "WhitelistApplication" (
    "id"            TEXT PRIMARY KEY,
    "userId"        TEXT NOT NULL,
    "answer1"       TEXT NOT NULL,
    "answer2"       TEXT NOT NULL,
    "answer3"       TEXT NOT NULL,
    "answer4"       TEXT NOT NULL,
    "answer5"       TEXT NOT NULL,
    "status"        TEXT NOT NULL DEFAULT 'PENDING',
    "attemptNumber" INTEGER NOT NULL DEFAULT 1,
    "reviewerId"    TEXT,
    "reviewedAt"    TIMESTAMPTZ,
    "rejectReason"  TEXT,
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "WhitelistApplication_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "WhitelistApplication_reviewerId_fkey"
        FOREIGN KEY ("reviewerId") REFERENCES "User"("id")
);

-- Tabla de tareas (staff)
CREATE TABLE IF NOT EXISTS "Task" (
    "id"          TEXT PRIMARY KEY,
    "title"       TEXT NOT NULL,
    "assigneeId"  TEXT,
    "status"      TEXT NOT NULL DEFAULT 'TODO',
    "priority"    TEXT NOT NULL DEFAULT 'MEDIUM',
    "dueDate"     TIMESTAMPTZ,
    "notes"       TEXT,
    "date"        TEXT NOT NULL,
    "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "Task_assigneeId_fkey"
        FOREIGN KEY ("assigneeId") REFERENCES "User"("id")
);

-- Tabla de imágenes de galería
CREATE TABLE IF NOT EXISTS "GalleryImage" (
    "id"           TEXT PRIMARY KEY,
    "url"          TEXT NOT NULL,
    "title"        TEXT,
    "description"  TEXT,
    "eventTag"     TEXT,
    "uploadedById" TEXT NOT NULL,
    "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "GalleryImage_uploadedById_fkey"
        FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Tabla de logs de auditoría
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id"         TEXT PRIMARY KEY,
    "actorId"    TEXT NOT NULL,
    "action"     TEXT NOT NULL,
    "entityType" TEXT,
    "entityId"   TEXT,
    "metadata"   TEXT,
    "createdAt"  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "AuditLog_actorId_fkey"
        FOREIGN KEY ("actorId") REFERENCES "User"("id")
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS "Notification" (
    "id"        TEXT PRIMARY KEY,
    "userId"    TEXT NOT NULL,
    "type"      TEXT NOT NULL,
    "payload"   TEXT,
    "readAt"    TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "Notification_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Tabla de configuración del sitio (key-value)
CREATE TABLE IF NOT EXISTS "SiteConfig" (
    "id"    TEXT PRIMARY KEY,
    "key"   TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL
);

-- ============================================================
-- Índices para mejorar el rendimiento de las consultas comunes
-- ============================================================
CREATE INDEX IF NOT EXISTS "User_discordId_idx" ON "User"("discordId");
CREATE INDEX IF NOT EXISTS "WhitelistApplication_userId_idx" ON "WhitelistApplication"("userId");
CREATE INDEX IF NOT EXISTS "WhitelistApplication_status_idx" ON "WhitelistApplication"("status");
CREATE INDEX IF NOT EXISTS "WhitelistApplication_reviewerId_idx" ON "WhitelistApplication"("reviewerId");
CREATE INDEX IF NOT EXISTS "Task_assigneeId_idx" ON "Task"("assigneeId");
CREATE INDEX IF NOT EXISTS "Task_status_idx" ON "Task"("status");
CREATE INDEX IF NOT EXISTS "Task_date_idx" ON "Task"("date");
CREATE INDEX IF NOT EXISTS "GalleryImage_uploadedById_idx" ON "GalleryImage"("uploadedById");
CREATE INDEX IF NOT EXISTS "AuditLog_actorId_idx" ON "AuditLog"("actorId");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Notification_readAt_idx" ON "Notification"("readAt");

-- ============================================================
-- Verificación: muestra las tablas creadas
-- ============================================================
SELECT tablename AS "Tabla creada"
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
