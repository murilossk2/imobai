'use client'

import { useState } from 'react'

interface EvaluationResult {
  id: string
  address: string
  area: number
  bedrooms: number
  bathrooms: number
  parkingSpots: number
  description?: string
  result: {
    evaluation: string
  }
  userId: string
  createdAt: string
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData(e.currentTarget)
    const data = {
      address: formData.get('address'),
      area: Number(formData.get('area')),
      bedrooms: Number(formData.get('bedrooms')),
      bathrooms: Number(formData.get('bathrooms')),
      parkingSpots: Number(formData.get('parkingSpots')),
      description: formData.get('description'),
    }

    try {
      const res = await fetch('/api/evaluations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Erro ao realizar avaliação')
      }

      const evaluation = await res.json()
      setResult(evaluation)
    } catch (error) {
      console.error('Erro:', error)
      setError('Erro ao processar sua solicitação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-green-500 font-bold text-xl">ImobiAI</div>
            </div>
            <div>
              <button
                onClick={() => fetch('/api/auth/logout', { method: 'POST' })}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-gray-900 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-green-500 mb-6">
              Nova Avaliação Imobiliária
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-300"
                >
                  Endereço Completo
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  className="mt-1 block w-full rounded-md border-gray-800 bg-gray-800 text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    name="area"
                    id="area"
                    required
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-800 bg-gray-800 text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bedrooms"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Quartos
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    id="bedrooms"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-800 bg-gray-800 text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="bathrooms"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Banheiros
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    id="bathrooms"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-800 bg-gray-800 text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="parkingSpots"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Vagas de Garagem
                  </label>
                  <input
                    type="number"
                    name="parkingSpots"
                    id="parkingSpots"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-800 bg-gray-800 text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300"
                >
                  Descrição Adicional
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-800 bg-gray-800 text-gray-100 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processando...' : 'Avaliar Imóvel'}
                </button>
              </div>
            </form>

            {result && (
              <div className="mt-8 p-6 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium text-green-500 mb-4">
                  Resultado da Avaliação
                </h3>
                <pre className="text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 