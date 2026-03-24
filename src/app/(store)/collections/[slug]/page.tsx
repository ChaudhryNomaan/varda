import { createClient } from '../../../../lib/supabase/server';
// Ensure this points specifically to CategoryClient.tsx in the same folder
import CategoryClient from '././CategoryClient'; 

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Await the slug for Next.js 15 compatibility
  const { slug } = await params;
  const supabase = await createClient();

  // 2. Fetch all products for this category on the server
  // This prevents the "Syncing" screen from appearing on the client side
  const { data: initialProducts, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', slug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Archive fetch error:", error);
  }

  // 3. Pass the data to the Client Component
  // The UI will now render instantly because the data is already present
  return (
    <CategoryClient 
      slug={slug} 
      initialProducts={initialProducts || []} 
    />
  );
}