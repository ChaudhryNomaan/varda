// File Path: src/app/(store)/collections/sale/page.tsx

import { createClient } from '../../../lib/supabase/server';
import CollectionsClient from './CollectionsClient';

export const revalidate = 0;

export default async function SalePage() {
  const supabase = await createClient();

  // "İndirim" (Sale) ürünlerini çekiyoruz
  const { data: saleProducts, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_on_sale', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Sale fetch error:", error);
  }

  return (
    <main className="min-h-screen bg-bone pt-24">
      {/* If CollectionsClient accepts a title prop, you should pass "İndirim" here. 
        Example: <CollectionsClient title="İndirim" initialProducts={saleProducts || []} />
      */}
      <CollectionsClient initialProducts={saleProducts || []} />
    </main>
  );
}