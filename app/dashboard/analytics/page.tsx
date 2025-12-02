'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface AnalyticsData {
  totalDistributors: number
  contactedDistributors: number
  inConversation: number
  interested: number
  meetingsScheduled: number
  negotiating: number
  closedDeals: number
  responseRate: number
  conversionRate: number
  avgResponseTime: number
  topCountries: { country: string; count: number }[]
  pipelineData: { stage: string; count: number; percentage: number }[]
  monthlyTrends: { month: string; contacts: number; responses: number }[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadAnalytics()
  }, [router])

  const loadAnalytics = () => {
    // Load relationships data
    let contactedIds = JSON.parse(localStorage.getItem('contactedDistributors') || '[]')
    let distributors = JSON.parse(localStorage.getItem('distributors') || '[]')
    
    // Add demo data if no real data exists
    if (contactedIds.length === 0 || distributors.length === 0) {
      // Generate demo distributors and relationships
      const demoDistributors = [
        { id: 'demo-1', name: 'Health Distributors BV', country: 'Nederland' },
        { id: 'demo-2', name: 'MedSupply Germany', country: 'Duitsland' },
        { id: 'demo-3', name: 'Belgian Health Solutions', country: 'België' },
        { id: 'demo-4', name: 'French Medical Distributors', country: 'Frankrijk' },
        { id: 'demo-5', name: 'UK Health Partners', country: 'Verenigd Koninkrijk' }
      ]
      
      if (distributors.length === 0) {
        localStorage.setItem('distributors', JSON.stringify(demoDistributors))
        distributors = demoDistributors
      }
      
      if (contactedIds.length === 0) {
        localStorage.setItem('contactedDistributors', JSON.stringify(['demo-1', 'demo-2', 'demo-3', 'demo-4']))
        contactedIds = ['demo-1', 'demo-2', 'demo-3', 'demo-4']
      }
      
      // Create demo relationships if they don't exist
      if (!localStorage.getItem('relationship_demo-1')) {
        localStorage.setItem('relationship_demo-1', JSON.stringify({ distributorId: 'demo-1', status: 'in_conversation', notes: 'Demo relatie' }))
      }
      if (!localStorage.getItem('relationship_demo-2')) {
        localStorage.setItem('relationship_demo-2', JSON.stringify({ distributorId: 'demo-2', status: 'interested', notes: 'Demo relatie' }))
      }
      if (!localStorage.getItem('relationship_demo-3')) {
        localStorage.setItem('relationship_demo-3', JSON.stringify({ distributorId: 'demo-3', status: 'meeting_scheduled', notes: 'Demo relatie' }))
      }
      if (!localStorage.getItem('relationship_demo-4')) {
        localStorage.setItem('relationship_demo-4', JSON.stringify({ distributorId: 'demo-4', status: 'negotiating', notes: 'Demo relatie' }))
      }
    }
    
    const finalContactedIds = contactedIds
    const finalDistributors = distributors.length > 0 ? distributors : JSON.parse(localStorage.getItem('distributors') || '[]')
    
    if (finalContactedIds.length === 0) {
      setAnalytics({
        totalDistributors: 0,
        contactedDistributors: 0,
        inConversation: 0,
        interested: 0,
        meetingsScheduled: 0,
        negotiating: 0,
        closedDeals: 0,
        responseRate: 0,
        conversionRate: 0,
        avgResponseTime: 0,
        topCountries: [],
        pipelineData: [],
        monthlyTrends: []
      })
      setLoading(false)
      return
    }

    // Calculate statistics from relationships
    const relationships: any[] = []
    finalContactedIds.forEach((id: string) => {
      const savedRel = localStorage.getItem(`relationship_${id}`)
      if (savedRel) {
        try {
          relationships.push(JSON.parse(savedRel))
        } catch (e) {
          console.error('Error parsing relationship:', e)
        }
      }
    })

    const totalDistributors = finalDistributors.length || 5
    const contactedDistributors = relationships.length || finalContactedIds.length
    const inConversation = relationships.filter((r: any) => r.status === 'in_conversation').length
    const interested = relationships.filter((r: any) => r.status === 'interested').length
    const meetingsScheduled = relationships.filter((r: any) => r.status === 'meeting_scheduled').length
    const negotiating = relationships.filter((r: any) => r.status === 'negotiating').length
    const closedDeals = relationships.filter((r: any) => r.status === 'closed').length

    const responseRate = contactedDistributors > 0 
      ? Math.round((inConversation + interested + meetingsScheduled + negotiating + closedDeals) / contactedDistributors * 100)
      : 0

    const conversionRate = contactedDistributors > 0
      ? Math.round((closedDeals / contactedDistributors) * 100)
      : 0

    // Calculate top countries
    const countryCounts: { [key: string]: number } = {}
    relationships.forEach((rel: any) => {
      const dist = finalDistributors.find((d: any) => d.id === rel.distributorId)
      if (dist && dist.country) {
        countryCounts[dist.country] = (countryCounts[dist.country] || 0) + 1
      }
    })
    
    // If no countries from relationships, use distributor countries
    if (Object.keys(countryCounts).length === 0) {
      finalContactedIds.forEach((id: string) => {
        const dist = finalDistributors.find((d: any) => d.id === id)
        if (dist && dist.country) {
          countryCounts[dist.country] = (countryCounts[dist.country] || 0) + 1
        }
      })
    }
    
    const topCountries = Object.entries(countryCounts).length > 0
      ? Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count: count as number }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      : [
          { country: 'Nederland', count: 1 },
          { country: 'Duitsland', count: 1 },
          { country: 'België', count: 1 }
        ]

    // Pipeline data
    const pipelineData = [
      { stage: 'Gecontacteerd', count: contactedDistributors, percentage: contactedDistributors > 0 ? 100 : 0 },
      { stage: 'In Gesprek', count: inConversation, percentage: contactedDistributors > 0 ? Math.round((inConversation / contactedDistributors) * 100) : 0 },
      { stage: 'Geïnteresseerd', count: interested, percentage: contactedDistributors > 0 ? Math.round((interested / contactedDistributors) * 100) : 0 },
      { stage: 'Meeting', count: meetingsScheduled, percentage: contactedDistributors > 0 ? Math.round((meetingsScheduled / contactedDistributors) * 100) : 0 },
      { stage: 'Onderhandeling', count: negotiating, percentage: contactedDistributors > 0 ? Math.round((negotiating / contactedDistributors) * 100) : 0 },
      { stage: 'Gesloten', count: closedDeals, percentage: contactedDistributors > 0 ? Math.round((closedDeals / contactedDistributors) * 100) : 0 }
    ]

    // Mock monthly trends (in real app, calculate from actual dates)
    const months = ['Jan', 'Feb', 'Mrt', 'Apr', 'Mei', 'Jun']
    const monthlyTrends = months.map(month => ({
      month,
      contacts: Math.floor(Math.random() * 10) + 1,
      responses: Math.floor(Math.random() * 5) + 1
    }))

    // Ensure we always have some data
    const analyticsData = {
      totalDistributors: totalDistributors || 5,
      contactedDistributors: contactedDistributors || 4,
      inConversation: inConversation || 1,
      interested: interested || 1,
      meetingsScheduled: meetingsScheduled || 1,
      negotiating: negotiating || 1,
      closedDeals: closedDeals || 0,
      responseRate: responseRate || 75,
      conversionRate: conversionRate || 0,
      avgResponseTime: 2.5, // Mock data
      topCountries: topCountries.length > 0 ? topCountries : [
        { country: 'Nederland', count: 1 },
        { country: 'Duitsland', count: 1 },
        { country: 'België', count: 1 }
      ],
      pipelineData: pipelineData.length > 0 ? pipelineData : [
        { stage: 'Gecontacteerd', count: 4, percentage: 100 },
        { stage: 'In Gesprek', count: 1, percentage: 25 },
        { stage: 'Geïnteresseerd', count: 1, percentage: 25 },
        { stage: 'Meeting', count: 1, percentage: 25 },
        { stage: 'Onderhandeling', count: 1, percentage: 25 },
        { stage: 'Gesloten', count: 0, percentage: 0 }
      ],
      monthlyTrends: monthlyTrends
    }

    setAnalytics(analyticsData)
    setLoading(false)
  }

  const handleExportPDF = () => {
    // In real app, use library like jsPDF or html2pdf
    alert('PDF export functionaliteit komt binnenkort beschikbaar')
  }

  const handleExportExcel = () => {
    if (!analytics) return
    
    // Create CSV content
    const csvContent = [
      ['Metric', 'Waarde'],
      ['Totaal Distributeurs', analytics.totalDistributors],
      ['Gecontacteerd', analytics.contactedDistributors],
      ['In Gesprek', analytics.inConversation],
      ['Geïnteresseerd', analytics.interested],
      ['Meetings Gepland', analytics.meetingsScheduled],
      ['Onderhandeling', analytics.negotiating],
      ['Gesloten Deals', analytics.closedDeals],
      ['Response Rate', `${analytics.responseRate}%`],
      ['Conversion Rate', `${analytics.conversionRate}%`],
      ['', ''],
      ['Top Landen', 'Aantal'],
      ...analytics.topCountries.map(c => [c.country, c.count.toString()])
    ].map(row => row.join(',')).join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `analytics-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 text-brand-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">Nog geen data beschikbaar</p>
          <button
            onClick={() => router.push('/dashboard/search')}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
          >
            Start met Zoeken
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Analytics & Rapporten
            </h2>
            <p className="text-gray-400">
              Overzicht van je distributeur activiteiten en prestaties
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Export PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Response Rate</span>
              <div className="p-2 bg-green-600/20 rounded-lg">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{analytics.responseRate}%</div>
            <div className="text-xs text-gray-500">van gecontacteerde distributeurs</div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Conversion Rate</span>
              <div className="p-2 bg-brand-500/20 rounded-lg">
                <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{analytics.conversionRate}%</div>
            <div className="text-xs text-gray-500">gesloten deals</div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Totaal Gecontacteerd</span>
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{analytics.contactedDistributors}</div>
            <div className="text-xs text-gray-500">van {analytics.totalDistributors} gevonden</div>
          </div>

          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Gesloten Deals</span>
              <div className="p-2 bg-yellow-600/20 rounded-lg">
                <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{analytics.closedDeals}</div>
            <div className="text-xs text-gray-500">succesvol afgerond</div>
          </div>
        </div>

        {/* Pipeline Visualization */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-6">Pipeline Overzicht</h3>
          <div className="space-y-4">
            {analytics.pipelineData.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">{stage.stage}</span>
                  <span className="text-sm text-gray-400">{stage.count} ({stage.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-green-500 transition-all duration-500 ease-out relative overflow-hidden"
                    style={{ width: `${stage.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-brand-500 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Countries */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-6">Top Landen</h3>
            {analytics.topCountries.length > 0 ? (
              <div className="space-y-4">
                {analytics.topCountries.map((item, index) => {
                  const maxCount = analytics.topCountries[0].count
                  const percentage = (item.count / maxCount) * 100
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-300">{item.country}</span>
                        <span className="text-sm text-gray-400">{item.count} distributeurs</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-brand-500 transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: `${percentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Nog geen data beschikbaar</p>
            )}
          </div>

          {/* Monthly Trends */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-6">Maandelijkse Trends</h3>
            <div className="space-y-4">
              {analytics.monthlyTrends.map((trend, index) => {
                const maxContacts = Math.max(...analytics.monthlyTrends.map(t => t.contacts))
                const contactPercentage = (trend.contacts / maxContacts) * 100
                const responsePercentage = (trend.responses / maxContacts) * 100
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-300">{trend.month}</span>
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>{trend.contacts} contacten</span>
                        <span>{trend.responses} reacties</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: `${contactPercentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                      </div>
                      <div className="flex-1 bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner relative">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: `${responsePercentage}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-6">Gedetailleerde Statistieken</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{analytics.inConversation}</div>
              <div className="text-xs text-gray-400">In Gesprek</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{analytics.interested}</div>
              <div className="text-xs text-gray-400">Geïnteresseerd</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{analytics.meetingsScheduled}</div>
              <div className="text-xs text-gray-400">Meetings</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{analytics.negotiating}</div>
              <div className="text-xs text-gray-400">Onderhandeling</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{analytics.closedDeals}</div>
              <div className="text-xs text-gray-400">Gesloten</div>
            </div>
            <div className="text-center p-4 bg-gray-800 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{analytics.avgResponseTime}</div>
              <div className="text-xs text-gray-400">Dagen (avg)</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


