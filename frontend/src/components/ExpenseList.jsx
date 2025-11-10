function ExpenseList({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/80 rounded-3xl border border-purple-200 p-20 text-center shadow-xl animate-fadeIn">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">📊</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses yet</h3>
        <p className="text-gray-500 text-sm">Click "Add Expense" to create your first entry</p>
      </div>
    )
  }

  // Calculate total
  const total = expenses.reduce((sum, exp) => sum + exp.expense_amount, 0)

  // Get category colors
  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'from-orange-400 to-red-400',
      'Transport': 'from-blue-400 to-cyan-400',
      'Shopping': 'from-pink-400 to-purple-400',
      'Entertainment': 'from-yellow-400 to-orange-400',
      'Bills': 'from-red-400 to-pink-400',
      'Health': 'from-green-400 to-emerald-400',
    }
    return colors[category] || 'from-gray-400 to-gray-500'
  }

  return (
    <div className="space-y-6">
      {/* Total Summary Card */}
      <div className="backdrop-blur-md bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 shadow-2xl animate-fadeIn">
        <div className="text-white/80 text-sm font-medium mb-1">Total Expenses</div>
        <div className="text-white text-4xl font-bold">₹{total.toLocaleString()}</div>
        <div className="text-white/60 text-xs mt-2">{expenses.length} {expenses.length === 1 ? 'expense' : 'expenses'}</div>
      </div>

      {/* Expense Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {expenses.map((expense, index) => (
          <div
            key={expense.expense_id}
            className="group backdrop-blur-md bg-white/80 rounded-2xl border border-purple-200 p-5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-slideIn"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(expense.expense_category)} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-2xl">
                    {expense.expense_category === 'Food' ? '🍔' :
                     expense.expense_category === 'Transport' ? '🚗' :
                     expense.expense_category === 'Shopping' ? '🛍️' :
                     expense.expense_category === 'Entertainment' ? '🎮' :
                     expense.expense_category === 'Bills' ? '💡' :
                     expense.expense_category === 'Health' ? '🏥' : '💰'}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">{expense.expense_name}</h3>
                  <span className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded-full">
                    {expense.expense_category}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ₹{expense.expense_amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">📅 {expense.expense_date}</div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-purple-600 hover:text-purple-700 text-sm px-3 py-1.5 rounded-lg hover:bg-purple-50 transition font-medium"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(expense.expense_id)}
                  className="text-red-600 hover:text-red-700 text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 transition font-medium"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExpenseList

