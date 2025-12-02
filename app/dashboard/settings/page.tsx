'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

export default function SettingsPage() {
  const router = useRouter()
  const [integrations, setIntegrations] = useState({
    hubspot: false,
    salesforce: false,
    pipedrive: false,
    zapier: false
  })

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }
  }, [router])

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Instellingen & Integraties
          </h2>
          <p className="text-gray-400">
            Beheer integraties en export instellingen
          </p>
        </div>

        {/* Integrations */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">CRM Integraties</h3>
          <div className="space-y-4">
            {[
              { id: 'hubspot', name: 'HubSpot', desc: 'Sync contacten en deals' },
              { id: 'salesforce', name: 'Salesforce', desc: 'Integreer met Salesforce CRM' },
              { id: 'pipedrive', name: 'Pipedrive', desc: 'Lead en deal management' },
              { id: 'zapier', name: 'Zapier', desc: 'Workflow automatisering' }
            ].map(integration => (
              <div key={integration.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-white">{integration.name}</div>
                  <div className="text-sm text-gray-400">{integration.desc}</div>
                </div>
                <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium">
                  Verbinden
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Export Settings */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Export Instellingen</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Export Formaat</label>
              <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white">
                <option>CSV</option>
                <option>Excel (XLSX)</option>
                <option>JSON</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
              <input
                type="text"
                placeholder="Voer API key in voor externe integraties"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium">
              Opslaan
            </button>
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Webhooks</h3>
          <div className="space-y-3">
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="font-medium text-white mb-2">Nieuwe Deal Webhook</div>
              <input
                type="text"
                placeholder="https://example.com/webhook"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-sm"
              />
            </div>
            <button className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium">
              Webhook Toevoegen
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}







