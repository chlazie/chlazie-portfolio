"use client";
import { useState, useRef, useEffect } from "react";
import { botData } from "../components/botData";
import { FiMoreVertical } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

// Helpers
const cleanText = (text) => text.toLowerCase().replace(/[^\w\s]/gi, "").trim();
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function Chat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [memory, setMemory] = useState(new Set());
  const [lastTopic, setLastTopic] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSponsors, setShowSponsors] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Load persisted data (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setMessages(JSON.parse(localStorage.getItem("currentChat")) || []);
      setHistory(JSON.parse(localStorage.getItem("chatHistory")) || []);
      setDarkMode(localStorage.getItem("theme") === "dark");
    }
  }, []);

  // Persist messages + auto-scroll
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentChat", JSON.stringify(messages));
    }
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist theme
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.classList.toggle("dark", darkMode);
      localStorage.setItem("theme", darkMode ? "dark" : "light");
    }
  }, [darkMode]);

  // Scroll tracking for "scroll-to-bottom" button
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const onScroll = () => {
      setShowScrollButton(el.scrollTop + el.clientHeight < el.scrollHeight - 120);
    };
    onScroll(); // initial state
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  /** 🔥 Match topics with keyword scoring */
  function matchTopic(userInput) {
    const words = cleanText(userInput).split(/\s+/);
    let bestMatch = null;
    let highestScore = 0;

    for (const item of botData) {
      let score = 0;
      for (const keyword of item.question) {
        if (words.some((word) => word.includes(cleanText(keyword)))) score++;
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }
    return bestMatch;
  }

  /** 🔥 Smarter bot replies with memory + vague handling */
  function getBotReply(userInput) {
    const cleanedInput = cleanText(userInput);
    const vague = ["tell me more", "more info", "more details", "and", "what else", "continue"];

    // If user wants continuation
    if (lastTopic && vague.some((p) => cleanedInput.includes(p))) {
      return getRandomItem(lastTopic.details) || "That’s all I’ve got for now! 😅";
    }

    const match = matchTopic(userInput);
    if (!match) {
      // fallback playful response
      const fallbacks = [
        "Hmm 🤔 I don’t have that in my memory… but ask me about projects, skills, or even Klaizee’s fav snack.",
    "Error 404: Answer not found. But hey, Klaizee’s portfolio *is* found 👀",
    "That’s above my pay grade, chief. But I *can* show you some dope projects 🚀",
    "You throw words at me, I throw portfolio facts back 🔄",
    "Not sure about that, but Klaizee definitely knows Next.js, Tailwind, and how to debug at 3am 💻☕",
      ];
      return getRandomItem(fallbacks);
    }

    const topicKey = match.question[0];
    if (memory.has(topicKey)) {
      return `Déjà vu? 😉 We already covered that — but here’s another spin: ${getRandomItem(match.answer)}`;
    }

    // Update memory + last topic
    setMemory((prev) => new Set(prev).add(topicKey));
    setLastTopic(match);

    return getRandomItem(match.answer);
  }

  function sendMessage() {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botReply = getBotReply(userMessage.content);
      setMessages((prev) => [...prev, { role: "assistant", content: botReply }]);
      setLoading(false);
    }, 1000);
  }

  function newChat() {
    if (messages.length) {
      const updatedHistory = [...history, messages];
      setHistory(updatedHistory);
      localStorage.setItem("chatHistory", JSON.stringify(updatedHistory));
    }
    setMessages([]);
    setMemory(new Set());
    setLastTopic(null);
    setMenuOpen(false);
  }

  function restoreChat(chat) {
    setMessages(chat);
    setShowHistory(false);
  }

  function clearAllHistory() {
    setHistory([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatHistory");
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-lg flex items-center justify-center text-2xl"
      >
        💬
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              className={`relative rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden transition-colors duration-300 h-[80vh] ${
                darkMode ? "bg-black text-white" : "bg-white text-black"
              }`}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 bg-red-600 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src="/bot.png"
                    alt="KlaizeeBot"
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div>
                    <h2 className="text-lg font-bold">KlaizeeBot</h2>
                    <p className="text-sm text-red-100">Your stylish portfolio guide</p>
                  </div>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpen((p) => !p)} className="text-white text-2xl">
                    <FiMoreVertical />
                  </button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 bg-black text-white rounded-lg shadow-lg overflow-hidden z-50 min-w-[180px]"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <button onClick={newChat} className="block w-full px-4 py-2 hover:bg-red-700">
                          🆕 New Chat
                        </button>
                        <button
                          onClick={() => setDarkMode(!darkMode)}
                          className="block w-full px-4 py-2 hover:bg-red-700"
                        >
                          🌗 Toggle Theme
                        </button>
                        <button onClick={() => setShowSponsors(true)} className="block w-full px-4 py-2 hover:bg-red-700">
                          🏆 Sponsors
                        </button>
                        <button onClick={() => setShowHistory(true)} className="block w-full px-4 py-2 hover:bg-red-700">
                          📜 Chat History
                        </button>
                        <button onClick={() => setIsOpen(false)} className="block w-full px-4 py-2 hover:bg-red-700">
                          ❌ Exit
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Intro */}
              <div className="p-4 text-center border-b border-gray-700">
                <img
                  src="/bot.png"
                  alt="KlaizeeBot"
                  className="w-24 h-24 mx-auto rounded-full border-4 border-red-600"
                />
                <p className="mt-3 italic">Hi! I’m KlaizeeBot — Ask me anything about my work, skills, or life 🚀</p>
              </div>

              {/* Messages */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg max-w-[80%] ${
                      m.role === "user"
                        ? "bg-red-600 ml-auto text-white"
                        : darkMode
                        ? "bg-gray-800"
                        : "bg-gray-200"
                    }`}
                  >
                    {m.content}
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-center gap-1 text-gray-400 italic">
                    🤔
                    <motion.span className="text-lg" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>
                      •
                    </motion.span>
                    <motion.span
                      className="text-lg"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    >
                      •
                    </motion.span>
                    <motion.span
                      className="text-lg"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    >
                      •
                    </motion.span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Scroll-to-bottom */}
              {showScrollButton && (
                <button
                  onClick={() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                  className="absolute bottom-24 right-6 bg-red-600 text-white p-2 flex justify-center items-center rounded-full shadow-lg hover:bg-red-700 transition"
                  aria-label="Scroll to bottom"
                  title="Scroll to bottom"
                >
                  <lord-icon
      src="https://cdn.lordicon.com/xcrjfuzb.json"
      trigger="hover"
      colors="primary:#ffffff"
      style={{ width: "28px", height: "28px" }}
    ></lord-icon>
                </button>
              )}

              {/* Input */}
              <div className="flex border-t border-gray-700">
                <input
                  className={`flex-1 p-3 ${
                    darkMode ? "bg-black text-white" : "bg-white text-black"
                  } placeholder-gray-400 focus:outline-none`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="px-5 bg-red-600 hover:bg-red-700 transition text-white"
                >
                  Send
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sponsors Modal */}
      <AnimatePresence>
        {showSponsors && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowSponsors(false)}
          >
            <motion.div
              className="bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full shadow-xl text-center border-2 border-red-600"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-red-600">Sponsors</h2>
              <p className="mt-3">Shoutout to the legends who make this portfolio possible ❤️</p>
              <ul className="mt-4 space-y-2">
                <li>🚀 Vercel — deployment</li>
                <li>🎨 Tailwind — styles</li>
                <li>🤖 Your brain — ideas</li>
              </ul>
              <button
                onClick={() => setShowSponsors(false)}
                className="mt-5 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowHistory(false)}
          >
            <motion.div
              className="bg-white dark:bg-black rounded-2xl p-6 max-w-md w-full shadow-xl border-2 border-red-600"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-red-600">Chat History</h2>
                {history.length > 0 && (
                  <button
                    onClick={clearAllHistory}
                    className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    title="Clear all history"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <p className="mt-3 text-gray-500">No chats yet</p>
              ) : (
                <ul className="mt-4 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {history.map((chat, i) => (
                    <li
                      key={i}
                      onClick={() => restoreChat(chat)}
                      className="p-3 rounded-lg border border-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition"
                      title="Restore this chat"
                    >
                      {chat[0]?.content?.slice(0, 40) || `Chat #${i + 1}`}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Custom Scrollbar */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #dc2626 #111;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #dc2626;
          border-radius: 8px;
          border: 2px solid #111;
        }
      `}</style>
    </>
  );
}
