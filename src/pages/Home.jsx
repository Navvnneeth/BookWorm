import { useState, useEffect } from 'react'
import axios from 'axios'
import Book from '../components/Book'
import NavBar from '../components/NavBar'

const Home = ({ user }) => {
  const [books, setBooks] = useState([])
  const [genre, setGenre] = useState('popular')
  const [isLoading, setIsLoading] = useState(false)

  const fetchBooksByGenre = async (genre) => {
    setIsLoading(true)
    try {
      const res = await axios.get(
        `https://openlibrary.org/subjects/${genre}.json?limit=36`
      )
      setBooks(res.data.works)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBooksBySearch = async (query) => {
    setIsLoading(true)
    try {
      const res = await axios.get(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=36`
      )
      const mapped = res.data.docs.map(doc => ({
        key: `/works/${doc.key.split('/').pop()}`,
        title: doc.title,
        authors: doc.author_name?.map(name => ({ name })),
        cover_id: doc.cover_i
      }))
      setBooks(mapped)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooksByGenre(genre)
  }, [genre])

  return (
    <div className="min-h-screen bg-amber-50">
      <NavBar user={user} onSearch={fetchBooksBySearch} onGenreChange={setGenre} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-amber-900 mb-2 capitalize font-serif">
            {genre.replace('_', ' ')} Books
          </h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {books.map(book => (
              <Book key={book.key} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home