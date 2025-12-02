'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: 'intro' | 'follow-up' | 'quote' | 'meeting' | 'custom'
  variables: string[]
}

export default function EmailTemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null)
  const [personalizedEmail, setPersonalizedEmail] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadTemplates()
  }, [router])

  const loadTemplates = () => {
    const defaultTemplates: EmailTemplate[] = [
      {
        id: '1',
        name: 'Introductie E-mail',
        subject: 'Samenwerking mogelijkheden - {{companyName}}',
        body: `Beste {{contactPerson}},

Ik neem contact met u op namens {{ourCompany}}, een toonaangevend bedrijf in de health industrie.

Wij zijn gespecialiseerd in {{industry}} en zijn op zoek naar betrouwbare distributeurs in {{country}}.

Onze producten onderscheiden zich door:
{{keyFeatures}}

Wij zouden graag de mogelijkheden voor samenwerking met {{distributorName}} bespreken.

Zou u beschikbaar zijn voor een gesprek?

Met vriendelijke groet,
{{senderName}}`,
        type: 'intro',
        variables: ['companyName', 'contactPerson', 'ourCompany', 'industry', 'country', 'keyFeatures', 'distributorName', 'senderName']
      },
      {
        id: '2',
        name: 'Follow-up E-mail',
        subject: 'Vervolg op onze eerdere correspondentie',
        body: `Beste {{contactPerson}},

Ik volg graag op onze eerdere correspondentie over mogelijke samenwerking tussen {{ourCompany}} en {{distributorName}}.

Heeft u de mogelijkheid gehad om onze informatie te bekijken? Ik sta open voor vragen of een gesprek.

Ik hoor graag van u.

Met vriendelijke groet,
{{senderName}}`,
        type: 'follow-up',
        variables: ['contactPerson', 'ourCompany', 'distributorName', 'senderName']
      },
      {
        id: '3',
        name: 'Offerte Verzoek',
        subject: 'Offerte verzoek voor distributie overeenkomst',
        body: `Beste {{contactPerson}},

Naar aanleiding van ons gesprek zou ik graag een offerte willen ontvangen voor een distributieovereenkomst.

Details:
- Productlijn: {{productLine}}
- Doelmarkt: {{country}}
- Verwachte volumes: {{expectedVolume}}

Ik kijk uit naar uw reactie.

Met vriendelijke groet,
{{senderName}}`,
        type: 'quote',
        variables: ['contactPerson', 'productLine', 'country', 'expectedVolume', 'senderName']
      },
      {
        id: '4',
        name: 'Meeting Verzoek',
        subject: 'Meeting verzoek - Samenwerking bespreken',
        body: `Beste {{contactPerson}},

Ik zou graag een meeting willen plannen om de samenwerkingsmogelijkheden tussen {{ourCompany}} en {{distributorName}} te bespreken.

Beschikbare tijdsloten:
- {{date1}} om {{time1}}
- {{date2}} om {{time2}}

Laat me weten wat u het beste uitkomt.

Met vriendelijke groet,
{{senderName}}`,
        type: 'meeting',
        variables: ['contactPerson', 'ourCompany', 'distributorName', 'date1', 'time1', 'date2', 'time2', 'senderName']
      }
    ]

    // Load custom templates from localStorage
    const customTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]')
    setTemplates([...defaultTemplates, ...customTemplates])
  }

  const handleGeneratePersonalized = async () => {
    if (!selectedTemplate || !selectedDistributor) return

    setIsGenerating(true)

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Get profile data
    const profile = JSON.parse(localStorage.getItem('currentProfile') || '{}')
    const userEmail = localStorage.getItem('userEmail') || ''

    // Replace variables
    let personalized = selectedTemplate.body
    personalized = personalized.replace(/\{\{companyName\}\}/g, selectedDistributor.name)
    personalized = personalized.replace(/\{\{contactPerson\}\}/g, selectedDistributor.contactPerson)
    personalized = personalized.replace(/\{\{ourCompany\}\}/g, profile.companyName || 'Ons Bedrijf')
    personalized = personalized.replace(/\{\{industry\}\}/g, profile.industry || 'Health Industrie')
    personalized = personalized.replace(/\{\{country\}\}/g, selectedDistributor.country)
    personalized = personalized.replace(/\{\{keyFeatures\}\}/g, profile.keyFeatures?.slice(0, 3).join('\n- ') || 'Innovatieve producten')
    personalized = personalized.replace(/\{\{distributorName\}\}/g, selectedDistributor.name)
    personalized = personalized.replace(/\{\{senderName\}\}/g, userEmail.split('@')[0])
    personalized = personalized.replace(/\{\{productLine\}\}/g, profile.productName || 'Productlijn')
    personalized = personalized.replace(/\{\{expectedVolume\}\}/g, 'Te bespreken')
    personalized = personalized.replace(/\{\{date1\}\}/g, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL'))
    personalized = personalized.replace(/\{\{time1\}\}/g, '10:00')
    personalized = personalized.replace(/\{\{date2\}\}/g, new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString('nl-NL'))
    personalized = personalized.replace(/\{\{time2\}\}/g, '14:00')

    setPersonalizedEmail(personalized)
    setIsGenerating(false)
    setShowPreview(true)
  }

  const handleSendEmail = () => {
    // In real app, integrate with email service
    alert('E-mail verzenden functionaliteit komt binnenkort. In productie zou dit via SendGrid/Mailgun gaan.')
  }

  const handleSaveTemplate = (template: EmailTemplate) => {
    const customTemplates = JSON.parse(localStorage.getItem('emailTemplates') || '[]')
    customTemplates.push(template)
    localStorage.setItem('emailTemplates', JSON.stringify(customTemplates))
    loadTemplates()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            E-mail Templates & Automatisering
          </h2>
          <p className="text-gray-400">
            Beheer e-mail templates en genereer gepersonaliseerde e-mails
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Templates List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Templates</h3>
                <button
                  onClick={() => {
                    const newTemplate: EmailTemplate = {
                      id: Date.now().toString(),
                      name: 'Nieuw Template',
                      subject: '',
                      body: '',
                      type: 'custom',
                      variables: []
                    }
                    setSelectedTemplate(newTemplate)
                  }}
                  className="px-3 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium"
                >
                  + Nieuw
                </button>
              </div>
              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTemplate?.id === template.id
                        ? 'bg-brand-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-xs opacity-75 mt-1">{template.type}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Template Editor/Preview */}
          <div className="lg:col-span-2">
            {selectedTemplate ? (
              <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Template Naam
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Onderwerp
                  </label>
                  <input
                    type="text"
                    value={selectedTemplate.subject}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Gebruik {{variable}} voor personalisatie"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail Body
                  </label>
                  <textarea
                    value={selectedTemplate.body}
                    onChange={(e) => setSelectedTemplate({ ...selectedTemplate, body: e.target.value })}
                    rows={12}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm"
                    placeholder="Gebruik {{variable}} voor personalisatie"
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    Beschikbare variabelen: {selectedTemplate.variables.join(', ')}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleSaveTemplate(selectedTemplate)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    Opslaan
                  </button>
                  <button
                    onClick={() => {
                      const distributors = JSON.parse(localStorage.getItem('distributors') || '[]')
                      if (distributors.length > 0) {
                        setSelectedDistributor(distributors[0])
                        handleGeneratePersonalized()
                      } else {
                        alert('Geen distributeurs beschikbaar. Zoek eerst distributeurs.')
                      }
                    }}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Genereer Gepersonaliseerd
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl shadow-lg p-12 border border-gray-800 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400">Selecteer een template om te bewerken</p>
              </div>
            )}

            {/* Personalized Email Preview */}
            {showPreview && personalizedEmail && (
              <div className="mt-6 bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Gepersonaliseerde E-mail</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-400 mb-2">Onderwerp:</div>
                  <div className="text-white font-medium">{selectedTemplate?.subject}</div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="text-sm text-gray-400 mb-2">Body:</div>
                  <div className="text-white whitespace-pre-wrap">{personalizedEmail}</div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleSendEmail}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    Verzend E-mail
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(personalizedEmail)
                      alert('E-mail gekopieerd naar clipboard')
                    }}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm font-medium"
                  >
                    Kopieer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Follow-up Automatisering */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Follow-up Automatisering</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-white">Automatische Follow-up</div>
                <div className="text-sm text-gray-400">Stuur automatisch een follow-up na 7 dagen zonder reactie</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-white">Herinnering voor Meetings</div>
                <div className="text-sm text-gray-400">Stuur herinnering 24 uur voor geplande meetings</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}


