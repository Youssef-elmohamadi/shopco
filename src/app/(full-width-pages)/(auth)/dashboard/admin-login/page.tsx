import AdminLoginForm from "@/components/auth/AdminLoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Portal | SHOP.CO Dashboard",
  description: "Secure Administrator Portal",
};

export default function AdminLogin() {
  return <AdminLoginForm />;
}
