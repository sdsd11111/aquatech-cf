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
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    const { id } = await params
    const quoteId = Number(id)

    // 1. Fetch quote details
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { items: true }
    })

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    const chatContent = message 
      ? `${message}\n\n📄 COTIZACIÓN VINCULADA (#${quote.id})\nTotal: $${Number(quote.totalAmount).toFixed(2)}`
      : `📄 COTIZACIÓN VINCULADA (#${quote.id})\n\nTotal: $${Number(quote.totalAmount).toFixed(2)}\n\nEsta cotización ha sido vinculada permanentemente a este proyecto.`

    // 2. CREATE bitácora message AND UPDATE permanent link
    const [msg, updatedQuote] = await prisma.$transaction([
      prisma.chatMessage.create({
        data: {
          projectId: Number(projectId),
          userId: Number(session.user.id),
          content: chatContent,
          type: 'TEXT'
        }
      }),
      prisma.quote.update({
        where: { id: quoteId },
        data: { projectId: Number(projectId) }
      })
    ])

    return NextResponse.json({ success: true, result: msg })
  } catch (error) {
    console.error('Error sending quote to project:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
