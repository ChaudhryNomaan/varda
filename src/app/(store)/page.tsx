import { Hero } from "../../components/sections/Hero";
import { ProductFeed } from "../../components/sections/ProductFeed";
import { createClient } from "../../lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch Hero Config
  const { data: heroConfig } = await supabase
    .from('site_config')
    .select('content')
    .eq('key', 'hero')
    .single();

  // STRICT FETCH: Only T-shirts or items on Sale
  const { data: products } = await supabase
    .from('products')
    .select('*')
    // Logical filter: must be in t-shirts category OR is_on_sale must be true
    .or('category.eq.t-shirts,is_on_sale.eq.true')
    .order('created_at', { ascending: false })
    .limit(8);

  return (
    <main className="bg-[#0A0A0A] min-h-screen">
      <Hero data={heroConfig?.content} />
      
      {/* Passing vardated data to the themed component */}
      <ProductFeed initialProducts={products || []} />
    </main>
  );
}