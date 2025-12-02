'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

export default function MarketAnalysisPage() {
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
  }, [router])

  const markets = [
    { 
      country: 'Nederland', 
      opportunity: 'Hoog', 
      competition: 'Gemiddeld', 
      regulations: 'CE Markering vereist', 
      growth: '+12%',
      marketSize: '€2.8 miljard',
      keyPlayers: '3 grote distributeurs',
      entryBarrier: 'Laag',
      avgDealSize: '€45.000'
    },
    { 
      country: 'Duitsland', 
      opportunity: 'Zeer Hoog', 
      competition: 'Hoog', 
      regulations: 'CE + MDR', 
      growth: '+18%',
      marketSize: '€8.5 miljard',
      keyPlayers: '5 grote distributeurs',
      entryBarrier: 'Gemiddeld',
      avgDealSize: '€125.000'
    },
    { 
      country: 'België', 
      opportunity: 'Hoog', 
      competition: 'Laag', 
      regulations: 'CE Markering', 
      growth: '+15%',
      marketSize: '€1.2 miljard',
      keyPlayers: '2 grote distributeurs',
      entryBarrier: 'Laag',
      avgDealSize: '€28.000'
    },
    { 
      country: 'Frankrijk', 
      opportunity: 'Gemiddeld', 
      competition: 'Hoog', 
      regulations: 'CE + ANSM', 
      growth: '+8%',
      marketSize: '€6.3 miljard',
      keyPlayers: '4 grote distributeurs',
      entryBarrier: 'Hoog',
      avgDealSize: '€95.000'
    },
    { 
      country: 'Verenigd Koninkrijk', 
      opportunity: 'Hoog', 
      competition: 'Gemiddeld', 
      regulations: 'UKCA Markering', 
      growth: '+10%',
      marketSize: '€4.1 miljard',
      keyPlayers: '3 grote distributeurs',
      entryBarrier: 'Gemiddeld',
      avgDealSize: '€68.000'
    },
    { 
      country: 'Spanje', 
      opportunity: 'Gemiddeld', 
      competition: 'Gemiddeld', 
      regulations: 'CE Markering', 
      growth: '+9%',
      marketSize: '€3.2 miljard',
      keyPlayers: '3 grote distributeurs',
      entryBarrier: 'Gemiddeld',
      avgDealSize: '€52.000'
    },
    { 
      country: 'Italië', 
      opportunity: 'Hoog', 
      competition: 'Hoog', 
      regulations: 'CE + AIFA', 
      growth: '+11%',
      marketSize: '€5.7 miljard',
      keyPlayers: '4 grote distributeurs',
      entryBarrier: 'Hoog',
      avgDealSize: '€78.000'
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Marktanalyse & Insights
          </h2>
          <p className="text-gray-400">
            Marktonderzoek en kansen per land/regio
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {markets.map((market, index) => (
            <div key={index} className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">{market.country}</h3>
                <span className="px-3 py-1 bg-green-600/20 border border-green-500/30 text-green-400 rounded text-sm">
                  {market.growth}
                </span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-sm text-gray-400">Kans:</span>
                    <span className="ml-2 text-white font-medium">{market.opportunity}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Marktgrootte:</span>
                    <span className="ml-2 text-white font-medium">{market.marketSize}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Concurrentie:</span>
                    <span className="ml-2 text-white font-medium">{market.competition}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Toegangsbarrière:</span>
                    <span className="ml-2 text-white font-medium">{market.entryBarrier}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Regulaties:</span>
                    <span className="ml-2 text-white font-medium">{market.regulations}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Gem. Deal:</span>
                    <span className="ml-2 text-white font-medium">{market.avgDealSize}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-800">
                  <span className="text-sm text-gray-400">Belangrijkste spelers:</span>
                  <span className="ml-2 text-white font-medium">{market.keyPlayers}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Trends & Kansen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="font-medium text-white">Digital Health Groei</div>
              </div>
              <div className="text-sm text-gray-400">Sterke groei in digitale health oplossingen, vooral in DACH regio. Verwacht +25% groei in 2024.</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-yellow-600/20 rounded-lg">
                  <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="font-medium text-white">Regulatory Changes</div>
              </div>
              <div className="text-sm text-gray-400">Nieuwe MDR vereisten in EU vanaf 2024. Belangrijk om compliance te waarborgen.</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-green-600/20 rounded-lg">
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="font-medium text-white">E-commerce Groei</div>
              </div>
              <div className="text-sm text-gray-400">Online distributie kanalen groeien met +30% per jaar. Kans voor digitale partnerships.</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-brand-500/20 rounded-lg">
                  <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="font-medium text-white">Consolidatie Markt</div>
              </div>
              <div className="text-sm text-gray-400">Kleinere distributeurs worden overgenomen. Kans voor exclusieve partnerships met grotere spelers.</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}







