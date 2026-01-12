import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all recent tales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const type = searchParams.get('type'); // 'all' or 'incidents'
    
    let tales;
    
    if (type === 'incidents') {
      // Get only medium/high/critical incidents
      tales = await prisma.tale.findMany({
        where: {
          severity: {
            in: ['medium', 'high', 'critical']
          }
        },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });
    } else {
      // Get all tales
      tales = await prisma.tale.findMany({
        orderBy: { timestamp: 'desc' },
        take: limit,
      });
    }
    
    return NextResponse.json(tales);
    
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}