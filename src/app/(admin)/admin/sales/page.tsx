import { createClient } from '../../../../lib/supabase/server';
import SalesDashboardClient from './SalesDashboardClient';

export default async function SalesAnalyticsPage() {
  const supabase = await createClient();

  // Fetch all sales data once on the server
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <div className="p-10 text-espresso italic">Archive error: {error.message}</div>;

  return <SalesDashboardClient initialOrders={orders || []} />;
}