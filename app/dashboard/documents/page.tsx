'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Document {
  id: string
  name: string
  type: 'contract' | 'quote' | 'certificate' | 'other'
  distributorId?: string
  distributorName?: string
  uploadDate: string
  size: number
  url?: string
}

export default function DocumentsPage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<Document[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [selectedDistributor, setSelectedDistributor] = useState<string>('all')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadDocuments()
  }, [router])

  const loadDocuments = () => {
    const savedDocs = JSON.parse(localStorage.getItem('documents') || '[]')
    
    // Add demo documents if no documents exist
    if (savedDocs.length === 0) {
      const demoDocs: Document[] = [
        {
          id: 'demo-1',
          name: 'Distributie Overeenkomst - Health Distributors BV.pdf',
          type: 'contract',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          size: 245678
        },
        {
          id: 'demo-2',
          name: 'Offerte QT-202401.pdf',
          type: 'quote',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          size: 156789
        },
        {
          id: 'demo-3',
          name: 'CE Certificering - MedSupply Germany.pdf',
          type: 'certificate',
          distributorId: 'demo-2',
          distributorName: 'MedSupply Germany',
          uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          size: 312456
        },
        {
          id: 'demo-4',
          name: 'NDA - Belgian Health Solutions.pdf',
          type: 'contract',
          distributorId: 'demo-3',
          distributorName: 'Belgian Health Solutions',
          uploadDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          size: 98765
        }
      ]
      localStorage.setItem('documents', JSON.stringify(demoDocs))
      setDocuments(demoDocs)
    } else {
      setDocuments(savedDocs)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newDoc: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: 'other',
      uploadDate: new Date().toISOString(),
      size: file.size
    }

    const updated = [...documents, newDoc]
    setDocuments(updated)
    localStorage.setItem('documents', JSON.stringify(updated))
    
    // In real app, upload to cloud storage
    alert('Document geüpload (demo mode)')
  }

  const handleDelete = (id: string) => {
    const updated = documents.filter(d => d.id !== id)
    setDocuments(updated)
    localStorage.setItem('documents', JSON.stringify(updated))
  }

  const filteredDocs = documents.filter(doc => {
    if (filterType !== 'all' && doc.type !== filterType) return false
    if (selectedDistributor !== 'all' && doc.distributorId !== selectedDistributor) return false
    return true
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Document Management
            </h2>
            <p className="text-gray-400">
              Beheer contracten, offertes en certificeringen
            </p>
          </div>
          <label className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium cursor-pointer flex items-center space-x-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>Upload Document</span>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx"
            />
          </label>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-800 text-white text-sm"
              >
                <option value="all">Alle Types</option>
                <option value="contract">Contracten</option>
                <option value="quote">Offertes</option>
                <option value="certificate">Certificeringen</option>
                <option value="other">Overig</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Distributeur</label>
              <select
                value={selectedDistributor}
                onChange={(e) => setSelectedDistributor(e.target.value)}
                className="px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-800 text-white text-sm"
              >
                <option value="all">Alle Distributeurs</option>
                {/* In real app, load from relationships */}
              </select>
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Documenten ({filteredDocs.length})</h3>
          </div>
          {filteredDocs.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-3 bg-brand-500/20 rounded-lg">
                        <svg className="h-6 w-6 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white">{doc.name}</div>
                        <div className="text-sm text-gray-400 mt-1">
                          {formatFileSize(doc.size)} • {new Date(doc.uploadDate).toLocaleDateString('nl-NL')}
                          {doc.distributorName && ` • ${doc.distributorName}`}
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-300">
                        {doc.type}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
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
              <p className="text-gray-400">Nog geen documenten geüpload</p>
            </div>
          )}
        </div>

        {/* Template Library */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Template Library</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="font-medium text-white mb-2">Distributie Overeenkomst</div>
              <div className="text-sm text-gray-400">Standaard template voor distributiecontracten</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="font-medium text-white mb-2">NDA Template</div>
              <div className="text-sm text-gray-400">Non-disclosure agreement template</div>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="font-medium text-white mb-2">Offerte Template</div>
              <div className="text-sm text-gray-400">Standaard offerte format</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}







