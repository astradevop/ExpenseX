import { useState, useEffect } from 'react'
import { addExpense, updateExpense } from '../services/api'

function ExpenseForm({ expense, onClose }) {
  const [formData, setFormData] = useState({
    expense_name: '',
    expense_category: '',
    expense_amount: '',
    expense_date: new Date().toISOString().split('T')[0], // Today's date
    // user field is no longer needed - backend assigns it automatically
  })
  const [loading, setLoading] = useState(false)

  // If editing, populate form with expense data
  useEffect(() => {
    if (expense) {
      setFormData({
        expense_name: expense.expense_name || '',
        expense_category: expense.expense_category || '',
        expense_amount: expense.expense_amount || '',
        expense_date: expense.expense_date || new Date().toISOString().split('T')[0],
      })
    }
  }, [expense])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'expense_amount' ? parseInt(value) || '' : value,
    })
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (expense) {
        // Update existing expense
        await updateExpense(expense.expense_id, formData)
        alert('Expense updated successfully!')
      } else {
        // Add new expense
        await addExpense(formData)
        alert('Expense added successfully!')
      }
      onClose()
    } catch (error) {
      console.error('Error saving expense:', error)
      alert('Failed to save expense. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="backdrop-blur-md bg-white/95 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scaleIn border border-purple-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {expense ? '✏️ Edit Expense' : '➕ Add Expense'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Expense Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💰 Expense Name
            </label>
            <input
              type="text"
              name="expense_name"
              value={formData.expense_name}
              onChange={handleChange}
              required
              className="w-full bg-white/80 border-2 border-purple-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition"
              placeholder="e.g., Grocery Shopping"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📂 Category
            </label>
            <select
              name="expense_category"
              value={formData.expense_category}
              onChange={handleChange}
              required
              className="w-full bg-white/80 border-2 border-purple-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition"
            >
              <option value="">Select a category</option>
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Entertainment">🎮 Entertainment</option>
              <option value="Bills">💡 Bills</option>
              <option value="Health">🏥 Health</option>
              <option value="Other">💰 Other</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              💵 Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                ₹
              </span>
              <input
                type="number"
                name="expense_amount"
                value={formData.expense_amount}
                onChange={handleChange}
                required
                className="w-full bg-white/80 border-2 border-purple-200 rounded-xl pl-8 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              📅 Date
            </label>
            <input
              type="date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              required
              className="w-full bg-white/80 border-2 border-purple-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? '⏳ Saving...' : expense ? '✓ Update' : '✓ Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ExpenseForm

