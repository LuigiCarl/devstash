import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function AuthenticatedDashboard({children}:{children:React.ReactNode}){
  await connection();
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}

function DashboardFallback(){
  return <div className="grid min-h-screen place-items-center"><div className="flex items-center gap-3 text-sm text-[var(--muted)]"><span className="size-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"/>Loading your workspace…</div></div>;
}

export default function Layout({children}:{children:React.ReactNode}){
  return <Suspense fallback={<DashboardFallback/>}><AuthenticatedDashboard>{children}</AuthenticatedDashboard></Suspense>;
}
