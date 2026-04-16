import { NextResponse } from 'next/server';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || '';
  const isPrisma = dbUrl.startsWith('prisma://');
  const isMysql = dbUrl.startsWith('mysql://');
  const hasQuotes = dbUrl.startsWith('"') || dbUrl.endsWith('"');
  
  return NextResponse.json({
    status: 'ok',
    environmentVarsCheck: {
      hasDatabaseUrl: !!dbUrl,
      isPrisma,
      isMysql,
      hasQuotes,
      prefix: dbUrl.substring(0, 20) + '...',
      length: dbUrl.length
    }
  });
}
