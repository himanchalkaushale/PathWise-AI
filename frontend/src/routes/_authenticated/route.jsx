import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSession } from "@/lib/auth.functions.js";
import AppSidebar, { TopBar } from "@/components/AppSidebar.jsx";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const res = await getSession();
    if (!res || !res.user) throw redirect({ to: "/auth" });
    return { user: res.user };
  },
  component: Layout,
});

function Layout() {
  return (
    <div className="min-h-dvh bg-[color:var(--color-background)] text-[color:var(--color-foreground)] font-sans">
      <AppSidebar />
      <div className="lg:pl-60">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
