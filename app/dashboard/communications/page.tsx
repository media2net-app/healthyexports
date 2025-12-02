'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Communication {
  id: string
  distributorId: string
  distributorName: string
  type: 'email' | 'call' | 'meeting'
  subject: string
  message: string
  date: string
  direction: 'inbound' | 'outbound'
  status: 'sent' | 'delivered' | 'read' | 'replied'
}

export default function CommunicationsPage() {
  const router = useRouter()
  const [communications, setCommunications] = useState<Communication[]>([])
  const [selectedDistributor, setSelectedDistributor] = useState<string>('all')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadCommunications()
  }, [router])

  const loadCommunications = () => {
    // Load from localStorage or use demo data
    const saved = JSON.parse(localStorage.getItem('communications') || '[]')
    
    if (saved.length === 0) {
      // Demo communications data
      const mock: Communication[] = [
        {
          id: 'demo-1',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          type: 'email',
          subject: 'Samenwerking mogelijkheden - Health Distributors BV',
          message: 'Beste, wij zijn geïnteresseerd in uw productlijn en zouden graag de mogelijkheden voor distributie in Nederland bespreken. Kunnen we een meeting plannen?',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          direction: 'outbound',
          status: 'read'
        },
        {
          id: 'demo-2',
          distributorId: 'demo-2',
          distributorName: 'MedSupply Germany',
          type: 'email',
          subject: 'Re: Offerte verzoek Medical Devices',
          message: 'Dank voor uw offerte. We hebben enkele vragen over de pricing en leveringsvoorwaarden. Kunnen we hierover bellen?',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          direction: 'inbound',
          status: 'replied'
        },
        {
          id: 'demo-3',
          distributorId: 'demo-3',
          distributorName: 'Belgian Health Solutions',
          type: 'call',
          subject: 'Telefoongesprek - Contract bespreking',
          message: 'Gesprek gevoerd over distributieovereenkomst. Positieve reactie, wachten op contractvoorstel.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          direction: 'outbound',
          status: 'sent'
        },
        {
          id: 'demo-4',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          type: 'meeting',
          subject: 'Meeting gepland - 15 januari 2024',
          message: 'Meeting gepland om 14:00 uur om distributieovereenkomst te bespreken. Locatie: Online via Teams.',
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          direction: 'outbound',
          status: 'delivered'
        },
        {
          id: 'demo-5',
          distributorId: 'demo-2',
          distributorName: 'MedSupply Germany',
          type: 'email',
          subject: 'Follow-up offerte',
          message: 'Vervolg op onze eerdere correspondentie. Heeft u de mogelijkheid gehad om onze offerte te bekijken?',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          direction: 'outbound',
          status: 'read'
        }
      ]
      localStorage.setItem('communications', JSON.stringify(mock))
      setCommunications(mock)
    } else {
      setCommunications(saved)
    }
  }

  const filtered = selectedDistributor === 'all' 
    ? communications 
    : communications.filter(c => c.distributorId === selectedDistributor)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Communicatie Hub
          </h2>
          <p className="text-gray-400">
            Gecentraliseerde inbox voor alle contacten
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl shadow-lg p-4 border border-gray-800">
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter</label>
              <select
                value={selectedDistributor}
                onChange={(e) => setSelectedDistributor(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              >
                <option value="all">Alle Distributeurs</option>
              </select>
            </div>
          </div>

          {/* Communications List */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
              <div className="p-4 border-b border-gray-800">
                <h3 className="font-semibold text-white">Communicatie ({filtered.length})</h3>
              </div>
              {filtered.length > 0 ? (
                <div className="divide-y divide-gray-800">
                  {filtered.map((comm) => (
                    <div
                      key={comm.id}
                      className="p-4 hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/distributors/${comm.distributorId}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            comm.type === 'email' ? 'bg-blue-600/20' :
                            comm.type === 'call' ? 'bg-green-600/20' : 'bg-brand-500/20'
                          }`}>
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {comm.type === 'email' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              ) : comm.type === 'call' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              )}
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-white">{comm.distributorName}</div>
                            <div className="text-sm text-gray-400">{comm.subject}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(comm.date).toLocaleDateString('nl-NL')}
                          </div>
                          <div className={`text-xs mt-1 ${
                            comm.status === 'read' ? 'text-blue-400' :
                            comm.status === 'replied' ? 'text-green-400' : 'text-gray-500'
                          }`}>
                            {comm.status}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{comm.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400">Nog geen communicatie</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}







