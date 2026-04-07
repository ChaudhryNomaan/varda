import { createClient } from '../../../../lib/supabase/server'; 
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

// Ensure the product details reflect real-time sale status
export const revalidate = 0;

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Await params for Next.js 15/16 compatibility
  const { id } = await params;
  const supabase = await createClient();

  // 2. Fetch product with full metadata (including is_on_sale and old_price)
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Clean 404 handling to maintain luxury UX
  if (error || !product) {
    return notFound();
  }

  // 4. Render the Client component with the Sales Tracking logic
  return (
    <main className="bg-bone min-h-screen">
      <ProductDetailsClient product={product} />
    </main>
  );
}