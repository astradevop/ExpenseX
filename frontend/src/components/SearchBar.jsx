import { useState } from 'react'

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="mb-8 animate-fadeIn">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expenses by name or category..."
            className="w-full bg-white/80 backdrop-blur-sm border border-purple-200 rounded-2xl pl-12 pr-24 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent shadow-lg text-sm transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 px-3 py-1 text-sm bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SearchBar

