// src/app/(store)/page.tsx
import { Hero } from "../../components/sections/Hero";
import { createClient } from "../../lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch the "hero" config you saved in the admin panel
  const { data: heroConfig } = await supabase
    .from('site_config')
    .select('content')
    .eq('key', 'hero')
    .single();

  return (
    <>
      {/* Pass the dynamic content into the Hero component */}
      <Hero data={heroConfig?.content} />
      
      {/* Rest of your AETHER sections */}
    </>
  );
}