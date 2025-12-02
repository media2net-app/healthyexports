'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface ComplianceItem {
  id: string
  distributorId: string
  distributorName: string
  certification: string
  expiryDate: string
  status: 'valid' | 'expiring' | 'expired'
}

export default function CompliancePage() {
  const router = useRouter()
  const [compliance, setCompliance] = useState<ComplianceItem[]>([])

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadCompliance()
  }, [router])

  const loadCompliance = () => {
    const distributors = JSON.parse(localStorage.getItem('distributors') || '[]')
    const items: ComplianceItem[] = []

    distributors.forEach((dist: any) => {
      dist.certifications?.forEach((cert: string, index: number) => {
        const expiryDate = new Date(Date.now() + (365 - index * 30) * 24 * 60 * 60 * 1000)
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        
        let status: ComplianceItem['status'] = 'valid'
        if (daysUntilExpiry < 0) status = 'expired'
        else if (daysUntilExpiry < 90) status = 'expiring'

        items.push({
          id: `${dist.id}-${cert}`,
          distributorId: dist.id,
          distributorName: dist.name,
          certification: cert,
          expiryDate: expiryDate.toISOString(),
          status
        })
      })
    })

    setCompliance(items)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'expired': return 'bg-red-600/20 border-red-500/30 text-red-400'
      case 'expiring': return 'bg-yellow-600/20 border-yellow-500/30 text-yellow-400'
      default: return 'bg-green-600/20 border-green-500/30 text-green-400'
    }
  }

  const expiringSoon = compliance.filter(c => c.status === 'expiring')
  const expired = compliance.filter(c => c.status === 'expired')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Compliance & Certificering
          </h2>
          <p className="text-gray-400">
            Track certificeringen en compliance per distributeur
          </p>
        </div>

        {/* Alerts */}
        {expired.length > 0 && (
          <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-red-400 font-medium">{expired.length} certificering(en) verlopen</span>
            </div>
          </div>
        )}

        {expiringSoon.length > 0 && (
          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-400 font-medium">{expiringSoon.length} certificering(en) verlopen binnen 90 dagen</span>
            </div>
          </div>
        )}

        {/* Compliance List */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Certificeringen ({compliance.length})</h3>
          </div>
          {compliance.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {compliance.map((item) => {
                const daysUntilExpiry = Math.floor((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={item.id} className="p-6 hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="font-medium text-white">{item.distributorName}</div>
                          <span className={`px-3 py-1 rounded text-xs border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mb-1">
                          Certificering: {item.certification}
                        </div>
                        <div className="text-sm text-gray-500">
                          Verloopt: {new Date(item.expiryDate).toLocaleDateString('nl-NL')}
                          {daysUntilExpiry >= 0 && ` (${daysUntilExpiry} dagen)`}
                          {daysUntilExpiry < 0 && ` (${Math.abs(daysUntilExpiry)} dagen geleden)`}
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/dashboard/distributors/${item.distributorId}`)}
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium"
                      >
                        Bekijk
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-gray-400">Nog geen certificeringen geregistreerd</p>
            </div>
          )}
        </div>

        {/* Compliance Checklist */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Compliance Checklist per Land</h3>
          <div className="space-y-3">
            {['Nederland', 'Duitsland', 'België', 'Frankrijk'].map(country => (
              <div key={country} className="p-4 bg-gray-800 rounded-lg">
                <div className="font-medium text-white mb-2">{country}</div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-700 text-brand-500 focus:ring-brand-500" />
                    <span className="text-sm text-gray-300">CE Markering</span>
                  </label>
                  {country === 'Duitsland' && (
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-700 text-brand-500 focus:ring-brand-500" />
                      <span className="text-sm text-gray-300">MDR Compliance</span>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}






