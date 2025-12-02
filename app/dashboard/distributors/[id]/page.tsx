'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../../components/DashboardLayout'

interface Distributor {
  id: string
  name: string
  country: string
  city: string
  industry: string
  matchScore: number
  contactPerson: string
  email: string
  phone: string
  website: string
  description: string
  specialties: string[]
  yearsExperience: number
  annualRevenue: string
  certifications: string[]
}

export default function DistributorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [userEmail, setUserEmail] = useState('')
  const [distributor, setDistributor] = useState<Distributor | null>(null)
  const [isContacting, setIsContacting] = useState(false)
  const [contactSuccess, setContactSuccess] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
    setUserEmail(email)

    const distributors = localStorage.getItem('distributors')
    if (distributors) {
      const distList: Distributor[] = JSON.parse(distributors)
      const found = distList.find(d => d.id === params.id)
      if (found) {
        setDistributor(found)
      } else {
        router.push('/dashboard/search')
      }
    } else {
      router.push('/dashboard/search')
    }
  }, [params.id, router])


  const handleContact = async () => {
    setIsContacting(true)
    
    // Simulate contact/approach
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsContacting(false)
    setContactSuccess(true)

    // Store contacted distributors
    const contacted = JSON.parse(localStorage.getItem('contactedDistributors') || '[]')
    if (!contacted.includes(distributor?.id)) {
      contacted.push(distributor?.id)
      localStorage.setItem('contactedDistributors', JSON.stringify(contacted))
    }
  }

  if (!distributor) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 text-brand-400"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <h2 className="text-3xl font-bold text-white">
                  {distributor.name}
                </h2>
                <div className="px-4 py-1 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <span className="text-lg font-bold text-green-400">
                    {distributor.matchScore}% Match
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-gray-400">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {distributor.city}, {distributor.country}
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {distributor.yearsExperience} jaar ervaring
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            {distributor.description}
          </p>

          {/* Contact Success Message */}
          {contactSuccess && (
            <div className="mb-6 bg-green-600/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
              ✅ Contactverzoek succesvol verzonden! Je ontvangt binnenkort een reactie.
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleContact}
              disabled={isContacting || contactSuccess}
              className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isContacting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verzenden...
                </span>
              ) : contactSuccess ? (
                'Contact Verzonden'
              ) : (
                'Neem Contact Op'
              )}
            </button>
            <a
              href={distributor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
            >
              Bezoek Website
            </a>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Contact Information */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              Contact Informatie
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-400">Contactpersoon:</span>
                <p className="text-white">{distributor.contactPerson}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">E-mail:</span>
                <p className="text-white">{distributor.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Telefoon:</span>
                <p className="text-white">{distributor.phone}</p>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">
              Bedrijfsinformatie
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-400">Industrie:</span>
                <p className="text-white">{distributor.industry}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Jaaromzet:</span>
                <p className="text-white">{distributor.annualRevenue}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-400">Ervaring:</span>
                <p className="text-white">{distributor.yearsExperience} jaar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Specialisaties
          </h3>
          <div className="flex flex-wrap gap-2">
            {distributor.specialties.map((specialty, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 rounded-lg text-sm font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-4">
            Certificeringen
          </h3>
          <div className="flex flex-wrap gap-2">
            {distributor.certifications.map((cert, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-brand-500/20 border border-brand-500/30 text-brand-300 rounded-lg text-sm font-medium"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

