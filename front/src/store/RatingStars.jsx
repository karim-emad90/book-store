import { FaStar } from "react-icons/fa";
import { useState } from "react";

export default function RatingStars() {
    const [rating, setRating] = useState(0); 

  return (
    
        <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <FaStar
            key={index}
            size={22}
            className={
              value <= rating ? "text-yellow-400 cursor-pointer" : "text-gray-300 cursor-pointer"
            }
            onClick={() => setRating(value)}
          />
        );
      })}
    </div>
  )
}
