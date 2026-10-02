import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Headphones,
  Award,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function SpeakingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [autoSpeech, setAutoSpeech] = useState(true);
  const [level, setLevel] = useState<string>('Cambridge YLE (Starters - Flyers)');
  const [selectedTopic, setSelectedTopic] = useState<string>('Giao tiếp đời sống hàng ngày');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello there! 👋 I am your Belief AI Speaking Coach (powered by Gemini Flash)! Let’s practice English speaking together! What is your name and what do you like to do today? 🌟',
      timestamp: 'Vừa xong',
    },
  ]);

  const speakingTopics = [
    'Tự giới thiệu bản thân & sở thích',
    'Gia đình & Trường học',
    'Luyện phát âm Cambridge YLE',
    'Thử thách IELTS Speaking Part 1',
    'Đóng vai mua sắm & hỏi đường',
  ];

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Text-To-Speech function
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean text of emojis and symbols for speech
    const cleanText = text.replace(/[*#💡🌟👋]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // Slightly slower for language learners
    utterance.pitch = 1.05;

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech. Bạn có thể gõ nội dung vào ô nhập.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start speech recognition', e);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/speaking-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages.slice(-5),
          level,
          topic: selectedTopic,
        }),
      });

      if (!response.ok) {
        throw new Error('API server unavailable');
      }

      const data = await response.json();
      const aiReply = data.reply || 'Great speaking effort! What do you like most about that?';

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: aiReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (autoSpeech) {
        speakText(aiReply);
      }
    } catch {
      // Offline fallback encouragement according to BAC methodology
      const fallbackReplies = [
        `Excellent speaking! 🌟 You did great expressing yourself. 💡 Tip: Try saying "I really enjoy practicing English because it is fun." What is your favorite animal or hobby?`,
        `Good pronunciation! 👏 You are speaking with wonderful confidence. Let's keep going: Can you tell me what you had for breakfast today?`,
        `Awesome job! 🚀 Belief English is proud of your progress. Could you describe your best friend to me in 2 sentences?`,
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];

      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: randomReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, fallbackMsg]);
      if (autoSpeech) {
        speakText(randomReply);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        {!isOpen && (
          <button
            onClick={() => {
              setIsOpen(true);
              if (messages.length === 1 && autoSpeech) {
                speakText(messages[0].content);
              }
            }}
            className="group flex items-center gap-3 bg-gradient-to-r from-[#1e3a8a] via-blue-900 to-[#172554] hover:from-blue-900 hover:to-[#0f172a] text-white pl-3.5 pr-4 py-3 rounded-full shadow-2xl border-2 border-orange-400 hover:scale-105 transition-all duration-300 cursor-pointer"
            aria-label="Mở AI Chatbox Speaking"
          >
            {/* Animated Avatar Icon */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow-md">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider text-orange-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini Flash AI
                </span>
              </div>
              <div className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                <Headphones className="w-3.5 h-3.5 text-orange-300" />
                <span>Luyện Speaking Với AI</span>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Chat Window (Bottom Left) */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[350px] sm:w-[400px] h-[550px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1e3a8a] via-blue-900 to-[#172554] text-white p-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black flex items-center gap-1.5 leading-none">
                  <span>Belief AI Speaking Coach</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-orange-500 text-white uppercase">
                    Flash
                  </span>
                </h3>
                <p className="text-[10px] text-blue-200 mt-1">
                  Phương pháp BAC • Phản xạ & Chữa phát âm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Toggle */}
              <button
                onClick={() => setAutoSpeech(!autoSpeech)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  autoSpeech ? 'text-orange-300 hover:bg-white/10' : 'text-slate-400 hover:bg-white/10'
                }`}
                title={autoSpeech ? 'Đang bật đọc to giọng bản ngữ' : 'Đang tắt giọng đọc'}
              >
                {autoSpeech ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Reset Chat */}
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      role: 'assistant',
                      content:
                        'Hello again! 👋 I am ready to practice English speaking with you! What topic would you like to talk about today?',
                      timestamp: 'Vừa xong',
                    },
                  ]);
                }}
                className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls Bar: Level & Topic Selectors */}
          <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex items-center justify-between gap-2 text-xs">
            <div className="flex-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Cấp độ học viên:</label>
              <select
                value={level}
                onChange={e => setLevel(e.target.value)}
                className="w-full bg-white text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 px-2 py-1 focus:outline-none"
              >
                <option value="Hệ Kindy (Mầm non 3-6T)">Kindy (Mầm non 3-6T)</option>
                <option value="Hệ Ready (Tiểu học 6-9T)">Ready (Tiểu học 6-9T)</option>
                <option value="Cambridge YLE (Starters - Flyers)">Cambridge Starters, Movers, Flyers</option>
                <option value="Cambridge KET & PET (A2 - B1)">Cambridge KET, PET (A2 - B1)</option>
                <option value="IELTS Academic (Band 5.5 - 7.5+)">IELTS Academic (5.5 - 7.5+)</option>
                <option value="Giao tiếp Người lớn & Đi làm">Giao tiếp Người lớn (Adults)</option>
              </select>
            </div>
          </div>

          {/* Quick Suggested Topics */}
          <div className="bg-white border-b border-slate-100 p-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {speakingTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedTopic(topic);
                  handleSendMessage(`Let's practice talking about: "${topic}"! Please ask me a fun question.`);
                }}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer ${
                  selectedTopic === topic
                    ? 'bg-blue-100 text-[#1e3a8a] font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl p-3 shadow-xs space-y-1.5 ${
                    msg.role === 'user'
                      ? 'bg-[#1e3a8a] text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px] opacity-70 border-t border-black/5">
                    <span>{msg.timestamp}</span>

                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => speakText(msg.content)}
                        className="text-orange-600 hover:text-orange-700 flex items-center gap-0.5 font-bold cursor-pointer"
                        title="Nghe lại phát âm"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Nghe</span>
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 w-max shadow-2xs animate-pulse">
                <Bot className="w-4 h-4 text-[#1e3a8a] animate-spin" />
                <span>Belief AI đang lắng nghe và chuẩn bị lời khuyên...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-200">
            {isRecording && (
              <div className="mb-2 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between animate-pulse">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                  Đang ghi âm giọng nói tiếng Anh... (Hãy nói to, rõ ràng)
                </span>
                <button
                  onClick={toggleRecording}
                  className="text-xs font-black underline text-red-800 cursor-pointer"
                >
                  Xong
                </button>
              </div>
            )}

            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* Mic Speech-to-Text Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white shadow-md animate-bounce'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                }`}
                title="Bấm để nói tiếng Anh (Microphone)"
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder="Nói hoặc gõ câu trả lời tiếng Anh..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[#1e3a8a] text-white hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-1.5">
              💡 Bấm vào biểu tượng Microphone để luyện nói trực tiếp bằng tiếng Anh.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
