import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const params = await req.json()
  const user = await prisma.user.create({
    data: params,
  })
  return NextResponse.json(user)
}
