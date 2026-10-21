import { expect, test, type Page } from "@playwright/test";

async function enterGuest(page: Page) {
  await page.goto("/login");
  await page.getByRole("button", { name: /guest/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("link", { name: "Bookmarks" })).toBeVisible({ timeout: 15_000 });
}

test.describe("guest workspace", () => {
  test("enters a private guest workspace", async ({ page }) => {
    await enterGuest(page);
    await expect(page.getByText("Guest workspace")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("link", { name: "Bookmarks" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Collections" })).toBeVisible();
  });

  test("creates, renames, and deletes a collection through dialogs", async ({ page }) => {
    await enterGuest(page);
    await page.getByRole("link", { name: "Collections" }).click();
    await expect(page).toHaveURL(/\/dashboard\/collections$/);

    const name = `E2E collection ${Date.now()}`;
    await page.getByRole("button", { name: "New collection" }).click();
    await expect(page.getByRole("dialog", { name: "Create collection" })).toBeVisible();
    await page.getByRole("dialog").getByLabel("Name").fill(name);
    await page.getByRole("dialog").getByRole("button", { name: "Create" }).click();
    await expect(page.getByRole("heading", { name })).toBeVisible();

    await page.getByRole("button", { name: `Rename ${name}` }).click();
    await expect(page.getByRole("dialog", { name: "Rename collection" })).toBeVisible();
    const renamed = `${name} renamed`;
    await page.getByRole("dialog").getByLabel("Name").fill(renamed);
    await page.getByRole("dialog").getByRole("button", { name: "Rename" }).click();
    await expect(page.getByRole("heading", { name: renamed })).toBeVisible();

    await page.getByRole("button", { name: `Delete ${renamed}` }).click();
    await expect(page.getByRole("dialog", { name: "Delete collection?" })).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("heading", { name: renamed })).toHaveCount(0);
  });

  test("creates and deletes a bookmark through the accessible dialog", async ({ page }) => {
    await enterGuest(page);
    await page.getByRole("link", { name: "Bookmarks" }).click();
    const title = `E2E bookmark ${Date.now()}`;
    await page.getByRole("button", { name: "Add bookmark" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Add bookmark" });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Title").fill(title);
    await dialog.getByLabel("URL").fill(`https://example.com/${Date.now()}`);
    await dialog.getByRole("button", { name: "Save" }).click();
    await expect(page.getByRole("link", { name: title })).toBeVisible();

    await page.getByRole("button", { name: "Delete bookmark" }).last().click();
    await expect(page.getByRole("dialog", { name: "Delete bookmark?" })).toBeVisible();
    await page.getByRole("dialog").getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("link", { name: title })).toHaveCount(0);
  });

  test("persists favorite changes through the favorites page", async ({ page }) => {
    await enterGuest(page);
    await page.getByRole("link", { name: "Bookmarks" }).click();
    const title = `E2E favorite ${Date.now()}`;
    await page.getByRole("button", { name: "Add bookmark" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Add bookmark" });
    await dialog.getByLabel("Title").fill(title);
    await dialog.getByLabel("URL").fill(`https://example.com/favorite-${Date.now()}`);
    await dialog.getByLabel("Favorite").check();
    await dialog.getByRole("button", { name: "Save" }).click();
    await page.getByRole("link", { name: "Favorites" }).click();
    await expect(page.getByRole("link", { name: title })).toBeVisible();
    const favoritePatch = page.waitForResponse(response => response.url().includes("/api/bookmarks/") && response.request().method() === "PATCH");
    await page.getByRole("button", { name: "Remove from favorites" }).click();
    expect((await favoritePatch).status()).toBe(200);
    await page.reload();
    await expect(page.getByRole("link", { name: title })).toHaveCount(0);
  });

  test("toggles light and dark themes through header and settings", async ({ page }) => {
    await enterGuest(page);
    const headerToggle = page.getByRole("button", { name: "Toggle theme" });
    await expect(headerToggle).toBeVisible();

    // Toggle from default dark to light
    await headerToggle.click();
    await expect(page.locator("html")).toHaveClass(/light/);

    // Toggle back to dark
    await headerToggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Navigate to settings and toggle via Appearance buttons
    await page.getByRole("link", { name: "Settings" }).click();
    await expect(page).toHaveURL(/\/dashboard\/settings$/);

    const lightBtn = page.getByRole("button", { name: "Light" });
    const darkBtn = page.getByRole("button", { name: "Dark" });

    await lightBtn.click();
    await expect(page.locator("html")).toHaveClass(/light/);

    await darkBtn.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
