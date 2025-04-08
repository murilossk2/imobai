import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()

interface JwtPayload {
  userId: string
}

interface PropertyData {
  address: string
  area: number
  bedrooms?: number
  bathrooms?: number
  parkingSpots?: number
  description?: string
}

// Função para extrair o userId do token JWT
async function getUserIdFromToken() {
  const cookiesList = await cookies()
  const token = cookiesList.get('token')?.value

  if (!token) {
    throw new Error('Token não encontrado')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as JwtPayload
    return decoded.userId
  } catch (error) {
    console.error('Erro ao verificar token:', error)
    throw new Error('Token inválido')
  }
}

// Função para fazer a chamada à API da Perplexity
async function getPropertyEvaluation(propertyData: PropertyData) {
  const prompt = `
    Por favor, faça uma avaliação detalhada do seguinte imóvel:
    
    Endereço: ${propertyData.address}
    Área: ${propertyData.area}m²
    Quartos: ${propertyData.bedrooms}
    Banheiros: ${propertyData.bathrooms}
    Vagas de Garagem: ${propertyData.parkingSpots}
    Descrição Adicional: ${propertyData.description || 'Não fornecida'}
    
    Forneça:
    1. Uma estimativa de preço com faixa de valores (mínimo e máximo)
    2. Análise dos pontos fortes do imóvel
    3. Comparação com mercado local
    4. Potencial de valorização
    5. Recomendações para melhorar o valor do imóvel
  `

  const response = await axios.post(
    'https://api.perplexity.ai/chat/completions',
    {
      model: 'mixtral-8x7b-instruct',
      messages: [
        {
          role: 'system',
          content:
            'Você é um especialista em avaliação imobiliária. Forneça análises precisas e profissionais.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data.choices[0].message.content
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromToken()
    const propertyData = await request.json()

    // Validação básica dos dados
    if (!propertyData.address || !propertyData.area) {
      return new NextResponse('Dados incompletos', { status: 400 })
    }

    // Obtém a avaliação da API da Perplexity
    const evaluationResult = await getPropertyEvaluation(propertyData)

    // Salva a avaliação no banco de dados
    const evaluation = await prisma.evaluation.create({
      data: {
        ...propertyData,
        result: { evaluation: evaluationResult },
        userId,
      },
    })

    return NextResponse.json(evaluation)
  } catch (error) {
    console.error('Erro na avaliação:', error)
    return new NextResponse(
      'Erro ao processar a avaliação',
      { status: 500 }
    )
  }
} 