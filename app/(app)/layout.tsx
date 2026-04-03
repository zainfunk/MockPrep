import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/app/Sidebar";
import MobileTabBar from "@/components/MobileTabBar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen" style={{ background: "var(--surface-0)" }}>
      <Sidebar />

      {/* Main content — offset by sidebar on desktop */}
      <main className="lg:ml-[220px] min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile bottom tab bar (existing component) */}
      <MobileTabBar />

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--surface-2)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-inter)",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}
