import { FaStar } from "react-icons/fa";

export default function RatingStars({ rating = 0, size = 22 }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;

        // نحسب نسبة الامتلاء
        let fillPercentage = 0;

        if (rating >= starValue) {
          fillPercentage = 100;
        } else if (rating >= starValue - 1) {
          fillPercentage = (rating - (starValue - 1)) * 100;
        }

        return (
          <div key={index} className="relative">
            
            {/* النجمة الرمادي */}
            <FaStar size={size} className="text-gray-300" />

            {/* النجمة الملونة */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: `${fillPercentage}%` }}
            >
              <FaStar size={size} className="text-yellow-400" />
            </div>

          </div>
        );
      })}
    </div>
  );
}