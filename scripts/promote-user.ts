/**
 * Promote a user to STAFF or ADMIN role.
 *
 * Usage:
 *   bun run scripts/promote-user.ts <discordId|username> <STAFF|ADMIN>
 *
 * Examples:
 *   bun run scripts/promote-user.ts 123456789 ADMIN
 *   bun run scripts/promote-user.ts "Carlos RP" STAFF
 *
 * You can find your Discord ID by enabling Developer Mode in Discord
 * (Settings → Advanced → Developer Mode) then right-clicking your name → Copy ID.
 */
import { db } from "../src/lib/db"

async function main() {
  const [identifier, role] = process.argv.slice(2)

  if (!identifier || !role) {
    console.error("Usage: bun run scripts/promote-user.ts <discordId|username> <STAFF|ADMIN>")
    console.error("Examples:")
    console.error("  bun run scripts/promote-user.ts 123456789 ADMIN")
    console.error('  bun run scripts/promote-user.ts "Carlos RP" STAFF')
    process.exit(1)
  }

  const upperRole = role.toUpperCase()
  if (upperRole !== "STAFF" && upperRole !== "ADMIN") {
    console.error(`Invalid role "${role}". Must be STAFF or ADMIN.`)
    process.exit(1)
  }

  // Try to find user by Discord ID first, then by username
  let user = await db.user.findUnique({
    where: { discordId: identifier },
  })

  if (!user) {
    user = await db.user.findFirst({
      where: { username: { contains: identifier } },
    })
  }

  if (!user) {
    console.error(`User not found with identifier: ${identifier}`)
    console.error("Tip: You can use either the Discord ID or the username.")
    console.error("Existing users:")
    const allUsers = await db.user.findMany({
      select: { discordId: true, username: true, role: true },
    })
    console.table(allUsers)
    process.exit(1)
  }

  const updated = await db.user.update({
    where: { id: user.id },
    data: { role: upperRole },
  })

  console.log("✅ User promoted successfully!")
  console.table({
    id: updated.id,
    discordId: updated.discordId,
    username: updated.username,
    role: updated.role,
  })
  console.log("\nThe user will need to log out and log back in for the change to take effect.")
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
