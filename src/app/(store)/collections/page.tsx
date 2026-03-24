import { createClient } from '../../../lib/supabase/server';
import CollectionsClient from '././CollectionsClient'; // This must match the filename above

export default async function CollectionsPage() {
  const supabase = await createClient();

  const { data: initialCollections } = await supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: true });

  return <CollectionsClient initialCollections={initialCollections || []} />;
}