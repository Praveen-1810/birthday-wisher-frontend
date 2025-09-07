// frontend/src/pages/SurpriseVideo.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function SurpriseVideo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wish, setWish] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadWish() {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/wish/${id}`);
        if (cancelled) return;

        setWish(res.data || null);

        const v =
          res.data?.video && typeof res.data.video === "string" && res.data.video.length > 0
            ? res.data.video
            : `${API_BASE}/video/${id}`;

        setVideoSrc(v);
      } catch (err) {
        console.error("Failed to load wish:", err);
        setError("Could not load the surprise video.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadWish();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50">
        <div className="text-center">
          <div className="animate-spin mb-4 h-10 w-10 rounded-full border-4 border-white/30 border-t-white"></div>
          <p className="text-lg font-medium text-gray-700">Loading your surprise…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-amber-50 p-6">
        <div className="max-w-xl w-full bg-white/90 rounded-xl p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops — something went wrong</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-md bg-pink-500 text-white font-semibold"
            >
              Go back
            </button>
            {videoSrc && (
              <a
                href={videoSrc}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-900"
              >
                Open video directly
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-200 via-rose-100 to-yellow-100 overflow-hidden">
      {/* 🎉 Confetti Background */}
      <Confetti numberOfPieces={150} recycle={true} />

      {/* Show button first */}
      {!showVideo && (
        <motion.button
          onClick={() => setShowVideo(true)}
          className="relative px-10 py-5 text-2xl font-bold text-white bg-pink-600 rounded-full shadow-lg overflow-hidden"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          🎉 Click for a Surprise 🎉
          <span className="absolute inset-0 rounded-full bg-pink-400 blur-xl opacity-40 animate-pulse"></span>
        </motion.button>
      )}

      {/* Show video in fullscreen modal */}
      {showVideo && (
        <div className="absolute inset-0 bg-black bg-opacity-95 flex flex-col items-center justify-center z-50">
          {/* Close Button */}
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-pink-400 transition"
          >
            ❌
          </button>

          {/* Video */}
          <video
            controls
            autoPlay
            className="w-full max-w-4xl rounded-xl shadow-2xl"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <p className="mt-4 text-white text-lg italic">
            Made with ❤️ by {wish?.sender || "your friend"}
          </p>
        </div>
      )}
    </div>
  );
}
