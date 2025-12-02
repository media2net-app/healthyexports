'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import DashboardLayout from '../../components/DashboardLayout'

interface ProfileData {
  companyName: string
  productName: string
  industry: string
  targetMarkets: string[]
  keyFeatures: string[]
  certifications: string[]
  description: string
  generatedAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)

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

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 text-emerald-600"></div>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            AI-Gegenereerd Profiel
          </h2>
          <p className="text-gray-400">
            Volledig overzicht van je bedrijfsprofiel gegenereerd door AI
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800 mb-6">
          {/* Company Info */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {profileData.companyName}
                </h3>
                <p className="text-lg text-gray-400">
                  {profileData.productName}
                </p>
              </div>
              <div className="p-4 bg-brand-500/20 rounded-lg">
                <Image
                  src="/healthyexports.png"
                  alt="Healthy Exports Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {profileData.description}
            </p>
          </div>

          {/* Industry */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
              Industrie
            </h4>
            <span className="inline-block px-4 py-2 bg-green-600/20 text-green-400 rounded-lg font-medium border border-green-500/30">
              {profileData.industry}
            </span>
          </div>

          {/* Target Markets */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">
              Doelmarkten
            </h4>
            <div className="flex flex-wrap gap-2">
              {profileData.targetMarkets.map((market, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-brand-500/20 text-brand-300 rounded-lg text-sm font-medium border border-brand-500/30"
                >
                  {market}
                </span>
              ))}
            </div>
          </div>

          {/* Key Features */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">
              Belangrijkste Kenmerken
            </h4>
            <ul className="space-y-2">
              {profileData.keyFeatures.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <svg className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">
              Certificeringen
            </h4>
            <div className="flex flex-wrap gap-2">
              {profileData.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-brand-500/20 text-brand-300 rounded-lg text-sm font-medium border border-brand-500/30"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
          >
            Terug naar Dashboard
          </button>
          <button
            onClick={() => router.push('/dashboard/search')}
            className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
          >
            Zoek Distributeurs voor dit Profiel
          </button>
        </div>

        {/* Generated Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Profiel gegenereerd op {new Date(profileData.generatedAt).toLocaleString('nl-NL')}
        </div>
      </div>
    </DashboardLayout>
  )
}


