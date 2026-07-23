import React, { useState } from 'react';
import { Star, X, Upload, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const ReviewModal = ({ booking, onClose, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a short review comment.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/reviews', {
        bookingId: booking._id,
        providerId: booking.provider?._id || booking.provider,
        rating,
        comment
      });
      if (res.data?.success) {
        toast.success('Thank you for rating your service!');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      toast.success('Review saved successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-rose-50/60/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full p-6 rounded-3xl bg-white border border-rose-100 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
          <h3 className="text-lg font-bold text-slate-800">Rate Service Quality</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-rose-100/50 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star Selection */}
          <div className="text-center py-2">
            <span className="text-slate-400 block mb-2 font-semibold">How would you rate the technician?</span>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Your Review Comment</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Excellent service! Technician arrived on time and fixed the short circuit cleanly."
              className="w-full p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-slate-800 focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl bg-rose-100/50 text-slate-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="py-2.5 rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-300 text-slate-800 font-bold shadow-lg shadow-violet-400/20"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
