import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Rotas que não precisam de autenticação
const publicRoutes = ['/', '/login', '/register', '/forgot-password']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Permite acesso a rotas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Verifica se existe token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    // Verifica se o token é válido
    jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    return NextResponse.next()
  } catch (error) {
    // Token inválido, redireciona para login
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

// Configuração de quais rotas o middleware deve atuar
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication routes)
     * 2. /_next/static (static files)
     * 3. /_next/image (image optimization files)
     * 4. /favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
} 