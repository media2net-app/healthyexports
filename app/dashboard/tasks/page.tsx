'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/DashboardLayout'

interface Task {
  id: string
  title: string
  description: string
  distributorId?: string
  distributorName?: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'completed'
  reminder?: string
}

export default function TasksPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  })

  useEffect(() => {
    const email = localStorage.getItem('userEmail')
    if (!email) {
      router.push('/')
      return
    }

    loadTasks()
  }, [router])

  const loadTasks = () => {
    const saved = JSON.parse(localStorage.getItem('tasks') || '[]')
    
    // Add demo tasks if no tasks exist
    if (saved.length === 0) {
      const demoTasks: Task[] = [
        {
          id: 'demo-1',
          title: 'Follow-up meeting met Health Distributors BV',
          description: 'Bespreken distributieovereenkomst en pricing',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'todo'
        },
        {
          id: 'demo-2',
          title: 'Offerte voorbereiden voor MedSupply Germany',
          description: 'Offerte opstellen voor Medical Devices productlijn',
          distributorId: 'demo-2',
          distributorName: 'MedSupply Germany',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'in_progress'
        },
        {
          id: 'demo-3',
          title: 'Certificering verificatie Belgian Health Solutions',
          description: 'CE certificering controleren en valideren',
          distributorId: 'demo-3',
          distributorName: 'Belgian Health Solutions',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'medium',
          status: 'todo'
        },
        {
          id: 'demo-4',
          title: 'Contract review voltooien',
          description: 'Distributieovereenkomst reviewen en goedkeuren',
          distributorId: 'demo-1',
          distributorName: 'Health Distributors BV',
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          priority: 'high',
          status: 'completed'
        }
      ]
      localStorage.setItem('tasks', JSON.stringify(demoTasks))
      setTasks(demoTasks)
    } else {
      setTasks(saved)
    }
  }

  const handleSaveTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title || '',
      description: newTask.description || '',
      dueDate: newTask.dueDate || '',
      priority: newTask.priority || 'medium',
      status: newTask.status || 'todo',
      distributorId: newTask.distributorId,
      distributorName: newTask.distributorName
    }

    const updated = [...tasks, task]
    setTasks(updated)
    localStorage.setItem('tasks', JSON.stringify(updated))
    setShowModal(false)
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'todo' })
  }

  const handleUpdateStatus = (id: string, status: Task['status']) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status } : t)
    setTasks(updated)
    localStorage.setItem('tasks', JSON.stringify(updated))
  }

  const handleDelete = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    localStorage.setItem('tasks', JSON.stringify(updated))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600/20 border-red-500/30 text-red-400'
      case 'medium': return 'bg-yellow-600/20 border-yellow-500/30 text-yellow-400'
      default: return 'bg-green-600/20 border-green-500/30 text-green-400'
    }
  }

  const upcomingTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  const overdueTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date())

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Taken & Kalender
            </h2>
            <p className="text-gray-400">
              Beheer taken, deadlines en reminders
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nieuwe Taak</span>
          </button>
        </div>

        {/* Alerts */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-red-400 font-medium">{overdueTasks.length} ta(a)k(en) verlopen</span>
            </div>
          </div>
        )}

        {upcomingTasks.length > 0 && (
          <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-yellow-400 font-medium">{upcomingTasks.length} ta(a)k(en) komende week</span>
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Todo */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Te Doen ({tasks.filter(t => t.status === 'todo').length})</h3>
            </div>
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {tasks.filter(t => t.status === 'todo').map(task => (
                <div key={task.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                  )}
                  {task.distributorName && (
                    <p className="text-xs text-gray-500 mb-2">Distributeur: {task.distributorName}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mb-3">
                      Deadline: {new Date(task.dueDate).toLocaleDateString('nl-NL')}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'in_progress')}
                      className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs font-medium"
                    >
                      Verwijder
                    </button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === 'todo').length === 0 && (
                <p className="text-gray-500 text-center py-8 text-sm">Geen taken</p>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Bezig ({tasks.filter(t => t.status === 'in_progress').length})</h3>
            </div>
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {tasks.filter(t => t.status === 'in_progress').map(task => (
                <div key={task.id} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-2">{task.description}</p>
                  )}
                  {task.distributorName && (
                    <p className="text-xs text-gray-500 mb-2">Distributeur: {task.distributorName}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mb-3">
                      Deadline: {new Date(task.dueDate).toLocaleDateString('nl-NL')}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'completed')}
                      className="flex-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium"
                    >
                      Voltooien
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(task.id, 'todo')}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs font-medium"
                    >
                      Terug
                    </button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === 'in_progress').length === 0 && (
                <p className="text-gray-500 text-center py-8 text-sm">Geen taken</p>
              )}
            </div>
          </div>

          {/* Completed */}
          <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-white">Voltooid ({tasks.filter(t => t.status === 'completed').length})</h3>
            </div>
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {tasks.filter(t => t.status === 'completed').map(task => (
                <div key={task.id} className="bg-gray-800 rounded-lg p-4 opacity-75">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-white line-through">{task.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-400 mb-2 line-through">{task.description}</p>
                  )}
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="w-full px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs font-medium"
                  >
                    Verwijder
                  </button>
                </div>
              ))}
              {tasks.filter(t => t.status === 'completed').length === 0 && (
                <p className="text-gray-500 text-center py-8 text-sm">Geen taken</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-800 max-w-md w-full">
              <h3 className="text-xl font-semibold text-white mb-4">Nieuwe Taak</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Titel</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Beschrijving</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prioriteit</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="low">Laag</option>
                    <option value="medium">Gemiddeld</option>
                    <option value="high">Hoog</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false)
                    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'todo' })
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleSaveTask}
                  className="flex-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  Opslaan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}







