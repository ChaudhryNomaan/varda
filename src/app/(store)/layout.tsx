import { createClient } from '../../lib/supabase/server';
import { Navbar } from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import { CartProvider } from "../../context/CartContext";
import { CartDrawer } from "../../components/layout/CartDrawer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // Fetch both Navbar and Footer configurations
  const { data: navConfig } = await supabase
    .from('site_config')
    .select('content')
    .eq('key', 'navbar')
    .single();

  const { data: footerConfig } = await supabase
    .from('site_config')
    .select('content')
    .eq('key', 'footer')
    .single();

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        {/* Pass the synced navbar data here */}
        <Navbar adminData={navConfig?.content} />
        <CartDrawer />
        <main className="flex-grow">
          {children}
        </main>
        <Footer data={footerConfig?.content} />
      </div>
    </CartProvider>
  );
}