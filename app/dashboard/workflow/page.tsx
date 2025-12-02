'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

export default function SystemWorkflowPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
    setUserEmail(email)
  }, [router])

  const tabs = [
    { id: 'overview', name: 'Overzicht' },
    { id: 'profile', name: 'Profiel Upload & AI' },
    { id: 'search', name: 'Distributeur Zoeken' },
    { id: 'email', name: 'E-mail & Automatisering' },
    { id: 'analytics', name: 'Analytics & Reporting' },
    { id: 'documents', name: 'Document Management' },
    { id: 'tasks', name: 'Taken & Kalender' },
    { id: 'quotes', name: 'Offertes & Pricing' },
    { id: 'pipeline', name: 'Pipeline Management' },
    { id: 'compliance', name: 'Compliance Tracking' },
    { id: 'integrations', name: 'Integraties & API' }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            System Workflow
          </h2>
          <p className="text-gray-400">
            Technische architectuur en integraties voor het Healthy Exports platform
          </p>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <svg className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Huidige Status: Demo Platform
              </h3>
              <p className="text-blue-200">
                Het huidige platform is een volledig werkende demo met gesimuleerde data. 
                Alle functionaliteit werkt zoals bedoeld, maar gebruikt mock data in plaats van echte API koppelingen. 
                Hieronder wordt uitgelegd hoe elk onderdeel zou werken met echte koppelingen en data.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
          <div className="border-b border-gray-800">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-brand-500 text-brand-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Platform Workflow Overzicht</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tabs.filter(t => t.id !== 'overview').map((tab) => (
                    <div
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <h4 className="font-semibold text-white mb-2">{tab.name}</h4>
                      <p className="text-sm text-gray-400">Klik om details te bekijken</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Upload & AI Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Profiel Upload & AI Analyse</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Gebruiker upload een PPT/PPTX bestand, systeem simuleert AI analyse en genereert mock profiel data.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>File Upload API:</strong> Bestand wordt geüpload naar cloud storage (AWS S3, Azure Blob, of Google Cloud Storage)</li>
                      <li><strong>PPT Parser Service:</strong> Service extraheert tekst, afbeeldingen en structuur uit PowerPoint bestand
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>Python library: python-pptx voor PPTX parsing</li>
                          <li>Apache POI voor Java-based parsing</li>
                          <li>Cloud service: AWS Textract, Google Document AI</li>
                        </ul>
                      </li>
                      <li><strong>AI Analyse Service:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>OpenAI GPT-4 voor content analyse en extractie</li>
                          <li>Claude (Anthropic) voor document understanding</li>
                          <li>Custom fine-tuned model voor health industry specifieke data</li>
                          <li>Extracteert: bedrijfsnaam, producten, certificeringen, markten, features</li>
                        </ul>
                      </li>
                      <li><strong>Data Storage:</strong> Profiel data wordt opgeslagen in database (PostgreSQL, MongoDB) met structuur voor verdere matching</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Distributeur Zoeken</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Gebruiker selecteert land, systeem genereert 20 mock distributeurs met random data.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Data Sources voor Distributeurs:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li><strong>LinkedIn Sales Navigator API:</strong> Zoek bedrijven op basis van industrie, locatie, bedrijfsgrootte</li>
                          <li><strong>Google Places API / Google My Business:</strong> Zoek bedrijven in specifieke regio's en categorieën</li>
                          <li><strong>Kompass API:</strong> B2B bedrijfsdatabase met uitgebreide filters</li>
                          <li><strong>ZoomInfo API:</strong> B2B contact en bedrijfsdata</li>
                          <li><strong>Custom Database:</strong> Eigen database met verzamelde distributeur data</li>
                          <li><strong>Web Scraping Services:</strong> Scrapy, BeautifulSoup, of commercieel (Bright Data, ScraperAPI)</li>
                        </ul>
                      </li>
                      <li><strong>AI Matching Service:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Vergelijkt profiel met potentiële distributeurs</li>
                          <li>Berekent match score op basis van: industrie, locatie, specialisaties, certificeringen, bedrijfsgrootte</li>
                          <li>Gebruikt embeddings (OpenAI, Cohere) voor semantische matching</li>
                          <li>Ranks resultaten op relevantie</li>
                        </ul>
                      </li>
                      <li><strong>Data Enrichment:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Clearbit API voor bedrijfsdata verrijking</li>
                          <li>Hunter.io voor e-mail verificatie en finding</li>
                          <li>FullContact voor contact informatie</li>
                        </ul>
                      </li>
                      <li><strong>Geavanceerde Filters:</strong> Filters op ervaring, certificeringen, omzet, specialisaties worden toegepast op database queries</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Email & Automation Tab */}
            {activeTab === 'email' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">E-mail Templates & Automatisering</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Gebruiker kan templates bewerken en gepersonaliseerde e-mails genereren. Follow-up automatisering is geconfigureerd maar niet actief.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>E-mail Automatisering:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li><strong>SendGrid / Mailgun:</strong> Transactional e-mail service voor betrouwbare delivery</li>
                          <li><strong>Resend:</strong> Moderne e-mail API met goede deliverability</li>
                          <li><strong>Amazon SES:</strong> Schaalbare e-mail service</li>
                          <li>AI genereert gepersonaliseerde e-mail op basis van profiel en distributeur data</li>
                          <li>Template system met variabelen voor personalisatie ({'{{companyName}}'}, {'{{contactPerson}}'}, etc.)</li>
                          <li>E-mail tracking: open rates, click rates, reply detection</li>
                        </ul>
                      </li>
                      <li><strong>LinkedIn Outreach:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>LinkedIn API voor direct messaging (beperkt, vereist approval)</li>
                          <li>Of gebruik LinkedIn Sales Navigator voor outreach</li>
                          <li>Automatisering tools: Phantombuster, Linked Helper (met voorzichtigheid)</li>
                        </ul>
                      </li>
                      <li><strong>Follow-up Automatisering:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Geplande follow-up e-mails na X dagen zonder reactie</li>
                          <li>Reminder systeem voor belangrijke acties</li>
                          <li>Workflow automatisering (Zapier, Make.com, of custom backend jobs)</li>
                          <li>Cron jobs of queue system (Bull, Celery) voor scheduled tasks</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Analytics & Reporting</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Statistieken worden berekend uit localStorage data. Export naar CSV werkt, PDF export is placeholder.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Data Aggregatie:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>Real-time data aggregatie uit database</li>
                          <li>Time-series data voor trends (InfluxDB, TimescaleDB)</li>
                          <li>Cached aggregaties voor snelle dashboard loading (Redis)</li>
                        </ul>
                      </li>
                      <li><strong>Visualisatie:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Chart.js, Recharts, of D3.js voor grafieken</li>
                          <li>Real-time updates via WebSockets of Server-Sent Events</li>
                        </ul>
                      </li>
                      <li><strong>Export Functionaliteit:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li><strong>PDF Export:</strong> jsPDF, Puppeteer, of html2pdf voor PDF generatie</li>
                          <li><strong>Excel Export:</strong> ExcelJS, xlsx library voor Excel bestanden</li>
                          <li>Scheduled reports via e-mail (dagelijks, wekelijks)</li>
                        </ul>
                      </li>
                      <li><strong>ROI Tracking:</strong> Berekent ROI per distributeur, campagne, of periode op basis van gesloten deals en kosten</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === 'documents' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Document Management</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Documenten kunnen worden geüpload en beheerd. Metadata wordt opgeslagen in localStorage.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Cloud Storage:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>AWS S3, Azure Blob Storage, of Google Cloud Storage voor document opslag</li>
                          <li>CDN voor snelle document delivery</li>
                          <li>Version control voor document revisies</li>
                        </ul>
                      </li>
                      <li><strong>Document Processing:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>OCR voor gescande documenten (Tesseract, Google Cloud Vision)</li>
                          <li>PDF parsing en extractie</li>
                          <li>Document preview generatie</li>
                        </ul>
                      </li>
                      <li><strong>Digitale Handtekeningen:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>DocuSign API integratie</li>
                          <li>HelloSign / Dropbox Sign API</li>
                          <li>Adobe Sign integratie</li>
                        </ul>
                      </li>
                      <li><strong>Template System:</strong> Contract templates met variabelen, automatische generatie van offertes en overeenkomsten</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Tasks Tab */}
            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Taken & Kalenderbeheer</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Taken kunnen worden aangemaakt en beheerd via Kanban board. Deadlines en reminders zijn zichtbaar.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Kalender Integratie:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>Google Calendar API voor sync</li>
                          <li>Microsoft Outlook / Exchange API</li>
                          <li>iCal format voor export/import</li>
                        </ul>
                      </li>
                      <li><strong>Reminder Systeem:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>E-mail reminders via SendGrid/Mailgun</li>
                          <li>Push notifications (browser, mobile app)</li>
                          <li>SMS reminders via Twilio</li>
                          <li>Queue system voor scheduled reminders</li>
                        </ul>
                      </li>
                      <li><strong>Task Automatisering:</strong> Automatische taken genereren op basis van events (nieuwe distributeur, follow-up nodig, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Offerte & Pricing Management</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Offertes kunnen worden aangemaakt met pricing calculator. Status tracking is beschikbaar.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Offerte Generator:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>Template-based offerte generatie</li>
                          <li>Dynamische pricing op basis van volume, markt, kortingen</li>
                          <li>PDF generatie voor offertes</li>
                          <li>E-mail verzending met tracking</li>
                        </ul>
                      </li>
                      <li><strong>Pricing Engine:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Dynamische pricing rules engine</li>
                          <li>Markt-specifieke pricing</li>
                          <li>Volume discounts automatisch berekend</li>
                        </ul>
                      </li>
                      <li><strong>Offerte Tracking:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>E-mail tracking: wanneer is offerte bekeken</li>
                          <li>PDF tracking: welke pagina's zijn bekeken</li>
                          <li>Automatische follow-up na X dagen</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Pipeline Tab */}
            {activeTab === 'pipeline' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Deal Pipeline Management</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Visual Kanban board met 6 stages. Deals kunnen worden verplaatst tussen stages. Pipeline waarde wordt berekend.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Pipeline Tracking:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>Real-time updates via WebSockets</li>
                          <li>Drag & drop functionaliteit met backend sync</li>
                          <li>Pipeline stages configuratie per gebruiker/organisatie</li>
                        </ul>
                      </li>
                      <li><strong>Forecasting:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Gewogen pipeline waarde op basis van probability</li>
                          <li>Revenue forecasting per periode</li>
                          <li>Win/loss analyse</li>
                        </ul>
                      </li>
                      <li><strong>Automation:</strong> Automatische stage transitions op basis van events (offerte geaccepteerd, meeting gepland, etc.)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Tab */}
            {activeTab === 'compliance' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Compliance & Certificering Tracking</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Huidige Demo</h4>
                    <p className="text-gray-300">
                      Certificeringen worden getoond per distributeur met expiry dates. Alerts voor expiring/expired certificeringen.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Echte Implementatie</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Certificering Verificatie:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm space-y-1">
                          <li>API integraties met certificering databases (waar beschikbaar)</li>
                          <li>Document verificatie via OCR en AI</li>
                          <li>Manual verification workflow</li>
                        </ul>
                      </li>
                      <li><strong>Expiry Management:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Automatische alerts 90, 60, 30 dagen voor expiry</li>
                          <li>E-mail notifications naar distributeur en intern team</li>
                          <li>Renewal tracking</li>
                        </ul>
                      </li>
                      <li><strong>Compliance per Markt:</strong>
                        <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                          <li>Database met regulaties per land/regio</li>
                          <li>Compliance checklist per markt</li>
                          <li>Automatische verificatie of alle vereisten zijn voldaan</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white mb-4">Integraties & API</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">CRM Integraties</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>HubSpot API:</strong> Automatisch contacten en deals aanmaken, sync relatie status en notities</li>
                      <li><strong>Salesforce API:</strong> Integratie met bestaande CRM, data sync bidirectioneel</li>
                      <li><strong>Pipedrive API:</strong> Lead en deal management, activity tracking</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Workflow Automatisering</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>Zapier / Make.com:</strong> No-code automatisering tussen platform en andere tools</li>
                      <li><strong>Custom Webhooks:</strong> Real-time events naar externe systemen</li>
                      <li><strong>REST API:</strong> Volledige API voor externe integraties</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Export & Data</h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                      <li><strong>CSV/Excel Export:</strong> Bulk export van data</li>
                      <li><strong>API Endpoints:</strong> Programmatische toegang tot alle data</li>
                      <li><strong>Webhook Events:</strong> Real-time notifications voor externe systemen</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

