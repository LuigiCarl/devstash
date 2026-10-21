import { getActor } from "@/lib/auth/actor";
import { DashboardShell } from "@/components/dashboard-shell";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AuthenticatedDashboard({children}:{children:React.ReactNode}){
  const actor = await getActor();
  if (!actor) redirect("/login");
  return <DashboardShell user={actor}>{children}</DashboardShell>;
}

function DashboardFallback(){
  return <div className="grid min-h-screen place-items-center"><div className="flex items-center gap-3 text-sm text-[var(--muted)]"><span className="size-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"/>Loading your workspace…</div></div>;
}

export default function Layout({children}:{children:React.ReactNode}){
  return <Suspense fallback={<DashboardFallback/>}><AuthenticatedDashboard>{children}</AuthenticatedDashboard></Suspense>;
}
