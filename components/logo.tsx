import Image from "next/image";

export function Logo({ compact = false, size = "md" }: { compact?: boolean; size?: "md" | "lg" }) {
  const imageSize = size === "lg" ? 64 : 42;
  return <div className="flex items-center gap-2.5" aria-label={compact ? "DevStash" : undefined}>
    <Image src="/devstashlogo.png" alt={compact ? "DevStash" : ""} width={imageSize} height={imageSize} priority className={`${size === "lg" ? "size-16" : "size-10"} shrink-0 object-contain drop-shadow-[0_8px_18px_rgba(109,40,217,.35)]`} />
    {!compact && <span className="text-lg font-bold tracking-tight">DevStash</span>}
  </div>;
}
