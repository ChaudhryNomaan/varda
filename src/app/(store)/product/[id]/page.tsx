import { createClient } from '../../../../lib/supabase/server'; 
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the ID - required in Next.js 15
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  // If product doesn't exist, show a clean 404 instead of a crash
  if (error || !product) return notFound();

  // Send the data to your UI component
  return <ProductDetailsClient product={product} />;
}