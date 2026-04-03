import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import OperatorDashboardClient from './OperatorDashboardClient'
import OfflinePrefetcher from '@/components/OfflinePrefetcher'

export const dynamic = 'force-dynamic'

export default async function OperatorDashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/admin/login')
  }

  // Redirect admins to their dashboard
  if (session.user.role === 'ADMIN' || session.user.role === 'ADMINISTRADORA' || session.user.role === 'SUPERADMIN') {
    redirect('/admin')
  }

  // Redirect subcontratistas to their dashboard
  if (session.user.role === 'SUBCONTRATISTA') {
    redirect('/admin/subcontratista')
  }

  const userId = Number(session.user.id)

  // Fetch data in parallel
  const [activeProjects, activeDayRecord, appointments] = await Promise.all([
    prisma.project.findMany({
      where: {
        team: { some: { userId } },
        status: { in: ['LEAD', 'ACTIVO', 'PENDIENTE'] }
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        client: { select: { name: true, city: true, address: true } },
        phases: { 
          orderBy: { displayOrder: 'asc' },
          select: { id: true, title: true, status: true } 
        },
      }
    }),
    prisma.dayRecord.findFirst({
        where: { userId, endTime: null },
        include: { project: { select: { title: true } } }
    }),
    prisma.appointment.findMany({
        where: { userId },
        orderBy: { startTime: 'asc' },
        include: { project: { select: { title: true } } }
    })
  ])

  // Build URLs for offline use
  const prefetchUrls = [
    ...activeProjects.map((p: any) => `/admin/operador/proyecto/${p.id}`),
    '/admin/inventario',
    '/admin/cotizaciones',
    '/admin/cotizaciones/nuevo',
    '/admin/cotizaciones/offline',
    '/admin/recursos',
  ]

  return (
    <>
      <OfflinePrefetcher urls={prefetchUrls} />
      <OperatorDashboardClient 
        user={session.user}
        activeProjects={activeProjects}
        activeDayRecord={activeDayRecord}
        appointments={appointments}
      />
    </>
  )
}
