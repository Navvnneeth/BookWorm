import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { db } from '../firebase'
import {
  collection, addDoc, onSnapshot, query, orderBy,
  serverTimestamp, setDoc, doc, getDocs
} from 'firebase/firestore'
import CommentList from '../components/CommentList'
import RatingStars from '../components/RatingStars'

const BookDetail = ({ user }) => {
  const { bookId } = useParams()
  const [book, setBook] = useState(null)
  const [authorName, setAuthorName] = useState('')
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [avgRating, setAvgRating] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [numOfReviews, setNumOfReviews] = useState(0);
  const [review, setReview] = useState(0);

  // 1. Fetch book metadata
  useEffect(() => {
    const fetchBook = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`https://openlibrary.org/works/${bookId}.json`)
        setBook(res.data)

        // Fetch author name
        const authorKey = res.data?.authors?.[0]?.author?.key
        if (authorKey) {
          const authorRes = await axios.get(`https://openlibrary.org${authorKey}.json`)
          setAuthorName(authorRes.data.name)
        }
      } catch (err) {
        console.error('Failed to fetch book:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  // 2. Fetch real-time comments
  useEffect(() => {
    if (!bookId) return

    const q = query(
      collection(db, 'books', bookId, 'comments'),
      orderBy('timestamp', 'desc')
    )
    const unsub = onSnapshot(q, snapshot => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsub()
  }, [bookId])

  // 3. Calculate average rating
  useEffect(() => {
    if (!bookId) return
    const fetchRating = async () => {
      const snap = await getDocs(collection(db, 'books', bookId, 'ratings'))
      const stars = snap.docs.map(doc => doc.data().stars)
      const avg = stars.length > 0 ? stars.reduce((a, b) => a + b, 0) / stars.length : 0
      setNumOfReviews(stars.length)
      setAvgRating(avg.toFixed(1))
    }
    fetchRating()
  }, [bookId, review])

  // 4. Add comment
  const submitComment = async () => {
    if (!comment.trim()) return
    await addDoc(collection(db, 'books', bookId, 'comments'), {
      userId: user.uid,
      username: user.displayName,
      photoURL: user.photoURL,
      text: comment.trim(),
      timestamp: serverTimestamp(),
    })
    setComment('')
  }

  // 5. Rate book
  const submitRating = async (stars) => {
    await setDoc(doc(db, 'books', bookId, 'ratings', user.uid), {
      userId: user.uid,
      username: user.displayName,
      stars,
      timestamp: serverTimestamp(),
    })
    setReview(stars);
  }

  // 6. Add to favorites
  const addToFavorites = async () => {
    await setDoc(doc(db, 'users', user.uid, 'favourites', bookId), {
      bookId,
      title: book?.title,
      cover_id: book?.covers?.[0],
      author_name: authorName,
      timestamp: serverTimestamp(),
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {book ? (
          <>
            {/* Book Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-amber-100">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-48 flex-shrink-0">
                  <img
                    src={
                      book.covers?.[0]
                        ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
                        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                    }
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-lg shadow-sm border border-amber-200"
                    onError={(e) => {
                      e.target.src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <h1 className="text-3xl font-bold text-amber-900 font-serif">{book.title}</h1>
                  <p className="text-amber-700 mt-1 italic">by {authorName || 'Unknown Author'}</p>
                  
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center bg-amber-100 px-3 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 font-medium text-amber-800">
                        {avgRating || 'N/A'} <span className="text-sm text-amber-600">({numOfReviews} reviews)</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-amber-800">
                      {typeof book.description === 'string'
                        ? book.description
                        : book.description?.value || 'No description available'}
                    </p>
                  </div>

                  <button
                    onClick={addToFavorites}
                    className="mt-6 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Add to Favorites
                  </button>
                </div>
              </div>
            </div>

            {/* Rating Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-900 mb-4 font-serif">Rate this book</h2>
              <RatingStars onRate={submitRating} />
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-amber-100">
              <h2 className="text-xl font-semibold text-amber-900 mb-4 font-serif">
                Comments <span className="text-amber-600">({comments.length})</span>
              </h2>
              
              {user && (
                <div className="flex gap-3 mb-6">
                  <img
                    src={user.photoURL || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                    alt={user.displayName || 'User'}
                    className="w-10 h-10 rounded-full border-2 border-amber-200"
                  />
                  <div className="flex-grow">
                    <textarea
                      className="w-full border border-amber-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      rows="3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about this book..."
                    />
                    <button
                      onClick={submitComment}
                      className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full transition-colors duration-200 float-right"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              )}

              <CommentList comments={comments} />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="mt-4 text-amber-800">Book not found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookDetail