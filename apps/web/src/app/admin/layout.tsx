import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/server/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-safaridark">
      <AdminSidebar />
      <main className="pl-64">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}