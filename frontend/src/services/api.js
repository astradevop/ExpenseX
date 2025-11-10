// API Base URL - Use proxy (relative path) to avoid CORS issues
const API_BASE_URL = '/api';

// Get all expenses
export const getAllExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/view`);
  if (!response.ok) {
    throw new Error('Failed to fetch expenses');
  }
  return response.json();
};

// Get single expense by ID
export const getExpenseById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/one/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch expense');
  }
  return response.json();
};

// Add new expense
export const addExpense = async (expenseData) => {
  const response = await fetch(`${API_BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to add expense');
  }
  return response.json();
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  const response = await fetch(`${API_BASE_URL}/update/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update expense');
  }
  return response.json();
};

// Delete expense
export const deleteExpense = async (id) => {
  const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete expense');
  }
  return response.json();
};

// Search expenses
export const searchExpenses = async (query) => {
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) {
    throw new Error('Failed to search expenses');
  }
  return response.json();
};

