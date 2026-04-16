import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProjectExecutionClient from '@/components/ProjectExecutionClient'
import { deepSerialize } from '@/lib/serializable'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function OperatorProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const userId = Number(session.user.id)
  const projectId = Number(id)

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: { select: { name: true, phone: true, address: true, city: true } },
      phases: { orderBy: { displayOrder: 'asc' } },
      team: { include: { user: { select: { name: true, role: true } } } },
      chatMessages: {
        take: 1
      },
      gallery: { orderBy: { createdAt: 'desc' } }
    }
  })

  // If project doesn't exist or user not in team, back to dashboard
  const isInTeam = (project as any)?.team.some((t: any) => t.userId === userId)
  if (!project || !isInTeam) {
    redirect('/admin/operador')
  }

  // Mark chat as seen for this user
  await prisma.projectView.upsert({
    where: {
      userId_projectId: {
        userId,
        projectId
      }
    },
    update: { lastSeen: new Date() },
    create: {
      userId,
      projectId,
      lastSeen: new Date()
    }
  })

  // Reload all chat messages for this project with user info
  const chatMessages = await prisma.chatMessage.findMany({
    where: { projectId },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { name: true } }, media: true }
  })

  // Find if user has ANY active day record across ALL projects
  const globalActiveRecord = await prisma.dayRecord.findFirst({
    where: { userId, endTime: null },
    include: { project: { select: { id: true, title: true } } }
  })

  // get user's expenses + all project notes
  const myExpenses = await prisma.expense.findMany({
    where: { 
      projectId, 
      OR: [
        { userId },
        { isNote: true }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })

  // Combine direct gallery uploads and chat media into a unified gallery with unique IDs
  const unifiedGallery = [
    ...(project as any).gallery || [],
    ...(chatMessages.flatMap((m: any) => m.media || []).map((m: any) => ({
      ...m,
      isFromChat: true
    })))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Manually build safe objects to ensure correct types and field names
  const safeProject = {
    id: (project as any).id,
    title: (project as any).title,
    status: (project as any).status,
    address: (project as any).address || (project as any).client?.address,
    phases: (project as any).phases.map((p: any) => ({
      id: p.id,
      title: p.title,
      status: p.status,
      description: p.description
    })),
    team: (project as any).team.map((t: any) => ({
      id: t.userId,
      name: t.user.name,
      role: t.user.role
    })),
    gallery: unifiedGallery.map(g => ({ 
      id: (g as any).isFromChat ? `chat-${g.id}` : `gal-${g.id}`, 
      url: g.url, 
      filename: g.filename, 
      mimeType: g.mimeType,
      isFromChat: (g as any).isFromChat
    }))
  }

  const safeChat = chatMessages.map(msg => ({
    id: msg.id,
    phaseId: msg.phaseId,
    content: msg.content,
    type: msg.type,
    createdAt: msg.createdAt.toISOString(),
    userName: (msg as any).user.name,
    isMe: msg.userId === userId,
    media: (msg as any).media,
    extraData: msg.extraData
  }))

  const safeRecord = globalActiveRecord ? { 
    id: globalActiveRecord.id, 
    projectId: (globalActiveRecord as any).projectId,
    projectName: (globalActiveRecord as any).project.title,
    startTime: (globalActiveRecord as any).startTime.toISOString() 
  } : null

  const safeExpenses = myExpenses.map(e => ({ 
    id: e.id, 
    description: e.description, 
    amount: Number(e.amount), 
    date: e.date.toISOString(),
    isNote: e.isNote,
    userName: (e as any).user?.name || 'Operador'
  }))

  return (
    <div className="pt-0 pl-0 pr-0 sm:pt-6 sm:pl-6 sm:pr-6">
      <ProjectExecutionClient 
        {...deepSerialize({
          project: safeProject,
          initialChat: safeChat, 
          activeRecord: safeRecord, // Renamed but serves as "my current active session"
          expenses: safeExpenses,
          userId: userId,
          clientName: (project as any).client?.name || 'Cliente sin nombre',
          projectAddress: (project as any).address || (project as any).client?.address || '',
          projectCity: (project as any).client?.city || '',
          panelBase: "/admin/operador"
        })}
      />
    </div>
  )
}
