import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { useEffect, useState } from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'rainbow'>('dark');

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('lumaen-theme') as 'light' | 'dark' | 'rainbow' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (themeValue: 'light' | 'dark' | 'rainbow') => {
    const root = document.documentElement;
    if (themeValue === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    if (themeValue === 'rainbow') {
      root.classList.add('rainbow-mode');
    } else {
      root.classList.remove('rainbow-mode');
    }
  };

  if (!mounted) return null;

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} theme={theme} setTheme={setTheme} />
    </SessionProvider>
  );
}
