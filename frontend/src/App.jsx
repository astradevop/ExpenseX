import { useState, useEffect } from 'react'
import ExpenseList from './components/ExpenseList'
import ExpenseForm from './components/ExpenseForm'
import SearchBar from './components/SearchBar'
import { getAllExpenses, searchExpenses, deleteExpense } from './services/api'

function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load expenses when component mounts
  useEffect(() => {
    loadExpenses()
  }, [])

  // Load expenses function
  const loadExpenses = async () => {
    try {
      setLoading(true)
      const data = await getAllExpenses()
      setExpenses(data)
    } catch (error) {
      console.error('Error loading expenses:', error)
      alert('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  // Handle search
  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      loadExpenses()
      return
    }
    try {
      setLoading(true)
      const data = await searchExpenses(query)
      setExpenses(data)
    } catch (error) {
      console.error('Error searching expenses:', error)
      alert('Failed to search expenses')
    } finally {
      setLoading(false)
    }
  }

  // Handle form close and refresh
  const handleFormClose = () => {
    setShowForm(false)
    setEditingExpense(null)
    loadExpenses()
  }

  // Handle edit
  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id)
        loadExpenses()
        alert('Expense deleted successfully')
      } catch (error) {
        console.error('Error deleting expense:', error)
        alert('Failed to delete expense')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-md bg-white/80 border-b border-purple-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Expense Tracker
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setEditingExpense(null)
                  setShowForm(true)
                }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span className="text-lg">+</span>
                <span>Add Expense</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600 text-sm">Loading expenses...</p>
            </div>
          </div>
        )}

        {/* Expense List */}
        {!loading && (
          <ExpenseList
            expenses={expenses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* Form Modal */}
        {showForm && (
          <ExpenseForm
            expense={editingExpense}
            onClose={handleFormClose}
          />
        )}
      </main>
    </div>
  )
}

export default App

