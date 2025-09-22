"use client";

import Image from 'next/image'
import { useState } from "react";
import { motion } from "framer-motion";

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
}

interface ReviewsSectionProps {
  overallRating?: number;
  totalReviews?: number;
  reviews: Review[];
}

export default function ReviewsSection({ overallRating = 5.0, totalReviews, reviews }: ReviewsSectionProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedComments, setExpandedComments] = useState<{ [id: string]: boolean }>({});
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 4);

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <motion.div className="bg-white rounded-xl shadow-lg p-6 mt-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-extrabold mb-2 text-[#1446a0] tracking-wide">Cảm nhận của các thành viên &amp; gia đình</h3>
        <div className="text-gray-600">{overallRating} • {totalReviews ?? reviews.length} đánh giá</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedReviews.map((review) => (
          <motion.div key={review.id} className="flex flex-col border-b border-gray-100 pb-6 last:border-b-0" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <div className="flex items-start gap-4">
              {review.avatar ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image src={review.avatar} alt={review.userName} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">{getInitials(review.userName)}</div>
              )}
              <div className="flex-1">
                <div className="text-base font-semibold text-gray-900">{review.userName}</div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {[0,1,2,3,4].map((i) => (
                      <span key={i} className={i < Math.round(review.rating) ? 'text-yellow-600' : 'text-gray-300'}>★</span>
                    ))}
                  </span>
                  <span className="text-gray-700 text-sm font-medium">{review.date}</span>
                </div>
                <div className="text-gray-800 text-base leading-relaxed mb-2">
                  {review.comment.length > 140 && !expandedComments[review.id] ? (
                    <>
                      {review.comment.slice(0, 140)} ...
                        <span className="font-semibold underline cursor-pointer ml-1" onClick={() => setExpandedComments((p: { [id: string]: boolean }) => ({ ...p, [review.id]: true }))}>Hiện thêm</span>
                    </>
                  ) : review.comment.length > 140 && expandedComments[review.id] ? (
                    <>
                      {review.comment}
                        <span className="font-semibold underline cursor-pointer ml-1" onClick={() => setExpandedComments((p: { [id: string]: boolean }) => ({ ...p, [review.id]: false }))}>Ẩn bớt</span>
                    </>
                  ) : (
                    review.comment
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {reviews.length > 4 && (
        <div className="flex items-center justify-start gap-4 mt-6">
          <button onClick={() => setShowAllReviews(!showAllReviews)} className="px-6 py-3 rounded-xl bg-gray-100 text-base font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
            {showAllReviews ? 'Thu gọn' : `Xem tất cả ${reviews.length} đánh giá`}
          </button>
        </div>
      )}
    </motion.div>
  );
}
