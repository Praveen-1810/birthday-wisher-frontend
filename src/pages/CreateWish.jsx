import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import instructionVideo from "../videos/instructions.mp4";
import {
  Sparkles,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Copy,
  Video as VideoIcon,
  Info,
  X,
  MessageCircle, // New import for feedback icon
  Send, // New import for send icon
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function CreateWish() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sender, setSender] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [previewVideo, setPreviewVideo] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [feedback, setFeedback] = useState(""); // New state for feedback message
  const [feedbackStatus, setFeedbackStatus] = useState(null); // New state for feedback status ('success', 'error', or null)

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      setError("You can upload only up to 3 images!");
      e.target.value = "";
      return;
    }
    setError("");
    setImages(files);
  };

  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setPreviewVideo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || !sender.trim()) {
      // Replaced alert() with a custom message box for better UX
      // This is a simple example; you can build a more complex modal.
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 flex items-center justify-center z-50 p-4';
      messageBox.innerHTML = `
        <div class="bg-white/90 backdrop-blur rounded-lg p-6 text-center shadow-lg">
          <p class="text-lg font-semibold text-gray-800 mb-4">Please fill in all required fields.</p>
          <button class="px-4 py-2 bg-pink-500 text-white rounded-md">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      messageBox.querySelector('button').onclick = () => document.body.removeChild(messageBox);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("message", message);
      formData.append("sender", sender);
      images.forEach((f) => formData.append("images", f));
      if (video) formData.append("video", video);

      const res = await axios.post(`${API_BASE}/api/wish`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setLink(res.data.link || `${window.location.origin}/wish/${res.data._id}`);
      setName('');
      setMessage('');
      setSender('');
      setImages([]);
      setVideo(null);
      setPreviewVideo('');
      
    } catch (err) {
      console.error("Create wish error:", err.response?.data || err.message);
      // Replaced alert() with a custom message box
      const messageBox = document.createElement('div');
      messageBox.className = 'fixed inset-0 flex items-center justify-center z-50 p-4';
      messageBox.innerHTML = `
        <div class="bg-white/90 backdrop-blur rounded-lg p-6 text-center shadow-lg">
          <p class="text-lg font-semibold text-red-500 mb-4">Failed to create wish.</p>
          <p class="text-sm text-gray-600 mb-4">Check console for details.</p>
          <button class="px-4 py-2 bg-pink-500 text-white rounded-md">OK</button>
        </div>
      `;
      document.body.appendChild(messageBox);
      messageBox.querySelector('button').onclick = () => document.body.removeChild(messageBox);
      
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    // Replaced alert() with a custom message box
    const messageBox = document.createElement('div');
    messageBox.className = 'fixed inset-0 flex items-center justify-center z-50 p-4';
    messageBox.innerHTML = `
      <div class="bg-white/90 backdrop-blur rounded-lg p-6 text-center shadow-lg">
        <p class="text-lg font-semibold text-gray-800 mb-4">Link copied to clipboard!</p>
        <button class="px-4 py-2 bg-green-500 text-white rounded-md">OK</button>
      </div>
    `;
    document.body.appendChild(messageBox);
    messageBox.querySelector('button').onclick = () => document.body.removeChild(messageBox);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackStatus(null);
    if (!feedback.trim()) return;

    try {
      await axios.post(`${API_BASE}/api/feedback`, { feedback });
      setFeedbackStatus("success");
      setFeedback("");
    } catch (err) {
      setFeedbackStatus("error");
      console.error("Error submitting feedback:", err);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-10 flex items-center justify-center overflow-hidden">
      {/* Floating Sparkles Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"
      />

      <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full relative z-10">
        {/* Left - Form */}
        <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20"
          >
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-2 mb-6">
              <Sparkles className="text-yellow-300" /> Create a Birthday Wish 🎉
            </h1>

            {/* Instructions Button */}
            <motion.button
              onClick={() => setShowInstructions(true)}
              className="absolute top-4 right-4 text-white hover:text-yellow-300 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Watch Instructions"
            >
              <Info size={28} />
            </motion.button>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Recipient */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Recipient's Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-pink-400 outline-none"
                  placeholder="e.g. Praveen"
                />
              </div>

              {/* Sender */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Your Name
                </label>
                <input
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none"
                  placeholder="e.g. Your Name"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Your Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="5"
                  className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-purple-400 outline-none"
                  placeholder="Type a loving birthday message..."
                />
              </div>

              {/* Upload Images */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Images (max 3)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFiles}
                    className="text-white"
                  />
                  <Upload className="text-white" />
                </div>

                {error && (
                  <p className="mt-2 text-red-300 flex items-center gap-2 text-sm">
                    <AlertCircle size={16} /> {error}
                  </p>
                )}

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {images.map((f, i) => (
                      <motion.img
                        key={i}
                        src={URL.createObjectURL(f)}
                        alt="preview"
                        className="w-full h-24 object-cover rounded-xl shadow-lg border border-white/30"
                        whileHover={{ scale: 1.1 }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Upload Video */}
              <div>
                <label className="block text-sm font-semibold text-white mb-1">
                  Surprise Video
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={handleVideo}
                    className="text-white"
                  />
                  <VideoIcon className="text-white" />
                </div>

                {previewVideo && (
                  <video
                    src={previewVideo}
                    controls
                    className="mt-4 w-full rounded-xl shadow-lg border border-white/30"
                  />
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 text-white font-bold shadow-lg"
                disabled={loading}
              >
                {loading ? "Uploading..." : "✨ Generate Wish Link"}
              </motion.button>
            </form>
          </motion.div>
        </Tilt>

        {/* Right - Preview */}
        <Tilt glareEnable={true} glareMaxOpacity={0.5} scale={1.08}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 border border-white/20 flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              How it looks ✨
            </h2>
            <p className="text-white/80 mb-6">
              Please dont use this web on mobiles , use this web in laptops or computers. After creating, copy the generated link and open it to view the wish.
            </p>

            {link && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="mt-6 p-5 rounded-xl bg-gradient-to-r from-green-400 via-emerald-500 to-teal-600 shadow-lg text-white"
              >
                <p className="font-semibold mb-2 flex items-center gap-2">
                  <LinkIcon /> Your shareable link:
                </p>
                <div className="flex items-center justify-between bg-white/20 px-3 py-2 rounded-lg">
                  <a
                    className="underline break-all hover:text-yellow-300 transition text-sm"
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link}
                  </a>
                  <button
                    onClick={handleCopy}
                    className="ml-3 flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg hover:bg-black/50 transition text-xs"
                  >
                    <Copy size={14} /> Copy
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </Tilt>
      </div>

      {/* Instructions Video Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl max-w-4xl w-full p-6"
            >
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Close"
              >
                <X size={28} />
              </button>
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                🎬 How to Create a Wish
              </h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-white/30">
                <video
                  src={instructionVideo}
                  controls
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="mt-4 text-white/80 text-center">
                Watch this short video to learn how to make a perfect birthday wish!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New Feedback Section at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-lg z-20"
      >
        <form
          onSubmit={handleFeedbackSubmit}
          className="backdrop-blur-xl bg-white/10 rounded-xl shadow-2xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <MessageCircle /> Share Your Feedback
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Tell us what you think or suggest new features!
          </p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows="3"
            className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white/20 text-white placeholder-gray-200 focus:ring-2 focus:ring-teal-400 outline-none"
            placeholder="Your feedback..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="mt-4 w-full py-3 rounded-xl bg-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg"
          >
            <Send size={18} /> Send Feedback
          </motion.button>

          <AnimatePresence>
            {feedbackStatus === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 text-sm text-green-300 text-center"
              >
                Thank you for your feedback!
              </motion.p>
            )}
            {feedbackStatus === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 text-sm text-red-300 text-center"
              >
                Failed to send feedback. Please try again.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}