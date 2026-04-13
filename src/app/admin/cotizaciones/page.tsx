import { prisma } from '@/lib/prisma'
import QuotesListClient from './QuotesListClient'
import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

import { deepSerialize } from '@/lib/serializable'

export const dynamic = 'force-dynamic'

export default async function CotizacionesPage() {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role || 'OPERATOR'
  const userId = session?.user?.id ? Number(session.user.id) : null

  const quotesRaw = await prisma.quote.findMany({
    where: role === 'OPERATOR' ? { userId: userId } : {},
    include: {
      client: { select: { name: true } },
      project: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Manual injection to bypass stale prisma client
  const statusRaw = await prisma.$queryRaw<any[]>`SELECT id, is_budget FROM quotes`
  const statusMap = new Map(statusRaw.map(s => [s.id, !!s.is_budget]))

  const quotes = quotesRaw.map((q: any) => ({
    ...q,
    isBudget: statusMap.get(q.id) || false
  }))

  // Fetch projects for the "Send to Project" feature
  const projects = await prisma.project.findMany({
    select: { id: true, title: true, client: { select: { name: true } } },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="p-6">
      <div className="dashboard-header" style={{ marginBottom: '30px' }}>
        <div>
          <h2>Cotizaciones</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Gestiona presupuestos y propuestas para clientes.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/cotizaciones/materiales" prefetch={true} className="btn btn-ghost">Ver Materiales</Link>
          <Link href="/admin/cotizaciones/nuevo" prefetch={true} className="btn btn-primary">+ Nueva Cotización</Link>
        </div>
      </div>

      <QuotesListClient 
        initialQuotes={deepSerialize(quotes)} 
        activeProjects={deepSerialize(projects)}
      />
    </div>
  )
}
