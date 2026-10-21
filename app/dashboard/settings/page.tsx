import { getActor } from "@/lib/auth/actor";
import { SettingsClient } from "@/components/settings-client";
import { Suspense } from "react";
import { connection } from "next/server";
async function SettingsContent(){await connection();const actor=await getActor();if(!actor)return null;return <SettingsClient actor={actor}/>}
export default function Settings(){return <Suspense fallback={<div className="h-72 animate-pulse rounded-2xl bg-[var(--panel)]"/>}><SettingsContent/></Suspense>}
