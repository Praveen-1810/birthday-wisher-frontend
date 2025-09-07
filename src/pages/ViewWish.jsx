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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    axios.get(`${API_BASE}/api/wish/${id}`).then((res) => setWish(res.data));

    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  if (!wish)
    return (
      <div className="text-center text-xl mt-20 text-white">
        ✨ Loading your special wish...
      </div>
    );

  // Default fallback images if wish.images is empty
  const images =
    wish.images && wish.images.length > 0
      ? wish.images
      : [
          "/images/birthday-cake.png",
          "/images/balloons.png",
          "/images/gift-box.png",
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
            onClick={() => navigate(`/surprise/${wish.id}`)}
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