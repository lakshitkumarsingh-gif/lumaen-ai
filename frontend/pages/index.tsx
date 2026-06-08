import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiZap, FiBrain, FiLayers, FiShield } from 'react-icons/fi';

const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark' | 'rainbow'>('dark');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const features = [
    {
      icon: FiBrain,
      title: 'Neural Memory',
      description: 'Your AI learns from every conversation, building a personalized knowledge graph.',
    },
    {
      icon: FiZap,
      title: 'Smart Routing',
      description: 'Automatically routes queries to GPT, Claude, or Gemini based on context.',
    },
    {
      icon: FiLayers,
      title: 'Deep Research',
      description: 'Conduct thorough research with integrated search and analysis capabilities.',
    },
    {
      icon: FiShield,
      title: 'Privacy First',
      description: 'Your data stays yours. End-to-end encryption and local processing.',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for trying LUMAEN',
      features: ['5 chats/day', 'Basic memory', 'Light theme only', 'Community support'],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'For serious learners',
      features: ['Unlimited chats', 'Full memory graph', 'All 3 themes', 'Priority support', 'Deep research'],
      cta: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: '$24.99',
      period: '/month',
      description: 'For professionals',
      features: ['Everything in Pro', 'Custom AI models', 'Team collaboration', 'API access', 'Advanced analytics'],
      cta: 'Get Premium',
      highlighted: false,
    },
    {
      name: 'InfinityBro',
      price: '$99.99',
      period: '/month',
      description: 'For enterprises',
      features: ['Everything', 'Dedicated support', 'Custom deployment', 'White-label options', 'SLA guarantee'],
      cta: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="min-h-screen dark:bg-gradient-to-b dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass dark:glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiBrain className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              LUMAEN
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-primary-600 transition-colors">Pricing</a>
            <a href="#about" className="hover:text-primary-600 transition-colors">About</a>
          </div>

          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              Login
            </motion.button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold">
              ✨ AI-Powered Knowledge Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight ${
              theme === 'rainbow' ? 'rainbow-glow' : 'dark:text-white'
            }`}
          >
            One Brain.<br />Every AI.<br />Your Knowledge.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Meet LUMAEN—your adaptive AI companion that learns from your conversations, routes queries to the best AI model,
            and builds your personal knowledge graph. Tutoring, research, coding, writing—all in one brain.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-xl transition-shadow"
              >
                Start Free <FiArrowRight />
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            >
              Watch Demo
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b dark:from-dark-900/50 dark:to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 dark:text-white">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Everything you need to harness the power of multiple AI models in one intelligent platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 rounded-lg glass dark:glass-dark hover:shadow-lg transition-shadow"
                >
                  <Icon className="text-2xl text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Creator Story Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 dark:text-white">The Story Behind LUMAEN</h2>
            <div className="prose dark:prose-invert max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Hi, I'm Lakshit Singh, a 24-year-old developer and student who faced a constant problem during my tutoring journey:
                constantly switching between ChatGPT for coding, Claude for writing, and Google Gemini for research was draining.
                I wished for one AI that could do it all, learn from me, and remember what matters.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                That's why I built LUMAEN. It's not just another AI chatbot—it's your personal brain that learns, adapts,
                and intelligently routes your questions to the best AI model for the job. With a neural memory graph,
                deep research capabilities, and a beautiful, intuitive interface, LUMAEN is the AI companion every student,
                researcher, and professional needs.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mt-4 font-semibold">
                My vision: Make LUMAEN the billion-dollar platform that transforms how people learn and work with AI.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b dark:from-dark-900/50 dark:to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Choose the plan that fits your needs. All plans include core features. Upgrade anytime.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-xl p-8 transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl scale-105'
                    : 'glass dark:glass-dark'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm ml-2">{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlighted ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center gap-2">
                      <FiStar className="w-4 h-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.highlighted
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-900'
                  }`}
                >
                  {plan.cta}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-12 text-white"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Power Your Brain?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students, researchers, and professionals using LUMAEN to amplify their intelligence.
          </p>
          <Link href="/auth/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Your Free Trial Today
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <FiBrain className="text-white" />
                </div>
                <span className="font-bold dark:text-white">LUMAEN</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">One Brain. Every AI. Your Knowledge.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p>© 2024 LUMAEN. Built with ❤️ by Lakshit Singh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
