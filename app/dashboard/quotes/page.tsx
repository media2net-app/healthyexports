'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Quote {
  id: string
  quoteNumber: string
  distributorId: string
  distributorName: string
  productLine: string
  amount: number
  currency: string
  validUntil: string
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected'
  createdAt: string
}

export default function QuotesPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newQuote, setNewQuote] = useState<Partial<Quote>>({
    distributorName: '',
    productLine: '',
    amount: 0,
    currency: 'EUR',
    validUntil: '',
    status: 'draft'
  })

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadQuotes()
  }, [router])

  const loadQuotes = () => {
    const saved = JSON.parse(localStorage.getItem('quotes') || '[]')
    
    // Add demo quotes if no quotes exist
    if (saved.length === 0) {
      const demoQuotes: Quote[] = [
        {
          id: 'demo-1',
          quoteNumber: 'QT-202401',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          productLine: 'Premium Health Supplements',
          amount: 45000,
          currency: 'EUR',
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'sent',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-2',
          quoteNumber: 'QT-202402',
          distributorId: 'demo-2',
          distributorName: 'MedSupply Germany',
          productLine: 'Medical Devices',
          amount: 125000,
          currency: 'EUR',
          validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'viewed',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'demo-3',
          quoteNumber: 'QT-202403',
          distributorId: 'demo-3',
          distributorName: 'Belgian Health Solutions',
          productLine: 'Wellness Products',
          amount: 28000,
          currency: 'EUR',
          validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'accepted',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      localStorage.setItem('quotes', JSON.stringify(demoQuotes))
      setQuotes(demoQuotes)
    } else {
      setQuotes(saved)
    }
  }

  const handleCreateQuote = () => {
    const quote: Quote = {
      id: Date.now().toString(),
      quoteNumber: `QT-${Date.now().toString().slice(-6)}`,
      distributorId: newQuote.distributorId || '',
      distributorName: newQuote.distributorName || '',
      productLine: newQuote.productLine || '',
      amount: newQuote.amount || 0,
      currency: newQuote.currency || 'EUR',
      validUntil: newQuote.validUntil || '',
      status: newQuote.status || 'draft',
      createdAt: new Date().toISOString()
    }

    const updated = [...quotes, quote]
    setQuotes(updated)
    localStorage.setItem('quotes', JSON.stringify(updated))
    setShowModal(false)
    setNewQuote({ distributorName: '', productLine: '', amount: 0, currency: 'EUR', validUntil: '', status: 'draft' })
  }

  const handleUpdateStatus = (id: string, status: Quote['status']) => {
    const updated = quotes.map(q => q.id === id ? { ...q, status } : q)
    setQuotes(updated)
    localStorage.setItem('quotes', JSON.stringify(updated))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-600/20 border-green-500/30 text-green-400'
      case 'rejected': return 'bg-red-600/20 border-red-500/30 text-red-400'
      case 'viewed': return 'bg-blue-600/20 border-blue-500/30 text-blue-400'
      case 'sent': return 'bg-yellow-600/20 border-yellow-500/30 text-yellow-400'
      default: return 'bg-gray-600/20 border-gray-500/30 text-gray-400'
    }
  }

  const totalValue = quotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + q.amount, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Offerte & Pricing Management
            </h2>
            <p className="text-gray-400">
              Beheer offertes en pricing per distributeur
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nieuwe Offerte</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Totaal Offerte Waarde</div>
            <div className="text-2xl font-bold text-white">€{totalValue.toLocaleString('nl-NL')}</div>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Verzonden</div>
            <div className="text-2xl font-bold text-white">{quotes.filter(q => q.status === 'sent' || q.status === 'viewed').length}</div>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Geaccepteerd</div>
            <div className="text-2xl font-bold text-green-400">{quotes.filter(q => q.status === 'accepted').length}</div>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Afgewezen</div>
            <div className="text-2xl font-bold text-red-400">{quotes.filter(q => q.status === 'rejected').length}</div>
          </div>
        </div>

        {/* Quotes List */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Offertes ({quotes.length})</h3>
          </div>
          {quotes.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {quotes.map((quote) => (
                <div key={quote.id} className="p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="font-medium text-white">{quote.quoteNumber}</div>
                        <span className={`px-3 py-1 rounded text-xs border ${getStatusColor(quote.status)}`}>
                          {quote.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-1">
                        {quote.distributorName} • {quote.productLine}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString('nl-NL')} • 
                        Geldig tot: {new Date(quote.validUntil).toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="text-xl font-bold text-white">
                        {quote.currency} {quote.amount.toLocaleString('nl-NL')}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(quote.id, 'sent')}
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium"
                      >
                        Verzend
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-400">Nog geen offertes aangemaakt</p>
            </div>
          )}
        </div>

        {/* Pricing Calculator */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Pricing Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Basisprijs</label>
              <input
                type="number"
                placeholder="1000"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Korting (%)</label>
              <input
                type="number"
                placeholder="10"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Eindprijs</label>
              <div className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                €900
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Nieuwe Offerte</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Distributeur</label>
                  <input
                    type="text"
                    value={newQuote.distributorName}
                    onChange={(e) => setNewQuote({ ...newQuote, distributorName: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Productlijn</label>
                  <input
                    type="text"
                    value={newQuote.productLine}
                    onChange={(e) => setNewQuote({ ...newQuote, productLine: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bedrag</label>
                    <input
                      type="number"
                      value={newQuote.amount}
                      onChange={(e) => setNewQuote({ ...newQuote, amount: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Valuta</label>
                    <select
                      value={newQuote.currency}
                      onChange={(e) => setNewQuote({ ...newQuote, currency: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Geldig tot</label>
                  <input
                    type="date"
                    value={newQuote.validUntil}
                    onChange={(e) => setNewQuote({ ...newQuote, validUntil: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setNewQuote({ distributorName: '', productLine: '', amount: 0, currency: 'EUR', validUntil: '', status: 'draft' })
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleCreateQuote}
                  className="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  Aanmaken
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}







