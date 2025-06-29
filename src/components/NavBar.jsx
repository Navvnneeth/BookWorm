import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { useState, useRef, useEffect } from 'react'

const genres = [
  'popular', 'fantasy', 'science_fiction', 'romance',
  'history', 'mystery', 'horror', 'biographies'
]

const Navbar = ({ user, onSearch, onGenreChange }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showGenresMenu, setShowGenresMenu] = useState(false)
  const userMenuRef = useRef(null)
  const genresMenuRef = useRef(null)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) onSearch(searchTerm)
  }

  const handleGenreChange = (genre) => {
    onGenreChange(genre)
    setShowGenresMenu(false)
  }

  const handleLogout = () => {
    signOut(auth)
    navigate('/signin')
  }

  const goToFavorites = () => {
    navigate('/favorites')
  }

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
      if (genresMenuRef.current && !genresMenuRef.current.contains(event.target)) {
        setShowGenresMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="bg-amber-50 shadow-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200 font-serif">
      {/* Logo/Title */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold text-amber-800 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-amber-600">Book</span>Worm
        </h1>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-grow max-w-2xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search titles, authors..."
            className="w-full px-4 py-2 border rounded-full border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white text-amber-900 placeholder-amber-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      {/* Genres Dropdown */}
      <div className="relative" ref={genresMenuRef}>
        <button
          onClick={() => setShowGenresMenu(!showGenresMenu)}
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-sm px-4 py-2 rounded-full border border-amber-200 transition-colors duration-200 font-medium flex items-center gap-1"
        >
          <span>Genres</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showGenresMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-amber-100 max-h-96 overflow-y-auto">
            {genres.map((genre) => (
              <button
                key={genre}
                className="block w-full text-left px-4 py-2 text-sm text-amber-800 hover:bg-amber-50 transition-colors"
                onClick={() => handleGenreChange(genre)}
              >
                {genre.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Favorites Button */}
      {user && (
        <button
          onClick={goToFavorites}
          className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-2 rounded-full transition-colors duration-200 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
          Favorites
        </button>
      )}

      {/* User Profile */}
      {user && (
        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <img
              src={user.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
              alt={user.displayName || 'User profile'}
              className="w-8 h-8 rounded-full border-2 border-amber-300 hover:border-amber-500 transition-colors"
              onError={(e) => {
                e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-amber-100">
              <div className="px-4 py-2 border-b border-amber-100">
                <p className="text-sm font-medium text-amber-900">{user.displayName || 'User'}</p>
                <p className="text-xs text-amber-600">{user.email || ''}</p>
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-amber-800 hover:bg-amber-50 transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Navbar