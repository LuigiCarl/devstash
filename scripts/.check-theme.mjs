import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const page = await browser.newPage({ colorScheme: "light" });
await page.goto("http://localhost:3000/login");
await page.getByRole("button", { name: /Explore as guest/i }).click();
await page.waitForURL("**/dashboard");
const toggle = page.getByRole("button", { name: "Toggle theme" });
const before = await page.locator("html").getAttribute("class");
await toggle.click();
const afterFirst = await page.locator("html").getAttribute("class");
await page.reload();
const afterReload = await page.locator("html").getAttribute("class");
await toggle.click();
const afterSecond = await page.locator("html").getAttribute("class");
await page.request.delete("http://localhost:3000/api/guest");
console.log(JSON.stringify({ before, afterFirst, afterReload, afterSecond }));
await browser.close();
