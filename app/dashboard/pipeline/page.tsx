'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Deal {
  id: string
  distributorId: string
  distributorName: string
  value: number
  stage: 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  expectedCloseDate: string
}

export default function PipelinePage() {
  const router = useRouter()
  const [deals, setDeals] = useState<Deal[]>([])
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadDeals()
  }, [router])

  const loadDeals = () => {
    // Load from relationships and convert to deals
    let contactedIds = JSON.parse(localStorage.getItem('contactedDistributors') || '[]')
    let distributors = JSON.parse(localStorage.getItem('distributors') || '[]')
    
    // Add demo data if no data exists
    if (contactedIds.length === 0 || distributors.length === 0) {
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
        localStorage.setItem('contactedDistributors', JSON.stringify(['demo-1', 'demo-2', 'demo-3', 'demo-4', 'demo-5']))
        contactedIds = ['demo-1', 'demo-2', 'demo-3', 'demo-4', 'demo-5']
      }
      
      // Create demo relationships
      if (!localStorage.getItem('relationship_demo-1')) {
        localStorage.setItem('relationship_demo-1', JSON.stringify({ distributorId: 'demo-1', status: 'in_conversation', notes: 'Demo' }))
      }
      if (!localStorage.getItem('relationship_demo-2')) {
        localStorage.setItem('relationship_demo-2', JSON.stringify({ distributorId: 'demo-2', status: 'interested', notes: 'Demo' }))
      }
      if (!localStorage.getItem('relationship_demo-3')) {
        localStorage.setItem('relationship_demo-3', JSON.stringify({ distributorId: 'demo-3', status: 'negotiating', notes: 'Demo' }))
      }
      if (!localStorage.getItem('relationship_demo-4')) {
        localStorage.setItem('relationship_demo-4', JSON.stringify({ distributorId: 'demo-4', status: 'meeting_scheduled', notes: 'Demo' }))
      }
      if (!localStorage.getItem('relationship_demo-5')) {
        localStorage.setItem('relationship_demo-5', JSON.stringify({ distributorId: 'demo-5', status: 'in_conversation', notes: 'Demo' }))
      }
    }
    
    // Reload after setting demo data
    contactedIds = JSON.parse(localStorage.getItem('contactedDistributors') || '[]')
    distributors = JSON.parse(localStorage.getItem('distributors') || '[]')
    
    const dealsList: Deal[] = contactedIds.map((id: string, index: number) => {
      const dist = distributors.find((d: any) => d.id === id)
      if (!dist) return null

      const savedRel = localStorage.getItem(`relationship_${id}`)
      const rel = savedRel ? JSON.parse(savedRel) : null

      let stage: Deal['stage'] = 'contacted'
      let probability = 10

      if (rel) {
        switch (rel.status) {
          case 'in_conversation':
            stage = 'qualified'
            probability = 30
            break
          case 'interested':
            stage = 'proposal'
            probability = 50
            break
          case 'meeting_scheduled':
            stage = 'proposal'
            probability = 60
            break
          case 'negotiating':
            stage = 'negotiation'
            probability = 80
            break
          case 'closed':
            stage = 'closed_won'
            probability = 100
            break
        }
      }

      return {
        id: `deal-${id}`,
        distributorId: id,
        distributorName: dist.name,
        value: Math.floor(Math.random() * 50000) + 10000,
        stage,
        probability,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    }).filter(Boolean) as Deal[]

    // If still no deals, create demo deals directly
    if (dealsList.length === 0) {
      const demoDeals: Deal[] = [
        {
          id: 'deal-demo-1',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          value: 45000,
          stage: 'qualified',
          probability: 30,
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'deal-demo-2',
          distributorId: 'demo-2',
          distributorName: 'MedSupply Germany',
          value: 125000,
          stage: 'proposal',
          probability: 50,
          expectedCloseDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'deal-demo-3',
          distributorId: 'demo-3',
          distributorName: 'Belgian Health Solutions',
          value: 28000,
          stage: 'negotiation',
          probability: 80,
          expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'deal-demo-4',
          distributorId: 'demo-4',
          distributorName: 'French Medical Distributors',
          value: 95000,
          stage: 'proposal',
          probability: 60,
          expectedCloseDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'deal-demo-5',
          distributorId: 'demo-5',
          distributorName: 'UK Health Partners',
          value: 68000,
          stage: 'qualified',
          probability: 30,
          expectedCloseDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
      setDeals(demoDeals)
      return
    }

    setDeals(dealsList)
  }

  const handleMoveDeal = (dealId: string, newStage: Deal['stage']) => {
    const updated = deals.map(d => {
      if (d.id === dealId) {
        // Update probability based on stage
        let probability = d.probability
        if (newStage === 'contacted') probability = 10
        else if (newStage === 'qualified') probability = 30
        else if (newStage === 'proposal') probability = 50
        else if (newStage === 'negotiation') probability = 80
        else if (newStage === 'closed_won') probability = 100
        else if (newStage === 'closed_lost') probability = 0
        
        return { ...d, stage: newStage, probability }
      }
      return d
    })
    setDeals(updated)
    
    // Update relationship status
    const deal = deals.find(d => d.id === dealId)
    if (deal) {
      const savedRel = localStorage.getItem(`relationship_${deal.distributorId}`)
      if (savedRel) {
        const rel = JSON.parse(savedRel)
        let newStatus = rel.status
        if (newStage === 'qualified') newStatus = 'in_conversation'
        if (newStage === 'proposal') newStatus = 'interested'
        if (newStage === 'negotiation') newStatus = 'negotiating'
        if (newStage === 'closed_won') newStatus = 'closed'
        localStorage.setItem(`relationship_${deal.distributorId}`, JSON.stringify({ ...rel, status: newStatus }))
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    setDragOverStage(null)
    
    if (draggedDeal && draggedDeal.stage !== stageId) {
      handleMoveDeal(draggedDeal.id, stageId as Deal['stage'])
    }
    
    setDraggedDeal(null)
  }

  const stages = [
    { id: 'contacted', name: 'Gecontacteerd', color: 'bg-gray-600' },
    { id: 'qualified', name: 'Gekwalificeerd', color: 'bg-blue-600' },
    { id: 'proposal', name: 'Offerte', color: 'bg-yellow-600' },
    { id: 'negotiation', name: 'Onderhandeling', color: 'bg-brand-500' },
    { id: 'closed_won', name: 'Gesloten', color: 'bg-green-600' },
    { id: 'closed_lost', name: 'Verloren', color: 'bg-red-600' }
  ]

  const totalValue = deals.filter(d => d.stage !== 'closed_lost').reduce((sum, d) => sum + d.value, 0)
  const weightedValue = deals.filter(d => d.stage !== 'closed_lost').reduce((sum, d) => sum + (d.value * d.probability / 100), 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Deal Pipeline
          </h2>
          <p className="text-gray-400">
            Visual pipeline overzicht van alle deals
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Totaal Pipeline Waarde</div>
            <div className="text-2xl font-bold text-white">€{totalValue.toLocaleString('nl-NL')}</div>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Gewogen Waarde</div>
            <div className="text-2xl font-bold text-brand-400">€{Math.round(weightedValue).toLocaleString('nl-NL')}</div>
          </div>
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <div className="text-sm text-gray-400 mb-1">Actieve Deals</div>
            <div className="text-2xl font-bold text-white">{deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length}</div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-4">
            {stages.map((stage) => {
              const stageDeals = deals.filter(d => d.stage === stage.id)
              return (
                <div key={stage.id} className="flex-shrink-0 w-80">
                  <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
                    <div className={`p-4 rounded-t-xl ${stage.color}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{stage.name}</h3>
                        <span className="bg-white/20 text-white px-2 py-1 rounded text-xs font-medium">
                          {stageDeals.length}
                        </span>
                      </div>
                    </div>
                    <div 
                      className={`p-4 space-y-3 max-h-[600px] overflow-y-auto min-h-[200px] transition-colors ${
                        dragOverStage === stage.id ? 'bg-brand-500/10' : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, stage.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, stage.id)}
                    >
                      {stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal)}
                          className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-move active:opacity-50"
                          onClick={() => router.push(`/dashboard/distributors/${deal.distributorId}`)}
                        >
                          <div className="font-medium text-white mb-2">{deal.distributorName}</div>
                          <div className="text-sm text-gray-400 mb-2">€{deal.value.toLocaleString('nl-NL')}</div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-xs text-gray-500">{deal.probability}% kans</div>
                            <div className="w-16 bg-gray-800 rounded-full h-2 overflow-hidden shadow-inner">
                              <div
                                className={`h-2 rounded-full bg-gradient-to-r ${stage.color} transition-all duration-500 ease-out relative overflow-hidden`}
                                style={{ width: `${deal.probability}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            {stages.filter(s => s.id !== deal.stage && s.id !== 'closed_lost').map((nextStage) => (
                              <button
                                key={nextStage.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleMoveDeal(deal.id, nextStage.id as Deal['stage'])
                                }}
                                className="flex-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs transition-colors"
                              >
                                →
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {stageDeals.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          Geen deals
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


