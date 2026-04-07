import { createClient } from '../../../lib/supabase/server';
import CollectionsClient from './CollectionsClient';

// Ensure editorial changes to collections are reflected instantly
export const revalidate = 0;

export default async function CollectionsPage() {
  const supabase = await createClient();

  // Fetching the editorial collections for the main showcase
  const { data: initialCollections, error } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Collections fetch error:", error);
  }

  return (
    <CollectionsClient 
      initialCollections={initialCollections || []} 
    />
  );
}