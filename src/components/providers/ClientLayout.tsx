"use client";
import { CartProvider } from "../../context/CartContext";
import { Navbar } from "../layout/Navbar";

export default function ClientLayout({ 
  children, 
  adminData 
}: { 
  children: React.ReactNode; 
  adminData: any;
}) {
  return (
    <CartProvider>
      <Navbar adminData={adminData} />
      <main>{children}</main>
    </CartProvider>
  );
}