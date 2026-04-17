// File Path: src/app/(store)/collections/[slug]/page.tsx

import { createClient } from '../../../../lib/supabase/server';
import CategoryClient from './CategoryClient'; 

export const revalidate = 0; 

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Tüm ürünleri çekiyoruz; filtreleme ve kategori mantığı 
  // Turkish localization destekli CategoryClient tarafında yönetiliyor.
  const { data: initialProducts, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Kategori verisi çekilemedi:", error);
  }

  return (
    <main className="bg-bone min-h-screen">
      <CategoryClient 
        slug={slug} 
        initialProducts={initialProducts || []} 
      />
    </main>
  );
}