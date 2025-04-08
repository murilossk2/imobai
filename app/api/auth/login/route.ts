import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Busca o usuário
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return new NextResponse('Usuário não encontrado', { status: 404 })
    }

    // Verifica a senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return new NextResponse('Senha inválida', { status: 401 })
    }

    // Gera o token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // Retorna o token em um cookie httpOnly
    const response = new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 horas
    })

    return response
  } catch (error) {
    console.error('Erro no login:', error)
    return new NextResponse('Erro interno do servidor', { status: 500 })
  }
} 