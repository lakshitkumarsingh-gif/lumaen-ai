import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBrain,
  FiLogOut,
  FiSettings,
  FiSend,
  FiMenu,
  FiX,
  FiPlus,
  FiZap,
  FiBarChart3,
  FiCpu,
} from 'react-icons/fi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

interface Memory {
  id: string;
  content: string;
  importance: number;
  createdAt: Date;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<'light' | 'dark' | 'rainbow'>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedModel, setSelectedModel] = useState<'gpt' | 'claude' | 'gemini'>('gpt');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('lumaen-theme') as 'light' | 'dark' | 'rainbow' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const toggleTheme = (newTheme: 'light' | 'dark' | 'rainbow') => {
    setTheme(newTheme);
    localStorage.setItem('lumaen-theme', newTheme);
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const routeToModel = (query: string): 'gpt' | 'claude' | 'gemini' => {
    const lowerQuery = query.toLowerCase();

    // Simple AI routing logic
    if (
      lowerQuery.includes('code') ||
      lowerQuery.includes('javascript') ||
      lowerQuery.includes('python') ||
      lowerQuery.includes('debug')
    ) {
      return 'gpt'; // GPT for coding
    }

    if (
      lowerQuery.includes('write') ||
      lowerQuery.includes('essay') ||
      lowerQuery.includes('article') ||
      lowerQuery.includes('story')
    ) {
      return 'claude'; // Claude for writing
    }

    if (
      lowerQuery.includes('search') ||
      lowerQuery.includes('research') ||
      lowerQuery.includes('find') ||
      lowerQuery.includes('information')
    ) {
      return 'gemini'; // Gemini for search
    }

    return selectedModel; // Default to selected model
  };

  const generateMockResponse = (userMessage: string, model: 'gpt' | 'claude' | 'gemini'): string => {
    const responses: Record<string, Record<'gpt' | 'claude' | 'gemini', string>> = {
      default: {
        gpt: "I'm Claude (using GPT routing). I can help you with coding, technical questions, and problem-solving. What would you like to know?",
        claude: "I'm Claude. I specialize in writing, creative content, and detailed explanations. How can I assist you today?",
        gemini: "I'm Gemini. I excel at research, finding information, and comprehensive analysis. What would you like me to research?",
      },
    };

    // Store in memory
    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      content: `Q: ${userMessage}`,
      importance: Math.random() * 10,
      createdAt: new Date(),
    };
    setMemories((prev) => [newMemory, ...prev].slice(0, 50));

    return responses.default[model];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Route to appropriate model
    const routedModel = routeToModel(inputValue);
    setSelectedModel(routedModel);

    // Simulate API call
    setTimeout(() => {
      const response = generateMockResponse(inputValue, routedModel);

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        model: routedModel.toUpperCase(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const modelColors: Record<'gpt' | 'claude' | 'gemini', string> = {
    gpt: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    claude: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    gemini: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <FiBrain className="w-8 h-8 text-blue-500" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const userName = session.user?.name?.split(' ')[0] || 'User';

  return (
    <div className="h-screen dark:bg-dark-950 bg-white flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center glass dark:glass-dark">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
          <div className="flex items-center gap-2">
            <FiBrain className="text-blue-500 text-xl" />
            <span className="font-bold dark:text-white hidden sm:inline">LUMAEN</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Selector */}
          <div className="hidden sm:flex gap-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <button
              onClick={() => toggleTheme('light')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                theme === 'light' ? 'bg-white shadow' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => toggleTheme('dark')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                theme === 'dark' ? 'bg-gray-800 shadow text-white' : 'text-gray-600'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => toggleTheme('rainbow')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                theme === 'rainbow' ? 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow' : 'text-gray-600'
              }`}
            >
              🌈
            </button>
          </div>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <FiSettings className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold dark:text-white">Welcome, {userName}!</p>
              <p className="text-xs text-gray-500">{session.user?.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: sidebarOpen ? 0 : -300 }}
          animate={{ x: sidebarOpen ? 0 : -300 }}
          className="hidden lg:flex lg:w-64 border-r border-gray-200 dark:border-gray-800 flex-col p-4 gap-4 overflow-y-auto"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMessages([]);
              setInputValue('');
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
          >
            <FiPlus className="w-4 h-4" /> New Chat
          </motion.button>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2">MEMORY GRAPH</h3>
            <div className="space-y-2">
              {memories.slice(0, 5).map((memory) => (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm truncate"
                >
                  {memory.content.substring(0, 30)}...
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2">AI MODELS</h3>
            <div className="space-y-2">
              {[
                { id: 'gpt', label: 'GPT-4', icon: '🟢' },
                { id: 'claude', label: 'Claude 3', icon: '🟡' },
                { id: 'gemini', label: 'Gemini', icon: '🔵' },
              ].map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id as 'gpt' | 'claude' | 'gemini')}
                  className={`w-full text-left p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedModel === model.id
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {model.icon} {model.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <FiBrain className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                <h2 className="text-2xl font-bold mb-2 dark:text-white">Welcome, {userName}!</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                  Start a conversation. LUMAEN will intelligently route your questions to the best AI model
                  and remember everything for your personalized knowledge graph.
                </p>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                  {[
                    { icon: FiCpu, title: 'Code Help', desc: "→ GPT" },
                    { icon: FiZap, title: 'Write Essay', desc: "→ Claude" },
                    { icon: FiBarChart3, title: 'Research', desc: "→ Gemini" },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        className="p-4 rounded-lg glass dark:glass-dark hover:shadow-lg transition-shadow"
                      >
                        <Icon className="w-6 h-6 mb-2 mx-auto text-blue-500" />
                        <p className="text-sm font-medium dark:text-white">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <AnimatePresence>
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : `rounded-bl-none glass dark:glass-dark ${
                              message.model ? modelColors[message.model.toLowerCase() as 'gpt' | 'claude' | 'gemini'] : ''
                            }`
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.model && `${message.model} • `}
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex gap-2">
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask LUMAEN anything..."
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Selected Model: <span className="font-semibold">{{ gpt: 'GPT-4', claude: 'Claude 3', gemini: 'Gemini' }[selectedModel]}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
