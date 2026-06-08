import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="LUMAEN - One Brain. Every AI. Your Knowledge." />
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="dark:bg-dark-950">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
