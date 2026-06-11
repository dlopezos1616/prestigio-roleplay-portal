import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    // Create test users
    const user1 = await db.user.upsert({
      where: { discordId: 'dev-user' },
      update: {},
      create: { discordId: 'dev-user', username: 'Jugador Demo', role: 'USER' },
    })

    const user2 = await db.user.upsert({
      where: { discordId: 'dev-staff' },
      update: {},
      create: { discordId: 'dev-staff', username: 'Staff Demo', role: 'STAFF' },
    })

    const user3 = await db.user.upsert({
      where: { discordId: 'dev-admin' },
      update: {},
      create: { discordId: 'dev-admin', username: 'Admin Demo', role: 'ADMIN' },
    })

    const user4 = await db.user.upsert({
      where: { discordId: '123456789' },
      update: {},
      create: { discordId: '123456789', username: 'Carlos RP', role: 'USER' },
    })

    const user5 = await db.user.upsert({
      where: { discordId: '987654321' },
      update: {},
      create: { discordId: '987654321', username: 'María EMS', role: 'USER' },
    })

    // Create whitelist applications
    const app1 = await db.whitelistApplication.create({
      data: {
        userId: user4.id,
        answer1:
          'El Power Gaming es cuando un jugador utiliza información o habilidades que su personaje no poseería en la realidad del rol. Por ejemplo, si un civil sin entrenamiento médico realiza una cirugía complicada porque el jugador sabe cómo se hace.',
        answer2:
          'El Meta Gaming consiste en usar información obtenida fuera del rol (OOC) para tomar decisiones dentro del rol (IC). Esto arruina la inmersión porque el personaje actúa con conocimientos que no debería tener.',
        answer3:
          'OOC (Out of Character) es cuando hablas como jugador, no como personaje. IC (In Character) es cuando actúas y hablas como tu personaje. En el chat, OOC se usa con /b y IC es el chat normal.',
        answer4:
          'NVL es no valorar la vida de tu personaje, como no rendirte cuando tienes un arma apuntándote. VDM es Vehicle Deathmatch, usar un vehículo para atropellar a otros sin razón de rol.',
        answer5:
          'Si estoy en una situación donde un secuestrador me amenaza y un amigo me pide ayuda por radio, elegiría seguir las instrucciones del secuestrador para proteger la vida de mi personaje, ya que el NVL es una falta grave. Priorizaría la supervivencia sobre la ayuda.',
        status: 'PENDING',
        attemptNumber: 1,
      },
    })

    const app2 = await db.whitelistApplication.create({
      data: {
        userId: user5.id,
        answer1:
          'Power Gaming es forzar acciones sobre otros jugadores sin darles oportunidad de reaccionar. Ejemplo: /me golpea al jugador y lo noquea, sin permitir defensa.',
        answer2:
          'Meta Gaming es usar información externa al rol, como ver el stream de alguien y usar esa info en el juego. Destruye la experiencia RP para todos.',
        answer3:
          'OOC es comunicación entre jugadores, IC es comunicación entre personajes. Es fundamental separarlos para mantener la inmersión.',
        answer4:
          'NVL es actuar como si tu vida no importara. VDM es matar con vehículos sin justificación RP. Ambos son faltas graves.',
        answer5:
          'En una situación donde debo elegir entre salvar a un aliado o seguir órdenes de un superior, evaluaría el contexto RP completo. Si mi personaje es leal al aliado, intentaría un rescate estratégico sin comprometer mi vida innecesariamente.',
        status: 'PENDING',
        attemptNumber: 1,
      },
    })

    // Create a rejected application
    const app3 = await db.whitelistApplication.create({
      data: {
        userId: user1.id,
        answer1: 'Es jugar mucho',
        answer2: 'No sé',
        answer3: 'No sé la diferencia',
        answer4: 'No sé qué es',
        answer5: 'No sé qué haría',
        status: 'REJECTED',
        attemptNumber: 1,
        reviewerId: user3.id,
        reviewedAt: new Date(),
        rejectReason:
          'Respuestas demasiado cortas y sin profundidad. Debes demostrar que entiendes los conceptos básicos del roleplay.',
      },
    })

    // Create an approved application
    const app4 = await db.whitelistApplication.create({
      data: {
        userId: user2.id,
        answer1:
          'El Power Gaming es cuando un jugador fuerza acciones que no son realistas dentro del contexto del rol, ignorando las limitaciones de su personaje. Ejemplo: un civil que de repente sabe desactivar alarmas de alta seguridad sin tener formación.',
        answer2:
          'El Meta Gaming es utilizar información que el personaje no debería conocer en el mundo del rol, pero el jugador sí la sabe por canales externos. Esto arruina la experiencia porque rompe la barrera entre realidad y ficción.',
        answer3:
          'OOC (Out of Character) se refiere a todo lo que es fuera del personaje, el jugador real. IC (In Character) es cuando actúas como tu personaje dentro del mundo del rol. Separarlos es esencial para la inmersión.',
        answer4:
          'NVL (No Valorar la Vida) es no actuar como si tu vida importara, por ejemplo no cooperar con alguien que te apunta con un arma. VDM (Vehicle Deathmatch) es usar vehículos para matar sin motivo de rol. Ambos se consideran faltas graves.',
        answer5:
          'Si mi personaje es policía y descubre que su hermano es un criminal buscado, viviría un conflicto interno. Como mi personaje valora la ley pero también a su familia, intentaría convencer a su hermano de entregarse voluntariamente, priorizando su seguridad pero sin traicionar mis principios.',
        status: 'APPROVED',
        attemptNumber: 1,
        reviewerId: user3.id,
        reviewedAt: new Date(),
      },
    })

    // Create tasks for today
    const today = new Date().toISOString().split('T')[0]
    const tasks = await Promise.all([
      db.task.create({
        data: {
          title: 'Revisar whitelist pendientes',
          assigneeId: user2.id,
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          date: today,
          notes: 'Hay 2 solicitudes nuevas',
        },
      }),
      db.task.create({
        data: {
          title: 'Organizar evento del viernes',
          assigneeId: user3.id,
          status: 'TODO',
          priority: 'MEDIUM',
          date: today,
          notes: 'Evento de carreras',
        },
      }),
      db.task.create({
        data: {
          title: 'Actualizar normativas',
          assigneeId: user2.id,
          status: 'TODO',
          priority: 'LOW',
          date: today,
          notes: 'Añadir sección de VDM',
        },
      }),
      db.task.create({
        data: {
          title: 'Reparar script de inventario',
          assigneeId: user3.id,
          status: 'BLOCKED',
          priority: 'URGENT',
          date: today,
          notes: 'Esperando dependencia del framework',
        },
      }),
      db.task.create({
        data: {
          title: 'Capacitación nuevos staff',
          assigneeId: user3.id,
          status: 'DONE',
          priority: 'MEDIUM',
          date: today,
          notes: 'Completada sesión 1',
        },
      }),
    ])

    // Create gallery images
    const galleryImages = await Promise.all([
      db.galleryImage.create({
        data: {
          url: '/gallery/patrol.jpg',
          title: 'Patrulla Nocturna',
          description:
            'Unidad de policía patrullando las calles de Los Santos al anochecer',
          eventTag: 'Operaciones',
          uploadedById: user3.id,
        },
      }),
      db.galleryImage.create({
        data: {
          url: '/gallery/race.jpg',
          title: 'Gran Premio de Los Santos',
          description:
            'La carrera más emocionante del año en el circuito de la ciudad',
          eventTag: 'Eventos',
          uploadedById: user3.id,
        },
      }),
      db.galleryImage.create({
        data: {
          url: '/gallery/ems.jpg',
          title: 'Rescate de Emergencia',
          description:
            'El equipo EMS en una operación de rescate en la zona montañosa',
          eventTag: 'Operaciones',
          uploadedById: user2.id,
        },
      }),
      db.galleryImage.create({
        data: {
          url: '/gallery/fbi.jpg',
          title: 'Operación Encubierta',
          description:
            'Agentes del FBI durante una investigación de alto perfil',
          eventTag: 'Entrenamientos',
          uploadedById: user3.id,
        },
      }),
    ])

    // Create audit logs
    const auditLogs = await Promise.all([
      db.auditLog.create({
        data: {
          actorId: user3.id,
          action: 'WHITELIST_APPROVED',
          entityType: 'WhitelistApplication',
          entityId: app4.id,
          metadata: JSON.stringify({ userId: user2.id, attemptNumber: 1 }),
        },
      }),
      db.auditLog.create({
        data: {
          actorId: user3.id,
          action: 'WHITELIST_REJECTED',
          entityType: 'WhitelistApplication',
          entityId: app3.id,
          metadata: JSON.stringify({
            userId: user1.id,
            attemptNumber: 1,
            reason: 'Respuestas insuficientes',
          }),
        },
      }),
      db.auditLog.create({
        data: {
          actorId: user3.id,
          action: 'GALLERY_UPLOAD',
          entityType: 'GalleryImage',
          entityId: galleryImages[0].id,
          metadata: JSON.stringify({ title: 'Patrulla Nocturna' }),
        },
      }),
      db.auditLog.create({
        data: {
          actorId: user2.id,
          action: 'TASK_CREATED',
          entityType: 'Task',
          entityId: tasks[0].id,
          metadata: JSON.stringify({ title: 'Revisar whitelist pendientes' }),
        },
      }),
    ])

    // Create notifications
    await Promise.all([
      db.notification.create({
        data: {
          userId: user2.id,
          type: 'WHITELIST_SUBMITTED',
          payload: JSON.stringify({
            applicationId: app1.id,
            username: 'Carlos RP',
          }),
        },
      }),
      db.notification.create({
        data: {
          userId: user2.id,
          type: 'WHITELIST_SUBMITTED',
          payload: JSON.stringify({
            applicationId: app2.id,
            username: 'María EMS',
          }),
        },
      }),
      db.notification.create({
        data: {
          userId: user1.id,
          type: 'WHITELIST_REJECTED',
          payload: JSON.stringify({
            applicationId: app3.id,
            reason: 'Respuestas insuficientes',
          }),
        },
      }),
      db.notification.create({
        data: {
          userId: user2.id,
          type: 'TASK_ASSIGNED',
          payload: JSON.stringify({
            taskId: tasks[0].id,
            title: 'Revisar whitelist pendientes',
          }),
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      created: {
        users: 5,
        whitelistApps: 4,
        tasks: tasks.length,
        galleryImages: galleryImages.length,
        auditLogs: auditLogs.length,
        notifications: 4,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Seed failed', details: String(error) },
      { status: 500 }
    )
  }
}
