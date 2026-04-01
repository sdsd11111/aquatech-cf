import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const quote = await prisma.quote.findUnique({
      where: { id: Number(id) },
      include: { items: true, client: true }
    })
    
    if (!quote) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    
    return NextResponse.json(quote)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching quote' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.quote.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting quote' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: rawId } = await params
    const id = Number(rawId)
    const data = await req.json()
    const items = data.items || []

    // 1. Delete all existing items for this quote
    await prisma.quoteItem.deleteMany({
      where: { quoteId: id }
    })

    // 2. Update quote and create new items
    const updatedQuote = await prisma.quote.update({
      where: { id },
      data: {
        status: data.status || 'BORRADOR',
        
        // Snapshot client data (might have been edited in form)
        clientName: data.clientName,
        clientRuc: data.clientRuc,
        clientAddress: data.clientAddress,
        clientPhone: data.clientPhone,
        clientAttention: data.clientAttention,

        // Financial summary
        subtotal: Number(data.subtotal || 0),
        subtotal0: Number(data.subtotal0 || 0),
        subtotal15: Number(data.subtotal15 || 0),
        ivaAmount: Number(data.ivaAmount || 0),
        discountTotal: Number(data.discountTotal || 0),
        totalAmount: Number(data.totalAmount || 0),

        notes: data.notes,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        
        items: {
          create: items.map((item: any) => ({
            materialId: item.materialId ? Number(item.materialId) : null,
            description: item.description,
            quantity: item.quantity === 'GLOBAL' ? 1 : Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            discountPct: Number(item.discountPct || 0),
            isTaxed: item.isTaxed !== undefined ? Boolean(item.isTaxed) : true,
            total: Number(item.total)
          }))
        }
      },
      include: { items: true }
    })

    return NextResponse.json(updatedQuote)
  } catch (error) {
    console.error('[QUOTE_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Error updating quote' }, { status: 500 })
  }
}
