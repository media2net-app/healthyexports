'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
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

export default function UploadProfilePage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [showProgressModal, setShowProgressModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
    setUserEmail(email)
  }, [router])

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-powerpoint.presentation.macroEnabled.12'
    ]
    const validExtensions = ['.ppt', '.pptx']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    return validTypes.includes(file.type) || validExtensions.includes(fileExtension)
  }

  const handleFileSelect = (selectedFile: File) => {
    setError('')
    
    if (!validateFile(selectedFile)) {
      setError('Alleen PPT en PPTX bestanden zijn toegestaan.')
      return
    }

    if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
      setError('Bestand is te groot. Maximum grootte is 50MB.')
      return
    }

    setFile(selectedFile)
  }

  const handleDemoFileSelect = async (demoType: 'company' | 'product') => {
    setError('')
    setIsUploading(true)
    setUploadProgress(0)
    setShowProgressModal(true)

    try {
      // Download demo file
      const fileName = demoType === 'company' ? 'demo-company-profile.pptx' : 'demo-product-profile.pptx'
      const response = await fetch(`/${fileName}`)
      const blob = await response.blob()
      
      // Create File object from blob
      const demoFile = new File([blob], fileName, { type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' })
      
      setFile(demoFile)
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 150))
        setUploadProgress(i)
      }

      setIsUploading(false)
      setIsProcessing(true)

      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate mock profile data
      const mockProfile: ProfileData = {
        companyName: demoType === 'company' ? 'Healthy Medical Solutions' : 'MediScan Pro',
        productName: demoType === 'company' ? 'Health Product Lijn' : 'Diagnostisch Medisch Apparaat',
        industry: 'Medische Apparatuur',
        targetMarkets: ['Nederland', 'België', 'Duitsland', 'Frankrijk', 'Verenigd Koninkrijk'],
        keyFeatures: [
          'CE-markering',
          'ISO 13485 gecertificeerd',
          'Innovatieve technologie',
          'Breed productassortiment',
          'Sterke marktpositie'
        ],
        certifications: ['CE', 'ISO 13485', 'FDA'],
        description: demoType === 'company' 
          ? 'Een toonaangevend bedrijf in de health industrie met een breed scala aan medische producten en apparatuur. Gespecialiseerd in innovatieve oplossingen voor de gezondheidszorg.'
          : 'Geavanceerd diagnostisch medisch apparaat met hoge resolutie beeldkwaliteit en AI-ondersteunde diagnose. Draagbaar en gebruiksvriendelijk voor professionals in de gezondheidszorg.',
        generatedAt: new Date().toISOString()
      }

      setProfileData(mockProfile)
      setIsProcessing(false)
      setShowProgressModal(false)

      // Store profile in localStorage
      localStorage.setItem('currentProfile', JSON.stringify(mockProfile))
    } catch (err) {
      setError('Fout bij het laden van demo bestand. Probeer het opnieuw.')
      setIsUploading(false)
      setIsProcessing(false)
      setUploadProgress(0)
      setShowProgressModal(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const simulateUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    setIsUploading(false)
    setIsProcessing(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generate mock profile data
    const mockProfile: ProfileData = {
      companyName: file?.name.replace(/\.(ppt|pptx)$/i, '') || 'Bedrijfsnaam',
      productName: 'Health Product Lijn',
      industry: 'Medische Apparatuur',
      targetMarkets: ['Nederland', 'België', 'Duitsland', 'Frankrijk', 'Verenigd Koninkrijk'],
      keyFeatures: [
        'CE-markering',
        'ISO 13485 gecertificeerd',
        'Innovatieve technologie',
        'Breed productassortiment',
        'Sterke marktpositie'
      ],
      certifications: ['CE', 'ISO 13485', 'FDA'],
      description: 'Een toonaangevend bedrijf in de health industrie met een breed scala aan medische producten en apparatuur. Gespecialiseerd in innovatieve oplossingen voor de gezondheidszorg.',
      generatedAt: new Date().toISOString()
    }

    setProfileData(mockProfile)
    setIsProcessing(false)

    // Store profile in localStorage
    localStorage.setItem('currentProfile', JSON.stringify(mockProfile))
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Selecteer eerst een bestand')
      return
    }

    await simulateUpload()
  }

  const handleViewProfile = () => {
    router.push('/dashboard/profile')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Upload Profiel
          </h2>
          <p className="text-gray-400">
            Upload een product PPT of company PPT om een AI-profiel te genereren
          </p>
        </div>

        {/* Upload Area */}
        {!profileData ? (
          <div className="space-y-6">
            {/* Demo Files Section */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">
                Demo Bestanden
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Gebruik een demo bestand om de functionaliteit te testen
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleDemoFileSelect('company')}
                  disabled={isUploading || isProcessing}
                  className="flex items-center justify-between p-4 border-2 border-brand-500/50 rounded-lg hover:bg-brand-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium text-white">Company Profile</p>
                      <p className="text-xs text-gray-400">demo-company-profile.pptx</p>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDemoFileSelect('product')}
                  disabled={isUploading || isProcessing}
                  className="flex items-center justify-between p-4 border-2 border-green-500/50 rounded-lg hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium text-white">Product Profile</p>
                      <p className="text-xs text-gray-400">demo-product-profile.pptx</p>
                    </div>
                  </div>
                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-950 text-gray-400">
                  Of upload je eigen bestand
                </span>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
              {/* Drag & Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-gray-700 hover:border-brand-500/50'
                }`}
              >
              <input
                ref={fileInputRef}
                type="file"
                accept=".ppt,.pptx"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="flex justify-center">
                  <svg
                    className={`h-16 w-16 ${isDragging ? 'text-brand-400' : 'text-gray-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-lg font-medium text-white mb-2">
                    {file ? file.name : 'Sleep je bestand hierheen'}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    of klik om te bladeren
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Bestand Selecteren
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  Ondersteunde formaten: PPT, PPTX (max. 50MB)
                </p>
              </div>
              </div>

            {/* File Info */}
              {file && (
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <svg className="h-8 w-8 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-white">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Upload Progress - Only show for manual uploads */}
              {isUploading && !showProgressModal && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Uploaden...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 transition-all duration-500 ease-out relative overflow-hidden"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-brand-500 to-transparent"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing - Only show for manual uploads */}
              {isProcessing && !showProgressModal && (
                <div className="mt-6 text-center">
                  <div className="flex justify-center mb-4">
                    <svg className="animate-spin h-8 w-8 text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <p className="text-gray-400">
                    AI analyseert je bestand en genereert een profiel...
                  </p>
                </div>
              )}

              {/* Upload Button */}
              {file && !isUploading && !isProcessing && (
                <div className="mt-6">
                  <button
                    onClick={handleUpload}
                    className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
                  >
                    Upload en Genereer Profiel
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Success Message */
          <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-800">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-brand-500/20 rounded-full">
                  <Image
                    src="/healthyexports.png"
                    alt="Healthy Exports Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Profiel Succesvol Gegenereerd!
              </h3>
              <p className="text-gray-400">
                Je AI-profiel is klaar. Bekijk de details hieronder.
              </p>
            </div>

            {/* Profile Preview */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">
                Profiel Overzicht
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-400">Bedrijfsnaam:</span>
                  <p className="text-white">{profileData.companyName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400">Product:</span>
                  <p className="text-white">{profileData.productName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-400">Industrie:</span>
                  <p className="text-white">{profileData.industry}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleViewProfile}
                className="flex-1 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors font-medium"
              >
                Bekijk Volledig Profiel
              </button>
              <button
                onClick={() => {
                  setFile(null)
                  setProfileData(null)
                  setUploadProgress(0)
                }}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors font-medium"
              >
                Nieuw Bestand
              </button>
            </div>
          </div>
        )}

        {/* Progress Modal */}
        {showProgressModal && (isUploading || isProcessing) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-xl p-8 border border-gray-800 max-w-md w-full">
              <div className="text-center">
                {isUploading ? (
                  <>
                    <div className="flex justify-center mb-6">
                      <svg className="h-16 w-16 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Bestand Uploaden...
                    </h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Uploaden</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-500 transition-all duration-500 ease-out relative overflow-hidden"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-brand-500 to-transparent"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Even geduld, het bestand wordt geüpload...
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center mb-6">
                      <svg className="animate-spin h-16 w-16 text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      AI Analyseert Bestand...
                    </h3>
                    <p className="text-sm text-gray-400">
                      AI analyseert je bestand en genereert een profiel. Dit kan even duren.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}


