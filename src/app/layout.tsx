import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="ru" 
      suppressHydrationWarning 
      className="inter-var playfair-var"
    >
      <head>
        {/* Bypass Next.js font bug with a direct stable link */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Playfair+Display:ital,wght@1,400..900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-playfair: 'Playfair Display', serif;
          }
        `}</style>
      </head>
      <body className="bg-[#0A0A0A] text-bone antialiased">
        {children} 
      </body>
    </html>
  );
}