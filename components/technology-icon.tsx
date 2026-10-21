"use client";

import { useState } from "react";
import type { SimpleIcon } from "simple-icons";
import {
  siAngular, siBootstrap, siCss, siDjango, siDocker, siExpress, siFastapi,
  siFigma, siGit, siGithub, siHtml5, siJavascript, siLaravel, siMongodb,
  siMysql, siNextdotjs, siNodedotjs, siOpenjdk, siPhp, siPostgresql,
  siPostman, siPython, siReact, siRedis, siSpringboot, siSqlite, siSvelte,
  siTailwindcss, siTypescript, siVercel, siVuedotjs, siVscodium,
} from "simple-icons/icons";

const icons: Record<string, SimpleIcon> = {
  angular: siAngular, bootstrap: siBootstrap, css: siCss, css3: siCss,
  django: siDjango, docker: siDocker, express: siExpress, expressjs: siExpress,
  fastapi: siFastapi, figma: siFigma, git: siGit, github: siGithub,
  html: siHtml5, html5: siHtml5, java: siOpenjdk, javascript: siJavascript,
  js: siJavascript, laravel: siLaravel, mongodb: siMongodb, mysql: siMysql,
  next: siNextdotjs, "next-js": siNextdotjs, nextjs: siNextdotjs,
  node: siNodedotjs, "node-js": siNodedotjs, nodejs: siNodedotjs,
  php: siPhp, postgresql: siPostgresql, postgres: siPostgresql,
  postman: siPostman, python: siPython, react: siReact, redis: siRedis,
  spring: siSpringboot, "spring-boot": siSpringboot, springboot: siSpringboot,
  sqlite: siSqlite, svelte: siSvelte, tailwind: siTailwindcss,
  "tailwind-css": siTailwindcss, tailwindcss: siTailwindcss,
  typescript: siTypescript, ts: siTypescript, vercel: siVercel,
  vue: siVuedotjs, vuejs: siVuedotjs, vscode: siVscodium,
};

const detectionAliases: Array<[string, string]> = [
  ["amazonaws", "aws"], ["amazon web services", "aws"], ["aws", "aws"], ["ec2", "aws"],
  ["tailwind", "tailwind-css"], ["nextjs", "nextjs"], ["next.js", "nextjs"],
  ["react", "react"], ["vue", "vue"], ["angular", "angular"],
  ["svelte", "svelte"], ["typescript", "typescript"], ["javascript", "javascript"],
  ["nodejs", "nodejs"], ["node.js", "nodejs"], ["python", "python"],
  ["postgres", "postgresql"], ["mysql", "mysql"], ["mongodb", "mongodb"],
  ["redis", "redis"], ["github", "github"], ["docker", "docker"],
  ["vercel", "vercel"], ["figma", "figma"], ["bootstrap", "bootstrap"],
  ["express", "express"], ["laravel", "laravel"], ["django", "django"],
  ["fastapi", "fastapi"], ["spring", "springboot"], ["sqlite", "sqlite"],
  ["postman", "postman"], ["vscode", "vscode"],
];

function isAwsTechnology(slug: string | null, name: string | null, url?: string) {
  const source = `${slug ?? ""} ${name ?? ""} ${url ?? ""}`.toLowerCase();
  return ["aws", "amazon web services", "amazonaws", "ec2"].some(alias => source.includes(alias));
}

function getFaviconUrl(url?: string) {
  if (!url) return null;
  try { return `${new URL(url).origin}/favicon.ico`; }
  catch { return null; }
}

function resolveIcon(slug: string | null, name: string | null, url?: string) {
  const normalizedSlug = slug?.toLowerCase().replaceAll("_", "-");
  if (normalizedSlug && icons[normalizedSlug]) return icons[normalizedSlug];
  const source = `${normalizedSlug ?? ""} ${name ?? ""} ${url ?? ""}`.toLowerCase();
  const match = detectionAliases.find(([alias]) => source.includes(alias));
  return match ? icons[match[1]] : undefined;
}

export function TechnologyIcon({ slug, name, url, color, size = 22 }: {
  slug: string | null; name: string | null; url?: string; color: string | null; size?: number;
}) {
  const [failedFavicon, setFailedFavicon] = useState<string | null>(null);
  const faviconUrl = getFaviconUrl(url);

  if (isAwsTechnology(slug, name, url)) {
    return <svg role="img" aria-label={`${name ?? "AWS"} logo`} width={size} height={size} viewBox="0 0 32 24" fill="none">
      <text x="1" y="15" fill="currentColor" fontSize="13" fontWeight="800" fontFamily="Arial, sans-serif">AWS</text>
      <path d="M3 18.2c6.8 4.1 16.4 4.5 24.2.4" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
      <path d="m24.2 17.1 3.3 1.5-2.1 2.9" stroke="#FF9900" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
  }
  const icon = resolveIcon(slug, name, url);
  if (!icon && faviconUrl && failedFavicon !== faviconUrl) {
    // A native image supports arbitrary user-saved domains without unsafe wildcard image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={faviconUrl} alt={`${name ?? "Website"} favicon`} width={size} height={size} className="rounded-sm object-contain" referrerPolicy="no-referrer" onError={() => setFailedFavicon(faviconUrl)} />;
  }
  if (!icon) return <span aria-label={name ?? "Resource"} className="font-bold">{(name ?? "R").slice(0, 1).toUpperCase()}</span>;
  return <svg role="img" aria-label={`${name ?? icon.title} logo`} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={{ color: `#${color ?? icon.hex}` }}><path d={icon.path} /></svg>;
}
