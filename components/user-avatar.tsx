"use client";

import { useState } from "react";

export function UserAvatar({ image, name, email, size = "md" }: {
  image?: string | null;
  name?: string | null;
  email?: string | null;
  size?: "md" | "lg";
}) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const label = name ?? email ?? "User";
  const initials = label.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase();
  const sizeClass = size === "lg" ? "size-14 text-base" : "size-8 text-xs";

  if (image && failedImage !== image) {
    // Google profile-image hosts are dynamic, so a native image avoids an unsafe wildcard optimizer rule.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={`${label} profile photo`} width={size === "lg" ? 56 : 32} height={size === "lg" ? 56 : 32} referrerPolicy="no-referrer" onError={() => setFailedImage(image)} className={`${sizeClass} shrink-0 rounded-full object-cover ring-1 ring-[var(--line)]`} />;
  }

  return <span role="img" aria-label={`${label} profile`} className={`grid ${sizeClass} shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-700 font-bold text-white`}>{initials || "U"}</span>;
}
