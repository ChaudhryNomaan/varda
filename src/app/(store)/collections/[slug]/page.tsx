import { createClient } from '../../../../lib/supabase/server';
import CategoryClient from './CategoryClient';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // 1. Await the slug for Next.js 15 compatibility
  const { slug } = await params;
  const supabase = await createClient();

  // 2. Fetch all products for this category on the server
  const { data: initialProducts, error } = await supabase
    .from('products')
    .select('*')
    .eq('category', slug)
    .order('created_at', { ascending: false });

  // 3. Pass the data to the Client Component for filtering and UI
  return (
    <CategoryClient 
      slug={slug} 
      initialProducts={initialProducts || []} 
    />
  );
}