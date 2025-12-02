'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalDistributors: 0,
    contactedDistributors: 0,
    activeDeals: 0,
    pipelineValue: 0,
    responseRate: 0,
    conversionRate: 0,
    closedDeals: 0,
    avgDealValue: 0
  })
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Jan', contacts: 0, responses: 0, deals: 0 },
    { month: 'Feb', contacts: 0, responses: 0, deals: 0 },
    { month: 'Mrt', contacts: 0, responses: 0, deals: 0 },
    { month: 'Apr', contacts: 0, responses: 0, deals: 0 },
    { month: 'Mei', contacts: 0, responses: 0, deals: 0 },
    { month: 'Jun', contacts: 0, responses: 0, deals: 0 }
  ])
  const [topCountries, setTopCountries] = useState<Array<{country: string, count: number}>>([])
  const [recentActivities, setRecentActivities] = useState<Array<{
    type: string
    title: string
    description: string
    time: string
    icon: React.ReactNode
    color: string
  }>>([])

  useEffect(() => {
    loadDashboardData()
    loadRecentActivities()
  }, [])

  const loadDashboardData = () => {
    // Load distributors
    const distributors = JSON.parse(localStorage.getItem('distributors') || '[]')
    const contactedIds = JSON.parse(localStorage.getItem('contactedDistributors') || '[]')
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]')
    
    // Load relationships
    const relationships: any[] = []
    contactedIds.forEach((id: string) => {
      const savedRel = localStorage.getItem(`relationship_${id}`)
      if (savedRel) {
        relationships.push(JSON.parse(savedRel))
      }
    })

    // Calculate stats
    const totalDistributors = distributors.length || 5
    const contactedDistributors = relationships.length || contactedIds.length
    const closedDeals = relationships.filter((r: any) => r.status === 'closed').length
    const inProgress = relationships.filter((r: any) => 
      r.status === 'in_conversation' || r.status === 'interested' || r.status === 'negotiating'
    ).length
    
    // Calculate pipeline value from deals
    const deals = JSON.parse(localStorage.getItem('deals') || '[]')
    const pipelineValue = deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0)
    const activeDeals = deals.filter((d: any) => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length

    const responseRate = contactedDistributors > 0 
      ? Math.round((inProgress + closedDeals) / contactedDistributors * 100)
      : 75

    const conversionRate = contactedDistributors > 0
      ? Math.round((closedDeals / contactedDistributors) * 100)
      : 0

    const avgDealValue = deals.length > 0
      ? Math.round(deals.reduce((sum: number, d: any) => sum + (d.value || 0), 0) / deals.length)
      : 0

    // Calculate top countries
    const countryCounts: { [key: string]: number } = {}
    relationships.forEach((rel: any) => {
      const dist = distributors.find((d: any) => d.id === rel.distributorId)
      if (dist && dist.country) {
        countryCounts[dist.country] = (countryCounts[dist.country] || 0) + 1
      }
    })
    const topCountriesList = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Mock monthly data
    const monthly = [
      { month: 'Jan', contacts: Math.floor(Math.random() * 10) + 5, responses: Math.floor(Math.random() * 5) + 2, deals: Math.floor(Math.random() * 2) },
      { month: 'Feb', contacts: Math.floor(Math.random() * 10) + 5, responses: Math.floor(Math.random() * 5) + 2, deals: Math.floor(Math.random() * 2) },
      { month: 'Mrt', contacts: Math.floor(Math.random() * 10) + 5, responses: Math.floor(Math.random() * 5) + 2, deals: Math.floor(Math.random() * 2) },
      { month: 'Apr', contacts: contactedDistributors || Math.floor(Math.random() * 10) + 5, responses: inProgress || Math.floor(Math.random() * 5) + 2, deals: closedDeals || Math.floor(Math.random() * 2) },
      { month: 'Mei', contacts: Math.floor(Math.random() * 10) + 5, responses: Math.floor(Math.random() * 5) + 2, deals: Math.floor(Math.random() * 2) },
      { month: 'Jun', contacts: Math.floor(Math.random() * 10) + 5, responses: Math.floor(Math.random() * 5) + 2, deals: Math.floor(Math.random() * 2) }
    ]

    setStats({
      totalDistributors,
      contactedDistributors,
      activeDeals: activeDeals || inProgress,
      pipelineValue: pipelineValue || 0,
      responseRate,
      conversionRate,
      closedDeals,
      avgDealValue
    })
    setMonthlyData(monthly)
    setTopCountries(topCountriesList.length > 0 ? topCountriesList : [
      { country: 'Nederland', count: 2 },
      { country: 'Duitsland', count: 1 },
      { country: 'België', count: 1 }
    ])
  }

  const loadRecentActivities = () => {
    const activities: Array<{
      type: string
      title: string
      description: string
      time: string
      icon: React.ReactNode
      color: string
    }> = []

    // Check for uploaded profile
    const profile = JSON.parse(localStorage.getItem('currentProfile') || '{}')
    if (profile.companyName) {
      activities.push({
        type: 'upload',
        title: 'Profiel geüpload',
        description: `${profile.companyName} - AI profiel gegenereerd`,
        time: new Date(profile.generatedAt || Date.now()).toLocaleDateString('nl-NL'),
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        ),
        color: 'bg-brand-500/20 text-brand-400'
      })
    }

    // Check for searched distributors
    const distributors = JSON.parse(localStorage.getItem('distributors') || '[]')
    if (distributors.length > 0) {
      activities.push({
        type: 'search',
        title: 'Distributeurs gezocht',
        description: `${distributors.length} distributeurs gevonden`,
        time: 'Vandaag',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        color: 'bg-green-600/20 text-green-400'
      })
    }

    // Check for contacted distributors
    const contactedIds = JSON.parse(localStorage.getItem('contactedDistributors') || '[]')
    if (contactedIds.length > 0) {
      activities.push({
        type: 'contact',
        title: 'Distributeurs gecontacteerd',
        description: `${contactedIds.length} distributeurs gecontacteerd`,
        time: 'Deze week',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
        color: 'bg-blue-600/20 text-blue-400'
      })
    }

    // Check for quotes
    const quotes = JSON.parse(localStorage.getItem('quotes') || '[]')
    if (quotes.length > 0) {
      const recentQuote = quotes[quotes.length - 1]
      activities.push({
        type: 'quote',
        title: 'Offerte aangemaakt',
        description: `${recentQuote.quoteNumber} - ${recentQuote.distributorName}`,
        time: new Date(recentQuote.createdAt).toLocaleDateString('nl-NL'),
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: 'bg-yellow-600/20 text-yellow-400'
      })
    }

    // Check for closed deals
    const relationships: any[] = []
    contactedIds.forEach((id: string) => {
      const savedRel = localStorage.getItem(`relationship_${id}`)
      if (savedRel) {
        const rel = JSON.parse(savedRel)
        if (rel.status === 'closed') {
          relationships.push(rel)
        }
      }
    })
    if (relationships.length > 0) {
      activities.push({
        type: 'deal',
        title: 'Deal gesloten',
        description: `${relationships.length} deal(s) succesvol afgerond`,
        time: 'Deze maand',
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        ),
        color: 'bg-green-600/20 text-green-400'
      })
    }

    // Check for tasks
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
    if (tasks.length > 0) {
      const activeTasks = tasks.filter((t: any) => t.status !== 'completed')
      if (activeTasks.length > 0) {
        activities.push({
          type: 'task',
          title: 'Taken aangemaakt',
          description: `${activeTasks.length} actieve ta(a)k(en)`,
          time: 'Deze week',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          color: 'bg-purple-600/20 text-purple-400'
        })
      }
    }

    // Check for documents
    const documents = JSON.parse(localStorage.getItem('documents') || '[]')
    if (documents.length > 0) {
      const recentDoc = documents[documents.length - 1]
      activities.push({
        type: 'document',
        title: 'Document geüpload',
        description: recentDoc.name,
        time: new Date(recentDoc.uploadDate).toLocaleDateString('nl-NL'),
        icon: (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: 'bg-indigo-600/20 text-indigo-400'
      })
    }

    // Sort by time (most recent first) and limit to 5
    activities.sort((a, b) => {
      const timeA = a.time.includes('Vandaag') ? 0 : a.time.includes('Deze week') ? 1 : 2
      const timeB = b.time.includes('Vandaag') ? 0 : b.time.includes('Deze week') ? 1 : 2
      return timeA - timeB
    })

    // If no activities, add demo activities
    if (activities.length === 0) {
      activities.push(
        {
          type: 'upload',
          title: 'Profiel geüpload',
          description: 'Demo Company Profile - AI profiel gegenereerd',
          time: 'Vandaag',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          ),
          color: 'bg-brand-500/20 text-brand-400'
        },
        {
          type: 'search',
          title: 'Distributeurs gezocht',
          description: '5 distributeurs gevonden in Nederland',
          time: 'Vandaag',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ),
          color: 'bg-green-600/20 text-green-400'
        },
        {
          type: 'contact',
          title: 'Distributeurs gecontacteerd',
          description: '4 distributeurs gecontacteerd',
          time: 'Deze week',
          icon: (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          color: 'bg-blue-600/20 text-blue-400'
        }
      )
    }

    setRecentActivities(activities.slice(0, 5))
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welkom bij het platform
        </h2>
        <p className="text-gray-400">
          Begin met het vinden en beheren van distributeurs voor je health producten
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Upload Profile */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-brand-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/upload')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-brand-500/20 to-brand-500/20 rounded-lg group-hover:from-brand-500/30 group-hover:to-brand-500/30 transition-colors">
              <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Upload Profiel
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Upload een product PPT of company PPT om een AI-profiel te genereren
          </p>
          <button className="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium">
            Upload Bestand
          </button>
        </div>

        {/* Find Distributors */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-green-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/search')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-600/20 to-green-500/20 rounded-lg group-hover:from-green-600/30 group-hover:to-green-500/30 transition-colors">
              <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Zoek Distributeurs
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Laat AI tot 20 geschikte distributeurs vinden voor je markt
          </p>
          <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
            Start Zoeken
          </button>
        </div>

        {/* Manage Relationships */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-brand-500/50 transition-all cursor-pointer group" onClick={() => router.push('/dashboard/relationships')}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-brand-500/20 to-brand-500/20 rounded-lg group-hover:from-brand-500/30 group-hover:to-brand-500/30 transition-colors">
              <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Beheer Relaties
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Bekijk en beheer je distributeur relaties en contacten
          </p>
          <button className="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium">
            Bekijk Relaties
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Totaal Distributeurs</div>
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.totalDistributors}</div>
          <div className="text-xs text-gray-500 mt-1">Gevonden distributeurs</div>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Gecontacteerd</div>
            <div className="p-2 bg-green-600/20 rounded-lg">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.contactedDistributors}</div>
          <div className="text-xs text-gray-500 mt-1">Actieve contacten</div>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Pipeline Waarde</div>
            <div className="p-2 bg-brand-500/20 rounded-lg">
              <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">€{stats.pipelineValue.toLocaleString('nl-NL')}</div>
          <div className="text-xs text-gray-500 mt-1">Totaal waarde</div>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Response Rate</div>
            <div className="p-2 bg-yellow-600/20 rounded-lg">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.responseRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Van gecontacteerde</div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Actieve Deals</div>
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.activeDeals}</div>
          <div className="text-xs text-gray-500 mt-1">In pipeline</div>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Gesloten Deals</div>
            <div className="p-2 bg-green-600/20 rounded-lg">
              <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.closedDeals}</div>
          <div className="text-xs text-gray-500 mt-1">Succesvol afgerond</div>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Conversion Rate</div>
            <div className="p-2 bg-brand-500/20 rounded-lg">
              <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{stats.conversionRate}%</div>
          <div className="text-xs text-gray-500 mt-1">Succes percentage</div>
        </div>
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 cursor-pointer hover:border-brand-500/50 transition-all" onClick={() => router.push('/dashboard/analytics')}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Bekijk Analytics</div>
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-lg font-semibold text-brand-400 flex items-center">
            Open Dashboard
            <svg className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trends Chart */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Maandelijkse Trends</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => {
              const maxValue = Math.max(...monthlyData.map(d => Math.max(d.contacts, d.responses, d.deals)))
              const contactsPercent = (data.contacts / maxValue) * 100
              const responsesPercent = (data.responses / maxValue) * 100
              const dealsPercent = (data.deals / maxValue) * 100
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{data.month}</span>
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <span>{data.contacts} contacten</span>
                      <span>{data.responses} reacties</span>
                      <span>{data.deals} deals</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs text-gray-500">Contacten</div>
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                          style={{ width: `${contactsPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs text-gray-500">Reacties</div>
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                          style={{ width: `${responsesPercent}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 text-xs text-gray-500">Deals</div>
                      <div className="flex-1 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
                          style={{ width: `${dealsPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Countries Chart */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Top Landen</h3>
          <div className="space-y-4">
            {topCountries.map((item, index) => {
              const maxCount = Math.max(...topCountries.map(c => c.count))
              const percentage = (item.count / maxCount) * 100
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">{item.country}</span>
                    <span className="text-sm text-gray-400">{item.count} distributeurs</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-green-500 transition-all duration-500 ease-out relative overflow-hidden"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Recente Activiteit
          </h3>
          <button
            onClick={() => router.push('/dashboard/analytics')}
            className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
          >
            Bekijk alles
          </button>
        </div>
        <div className="space-y-3">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">{activity.title}</div>
                  <div className="text-xs text-gray-400">{activity.description}</div>
                </div>
                <div className="text-xs text-gray-500">{activity.time}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>Nog geen activiteit. Begin met het uploaden van een profiel!</p>
            </div>
          )}
        </div>
      </div>

    </DashboardLayout>
  )
}

