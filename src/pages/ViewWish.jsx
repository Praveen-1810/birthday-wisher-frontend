import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Confetti from "react-confetti";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ViewWish() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const fetchWish = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching wish from: ${API_BASE}/api/wish/${id}`);
        
        const response = await axios.get(`${API_BASE}/api/wish/${id}`);
        console.log("Wish data received:", response.data);
        
        // Fix image URLs that point to localhost
        const wishData = response.data;
        if (wishData.images) {
          wishData.images = wishData.images.map(img => 
            img.replace('http://localhost:5000', API_BASE)
          );
        }
        if (wishData.video) {
          wishData.video = wishData.video.replace('http://localhost:5000', API_BASE);
        }
        
        setWish(wishData);
      } catch (err) {
        console.error("Error fetching wish:", err);
        setError(err.response?.data?.error || "Failed to load wish");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchWish();
    }

    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin mb-4 h-12 w-12 rounded-full border-4 border-pink-300 border-t-pink-600 mx-auto"></div>
          <p className="text-xl text-gray-700">✨ Loading your special wish...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 p-6">
        <div className="max-w-md w-full bg-white/90 rounded-xl p-6 shadow-lg text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No wish found
  if (!wish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 p-6">
        <div className="max-w-md w-full bg-white/90 rounded-xl p-6 shadow-lg text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Wish Not Found</h2>
          <p className="text-gray-600 mb-4">This birthday wish doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            Create New Wish
          </button>
        </div>
      </div>
    );
  }

  // Default fallback images if wish.images is empty
  const images =
    wish.images && wish.images.length > 0
      ? wish.images
      : [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
        ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        {images.length > 0 && (
          <motion.div
            key={currentIndex}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${images[currentIndex]})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Confetti 🎉 */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        gravity={0.15}
      />

      {/* Floating Emojis */}
      <motion.div
        className="absolute top-10 left-1/4 text-5xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        🎈
      </motion.div>
      <motion.div
        className="absolute top-20 right-1/4 text-6xl"
        animate={{ y: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        🎂
      </motion.div>
      <motion.div
        className="absolute top-1/2 left-1/3 text-6xl"
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 3.5 }}
      >
        🎁
      </motion.div>

      {/* Wish Content with Gradient Overlay */}
      <motion.div
        className="relative max-w-3xl mx-6 md:mx-auto text-center p-6 rounded-xl"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
      >
        {/* Title with gradient background */}
        <h1 className="inline-block text-5xl font-extrabold text-white drop-shadow-lg px-6 py-3 rounded-xl bg-gradient-to-r from-black/60 via-black/40 to-transparent">
          🎉 Happy Birthday {wish.name}! 🎉
        </h1>

        {/* Message with gradient strip and scrollbar */}
        {wish?.message && (
          <div className="mt-6 text-lg md:text-xl italic leading-relaxed text-white/90 px-6 py-4 rounded-xl bg-gradient-to-r from-black/60 via-black/40 to-transparent max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
            {wish.message}
          </div>
        )}
      </motion.div>

      {/* Carousel Navigation */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-black px-4 py-2 rounded-full"
          >
            ⬅
          </button>
          <motion.button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 text-black px-4 py-2 rounded-full"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            ➡
          </motion.button>
        </>
      )}

      {/* Surprise Button 🎁 */}
      {wish.video && (
        <div className="absolute bottom-24 flex justify-center w-full">
          <button
            onClick={() => navigate(`/surprise/${wish.id || wish._id}`)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg text-lg font-semibold"
          >
            🎥 Surprise
          </button>
        </div>
      )}

      {/* Footer */}
      <motion.p
        className="absolute bottom-6 text-white/90 font-medium text-lg drop-shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        💖 Made with love by your friend {wish.sender}
      </motion.p>
    </div>
  );
}