import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import QuoteFormClient from '../../nuevo/QuoteFormClient'

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quoteId = Number(id)

  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
    include: { items: true }
  })

  if (!quote) notFound()

  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' }
  })

  const materials = await prisma.material.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="admin-container">
      <div className="header-actions">
        <div>
          <h1 className="h1">Editar Cotización #{quote.id}</h1>
          <p className="text-muted">Modifica los materiales, precios o información del cliente.</p>
        </div>
      </div>

      <QuoteFormClient 
        clients={clients} 
        materials={materials} 
        initialQuote={JSON.parse(JSON.stringify(quote))} 
      />
    </div>
  )
}
