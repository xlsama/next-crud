import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const params = await req.json()
  await prisma.user.delete({
    where: {
      id: params.id,
    },
  })
  return NextResponse.json({})
}
