import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 bg-ink-950/[0.015] p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  );
}
