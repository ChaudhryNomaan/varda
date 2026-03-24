import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({ 
  subsets: ["latin", "cyrillic"], 
  variable: '--font-inter' 
});

const playfair = Playfair_Display({ 
  subsets: ["latin", "cyrillic"], 
  style: ['italic'], 
  variable: '--font-playfair' 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="ru" 
      suppressHydrationWarning 
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="bg-[#0A0A0A] text-bone antialiased">
        {children} 
      </body>
    </html>
  );
}