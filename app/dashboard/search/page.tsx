'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

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

const COUNTRIES = [
  'Nederland',
  'België',
  'Duitsland',
  'Frankrijk',
  'Verenigd Koninkrijk',
  'Spanje',
  'Italië',
  'Zwitserland',
  'Oostenrijk',
  'Zweden',
  'Noorwegen',
  'Denemarken'
]

export default function SearchDistributorsPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [profileData, setProfileData] = useState<any>(null)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [distributors, setDistributors] = useState<Distributor[]>([])
  const [searchCompleted, setSearchCompleted] = useState(false)
  const [filterIndustry, setFilterIndustry] = useState('')
  const [sortBy, setSortBy] = useState<'matchScore' | 'name' | 'country'>('matchScore')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
    setUserEmail(email)

    const profile = localStorage.getItem('currentProfile')
    if (profile) {
      setProfileData(JSON.parse(profile))
    } else {
      router.push('/dashboard/upload')
    }
  }, [router])

  const generateMockDistributors = (country: string): Distributor[] => {
    const distributorNames = [
      'MedTech Distribution BV',
      'Health Solutions Europe',
      'Medical Equipment Partners',
      'Healthcare Distribution Group',
      'MedSupply International',
      'Global Health Distributors',
      'European Medical Supplies',
      'HealthCare Connect',
      'MedDevice Distribution',
      'Professional Health Partners',
      'Advanced Medical Distribution',
      'Health Industry Solutions',
      'MedEquip Distribution',
      'Healthcare Market Leaders',
      'Medical Supply Chain Experts',
      'Health Distribution Network',
      'MedTech Market Partners',
      'Healthcare Distribution Pro',
      'Medical Equipment Experts',
      'Health Supply Solutions'
    ]

    const cities: { [key: string]: string[] } = {
      'Nederland': ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven'],
      'België': ['Brussel', 'Antwerpen', 'Gent', 'Brugge', 'Leuven'],
      'Duitsland': ['Berlijn', 'München', 'Hamburg', 'Frankfurt', 'Keulen'],
      'Frankrijk': ['Parijs', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
      'Verenigd Koninkrijk': ['Londen', 'Manchester', 'Birmingham', 'Edinburgh', 'Bristol']
    }

    const specialties = [
      'Medische apparatuur',
      'Diagnostische instrumenten',
      'Therapeutische apparaten',
      'Consumables',
      'Software oplossingen',
      'Laboratorium apparatuur',
      'Chirurgische instrumenten'
    ]

    const certifications = ['ISO 13485', 'CE', 'FDA', 'MDR', 'GDP']

    return distributorNames.slice(0, 20).map((name, index) => ({
      id: `dist-${index + 1}`,
      name,
      country,
      city: cities[country]?.[Math.floor(Math.random() * (cities[country]?.length || 1))] || 'Onbekend',
      industry: profileData?.industry || 'Medische Apparatuur',
      matchScore: Math.floor(85 + Math.random() * 15), // 85-100%
      contactPerson: `Contact Persoon ${index + 1}`,
      email: `contact@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+31 ${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)} ${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`,
      website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
      description: `Ervaren distributeur gespecialiseerd in ${profileData?.industry || 'medische apparatuur'} met een sterke marktpositie in ${country}.`,
      specialties: specialties.slice(0, Math.floor(Math.random() * 3) + 2),
      yearsExperience: Math.floor(Math.random() * 20) + 5,
      annualRevenue: ['€1-5M', '€5-10M', '€10-25M', '€25-50M', '€50M+'][Math.floor(Math.random() * 5)],
      certifications: certifications.slice(0, Math.floor(Math.random() * 3) + 2)
    })).sort((a, b) => b.matchScore - a.matchScore)
  }

  const handleSearch = async () => {
    if (!selectedCountry) {
      alert('Selecteer eerst een land')
      return
    }

    setIsSearching(true)
    setSearchCompleted(false)
    setDistributors([])

    // Simulate AI search
    await new Promise(resolve => setTimeout(resolve, 3000))

    const results = generateMockDistributors(selectedCountry)
    setDistributors(results)
    setIsSearching(false)
    setSearchCompleted(true)

    // Store results
    localStorage.setItem('distributors', JSON.stringify(results))
  }

  const filteredDistributors = distributors
    .filter(dist => !filterIndustry || dist.industry === filterIndustry)
    .sort((a, b) => {
      if (sortBy === 'matchScore') return b.matchScore - a.matchScore
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'country') return a.country.localeCompare(b.country)
      return 0
    })

  const handleViewDistributor = (id: string) => {
    router.push(`/dashboard/distributors/${id}`)
  }

  return (
    <DashboardLayout>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Zoek Distributeurs
          </h2>
          <p className="text-gray-400">
            Laat AI geschikte distributeurs vinden op basis van je profiel
          </p>
        </div>

        {/* Search Form */}
        {!searchCompleted && (
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800 mb-6">
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Selecteer Doelmarkt
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Land
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-800 text-white"
                  disabled={isSearching}
                >
                  <option value="">Selecteer een land...</option>
                  {COUNTRIES.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* Advanced Filters */}
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-300">Geavanceerde Filters</span>
                  <button className="text-xs text-brand-400 hover:text-brand-300">Reset</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Min. Ervaring (jaren)</label>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Min. Match Score</label>
                    <input
                      type="number"
                      placeholder="50"
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1">Certificeringen</label>
                  <div className="flex flex-wrap gap-2">
                    {['CE', 'ISO 13485', 'FDA', 'GMP'].map(cert => (
                      <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-700 text-brand-500 focus:ring-brand-500" />
                        <span className="text-xs text-gray-300">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {profileData && (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                  <p className="text-sm font-medium text-gray-300 mb-2">
                    Zoeken voor:
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {profileData.companyName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {profileData.industry}
                  </p>
                </div>
              )}

              <button
                onClick={handleSearch}
                disabled={!selectedCountry || isSearching}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {isSearching ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI zoekt distributeurs...
                  </span>
                ) : (
                  'Start Zoeken'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {searchCompleted && (
          <>
            {/* Filters and Sort */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    {filteredDistributors.length} distributeurs gevonden
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-gray-800 text-white text-sm"
                  >
                    <option value="matchScore">Sorteer op Match Score</option>
                    <option value="name">Sorteer op Naam</option>
                    <option value="country">Sorteer op Land</option>
                  </select>
                  <button
                    onClick={() => {
                      setSearchCompleted(false)
                      setDistributors([])
                      setSelectedCountry('')
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    Nieuwe Zoekopdracht
                  </button>
                </div>
              </div>
            </div>

            {/* Distributors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDistributors.map((distributor) => (
                <div
                  key={distributor.id}
                  className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 hover:border-brand-500/50 transition-all cursor-pointer group"
                  onClick={() => handleViewDistributor(distributor.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {distributor.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {distributor.city}, {distributor.country}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-lg">
                        <span className="text-sm font-bold text-green-400">
                          {distributor.matchScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {distributor.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-400">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {distributor.yearsExperience} jaar ervaring
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {distributor.annualRevenue}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {distributor.specialties.slice(0, 2).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-brand-500/20 text-brand-300 rounded text-xs border border-brand-500/30"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <button className="w-full px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium">
                    Bekijk Details
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
    </DashboardLayout>
  )
}


