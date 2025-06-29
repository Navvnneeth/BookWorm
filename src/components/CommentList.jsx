const CommentList = ({ comments }) => (
  <div className="mt-4 space-y-4">
    {comments.map((c) => (
      <div key={c.id} className="p-3 bg-gray-100 rounded shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <img src={c.photoURL} alt={c.username} className="w-6 h-6 rounded-full" />
          <span className="text-sm font-medium">{c.username}</span>
        </div>
        <p className="text-sm">{c.text}</p>
      </div>
    ))}
  </div>
)

export default CommentList
