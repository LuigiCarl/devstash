import Image from "next/image";

export function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-2.5" aria-label={compact ? "DevStash" : undefined}>
    <Image src="/devstashlogo.png" alt={compact ? "DevStash" : ""} width={42} height={42} priority className="size-10 shrink-0 object-contain drop-shadow-[0_6px_12px_rgba(109,40,217,.28)]" />
    {!compact && <span className="text-lg font-bold tracking-tight">DevStash</span>}
  </div>;
}
