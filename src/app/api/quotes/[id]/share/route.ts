import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, message } = await req.json()
    if (!projectId) {
      return NextResponse.json({ error: 'ID de Proyecto es requerido' }, { status: 400 })
    }

    const { id } = await params
    const quoteId = Number(id)

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { client: true }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 })
    }

    // IMPORTANT: Per user request, "sharing" DOES NOT link.
    // So we do NOT update quote.projectId or quote.isBudget.
    
    const clientName = quote.clientName || quote.client?.name || 'Cliente'
    const chatContent = `📤 COTIZACIÓN COMPARTIDA (#${quote.id})\nPara: ${clientName}\n\n${message || 'Se ha compartido esta cotización para revisión.'}\n\nTotal: $${Number(quote.totalAmount).toFixed(2)}`

    // Create bitácora message
    const msg = await prisma.chatMessage.create({
      data: {
        projectId: Number(projectId),
        userId: Number(session.user.id),
        content: chatContent,
        type: 'TEXT'
      }
    })

    return NextResponse.json({ success: true, message: 'Cotización enviada al proyecto (sin vinculación).' })
  } catch (error) {
    console.error('Error sharing quote to project chat:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
