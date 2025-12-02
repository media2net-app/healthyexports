'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Relationship {
  id: string
  distributorId: string
  distributorName: string
  country: string
  city: string
  status: 'contacted' | 'in_conversation' | 'interested' | 'meeting_scheduled' | 'negotiating' | 'closed'
  contactDate: string
  lastContact: string
  notes: string
  matchScore: number
  email: string
  phone: string
}

const STATUS_LABELS: { [key: string]: { label: string; color: string; bgColor: string } } = {
  contacted: { label: 'Contact Opgenomen', color: 'text-brand-300', bgColor: 'bg-brand-500/20 border border-brand-500/30' },
  in_conversation: { label: 'In Gesprek', color: 'text-yellow-400', bgColor: 'bg-yellow-600/20 border border-yellow-500/30' },
  interested: { label: 'Geïnteresseerd', color: 'text-brand-600 dark:text-brand-300', bgColor: 'bg-brand-100 dark:bg-brand-900/30' },
  meeting_scheduled: { label: 'Afspraak Gepland', color: 'text-indigo-700 dark:text-indigo-300', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30' },
  negotiating: { label: 'In Onderhandeling', color: 'text-orange-700 dark:text-orange-300', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  closed: { label: 'Afgesloten', color: 'text-green-400', bgColor: 'bg-green-600/20 border border-green-500/30' }
}

export default function RelationshipsPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status' | 'matchScore'>('date')
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null)
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
    setUserEmail(email)

    loadRelationships()
  }, [router])

  const loadRelationships = () => {
    const contactedIds = JSON.parse(localStorage.getItem('contactedDistributors') || '[]')
    const distributors = JSON.parse(localStorage.getItem('distributors') || '[]')

    if (contactedIds.length === 0 || distributors.length === 0) {
      return
    }

    const contactedDistributors = distributors.filter((d: any) => contactedIds.includes(d.id))
    
    const rels: Relationship[] = contactedDistributors.map((dist: any, index: number) => {
      const statuses: Relationship['status'][] = ['contacted', 'in_conversation', 'interested', 'meeting_scheduled', 'negotiating', 'closed']
      const savedRel = localStorage.getItem(`relationship_${dist.id}`)
      const saved = savedRel ? JSON.parse(savedRel) : null

      return {
        id: `rel-${dist.id}`,
        distributorId: dist.id,
        distributorName: dist.name,
        country: dist.country,
        city: dist.city,
        status: saved?.status || (index < 2 ? 'in_conversation' : index < 4 ? 'interested' : 'contacted'),
        contactDate: saved?.contactDate || new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastContact: saved?.lastContact || new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: saved?.notes || '',
        matchScore: dist.matchScore,
        email: dist.email,
        phone: dist.phone
      }
    })

    setRelationships(rels)
  }


  const handleStatusChange = (relId: string, newStatus: Relationship['status']) => {
    const updated = relationships.map(rel => {
      if (rel.id === relId) {
        const updatedRel = { ...rel, status: newStatus, lastContact: new Date().toISOString() }
        localStorage.setItem(`relationship_${rel.distributorId}`, JSON.stringify(updatedRel))
        return updatedRel
      }
      return rel
    })
    setRelationships(updated)
  }

  const handleViewDistributor = (distributorId: string) => {
    router.push(`/dashboard/distributors/${distributorId}`)
  }

  const handleEditNotes = (rel: Relationship) => {
    setSelectedRelationship(rel)
    setNotes(rel.notes)
    setShowNotesModal(true)
  }

  const handleSaveNotes = () => {
    if (!selectedRelationship) return

    const updated = relationships.map(rel => {
      if (rel.id === selectedRelationship.id) {
        const updatedRel = { ...rel, notes, lastContact: new Date().toISOString() }
        localStorage.setItem(`relationship_${rel.distributorId}`, JSON.stringify(updatedRel))
        return updatedRel
      }
      return rel
    })
    setRelationships(updated)
    setShowNotesModal(false)
    setSelectedRelationship(null)
    setNotes('')
  }

  const filteredRelationships = relationships
    .filter(rel => filterStatus === 'all' || rel.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
      if (sortBy === 'name') return a.distributorName.localeCompare(b.distributorName)
      if (sortBy === 'status') return a.status.localeCompare(b.status)
      if (sortBy === 'matchScore') return b.matchScore - a.matchScore
      return 0
    })

  const stats = {
    total: relationships.length,
    contacted: relationships.filter(r => r.status === 'contacted').length,
    inConversation: relationships.filter(r => r.status === 'in_conversation').length,
    interested: relationships.filter(r => r.status === 'interested').length,
    meetingScheduled: relationships.filter(r => r.status === 'meeting_scheduled').length,
    negotiating: relationships.filter(r => r.status === 'negotiating').length,
    closed: relationships.filter(r => r.status === 'closed').length
  }

  return (
    <DashboardLayout>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Beheer Relaties
          </h2>
          <p className="text-gray-400">
            Overzicht en beheer van al je distributeur contacten
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
          <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Totaal</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Contact</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.contacted}</div>
          </div>
          <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Gesprek</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inConversation}</div>
          </div>
          <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Interesse</div>
            <div className="text-2xl font-bold text-brand-500 dark:text-brand-400">{stats.interested}</div>
          </div>
          <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Afspraak</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.meetingScheduled}</div>
          </div>
          <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Onderhandeling</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.negotiating}</div>
          </div>
          <div className="bg-gray-900 rounded-lg shadow p-4 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Afgesloten</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.closed}</div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-300">Filter:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-white text-sm"
              >
                <option value="all">Alle Status</option>
                {Object.entries(STATUS_LABELS).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-300">Sorteer op:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-800 text-white text-sm"
              >
                <option value="date">Laatste Contact</option>
                <option value="name">Naam</option>
                <option value="status">Status</option>
                <option value="matchScore">Match Score</option>
              </select>
            </div>
          </div>
        </div>

        {/* Relationships List */}
        {filteredRelationships.length === 0 ? (
          <div className="bg-gray-900 rounded-xl shadow-lg p-12 border border-gray-800 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-white mb-2">
              Geen relaties gevonden
            </h3>
            <p className="text-gray-400 mb-4">
              {relationships.length === 0 
                ? 'Begin met het zoeken en contacteren van distributeurs om relaties op te bouwen.'
                : 'Geen relaties met deze status gevonden.'}
            </p>
            {relationships.length === 0 && (
              <button
                onClick={() => router.push('/dashboard/search')}
                className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
              >
                Zoek Distributeurs
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRelationships.map((rel) => {
              const statusInfo = STATUS_LABELS[rel.status]
              return (
                <div
                  key={rel.id}
                  className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">
                            {rel.distributorName}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {rel.city}, {rel.country}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <span className="px-3 py-1 bg-green-600/20 border border-green-500/30 text-green-400 rounded-lg text-sm font-bold">
                            {rel.matchScore}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="text-gray-400">Contact:</span>
                          <p className="text-white font-medium">
                            {new Date(rel.contactDate).toLocaleDateString('nl-NL')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">Laatste Contact:</span>
                          <p className="text-white font-medium">
                            {new Date(rel.lastContact).toLocaleDateString('nl-NL')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-400">E-mail:</span>
                          <p className="text-white font-medium truncate">{rel.email}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Telefoon:</span>
                          <p className="text-white font-medium">{rel.phone}</p>
                        </div>
                      </div>

                      {rel.notes && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-300 line-clamp-2">{rel.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 md:w-48">
                      <select
                        value={rel.status}
                        onChange={(e) => handleStatusChange(rel.id, e.target.value as Relationship['status'])}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-white text-sm"
                      >
                        {Object.entries(STATUS_LABELS).map(([key, value]) => (
                          <option key={key} value={key}>{value.label}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleEditNotes(rel)}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                      >
                        {rel.notes ? 'Bewerk Notities' : 'Voeg Notities Toe'}
                      </button>
                      <button
                        onClick={() => handleViewDistributor(rel.distributorId)}
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium"
                      >
                        Bekijk Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && selectedRelationship && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 max-w-2xl w-full border border-gray-800">
              <h3 className="text-xl font-semibold text-white mb-4">
                Notities voor {selectedRelationship.distributorName}
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-white mb-4"
                placeholder="Voeg notities toe over deze relatie..."
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
                >
                  Opslaan
                </button>
                <button
                  onClick={() => {
                    setShowNotesModal(false)
                    setSelectedRelationship(null)
                    setNotes('')
                  }}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        )}
    </DashboardLayout>
  )
}


