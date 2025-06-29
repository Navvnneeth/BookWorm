const RatingStars = ({ onRate }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className="text-yellow-500 text-xl hover:scale-110"
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default RatingStars
