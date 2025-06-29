import { useNavigate } from "react-router-dom"

const Book = ({ book }) => {
  const navigate = useNavigate();
  const key = book.key || book.work_key || ''
  const bookId = key.split('/').pop()
  const coverUrl = book.cover_id
    ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg`
    : null

  return (
    <div className="bg-amber-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col justify-between border border-amber-100">
      {coverUrl ? (
        <div className="relative pb-[150%] overflow-hidden rounded">
          <img
            src={coverUrl}
            alt={book.title}
            className="absolute top-0 left-0 w-full h-full object-cover rounded"
          />
        </div>
      ) : (
        <div className="relative pb-[150%] bg-amber-100 flex items-center justify-center text-sm text-amber-800 rounded border border-amber-200">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="mt-2 text-center">No Cover Available</span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-amber-900 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-amber-700 mt-1 italic">
          by {book.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
        </p>
        {bookId && (
          <button 
            className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 rounded-full transition-colors duration-200 font-medium flex items-center justify-center gap-1"
            onClick={() => navigate(`/book/${bookId}`)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Details
          </button>
        )}
      </div>
    </div>
  )
}

export default Book