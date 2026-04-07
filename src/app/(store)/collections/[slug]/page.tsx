import { createClient } from '../../../../lib/supabase/server';
import CategoryClient from './CategoryClient'; 

// Ensures the shop reflects price changes/sales immediately
export const revalidate = 0; 

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetching products on the server for instant hydration
  const { data: initialProducts, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', slug)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Archive fetch error:", error);
  }

  return (
    <CategoryClient 
      slug={slug} 
      initialProducts={initialProducts || []} 
    />
  );
}