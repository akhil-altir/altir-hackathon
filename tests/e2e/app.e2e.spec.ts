import { expect, test } from "@playwright/test";

async function login(page: Parameters<typeof test>[0]["page"], email: string, password: string) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: /email/i }).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /continue/i }).click();
}

test.describe("Altir Tech Day Command Center e2e", () => {
  test("public pages load", async ({ page }) => {
    await page.goto("/leaderboard");
    await expect(page.getByRole("heading", { name: /Live energy board/i })).toBeVisible();

    await page.goto("/gallery");
    await expect(page.getByRole("heading", { name: /Submission gallery/i })).toBeVisible();

    await page.goto("/tv");
    await expect(page.getByRole("heading", { name: /Altir Tech Day is live/i })).toBeVisible();
  });

  test("participant without team is sent to team creation", async ({ page }) => {
    await login(page, "tallagadda@altir.co", "tallagadda");
    await expect(page).toHaveURL(/\/teams\/new$/);
    await expect(page.getByRole("heading", { name: /Pick yourself \+ one partner/i })).toBeVisible();
  });

  test("participant with team sees workspace", async ({ page }) => {
    await login(page, "osreenivasan@altir.co", "osreenivasan");
    await expect(page).toHaveURL(/\/teams\/prompt-ops$/);
    await expect(page.getByText("Command Center Copilot")).toBeVisible();
  });

  test("admin can access admin surface", async ({ page }) => {
    await login(page, "akhil@altir.co", "akhil");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByRole("heading", { name: /Run the event without touching SQL/i })).toBeVisible();
  });

  test("judge can open scoring console and submit scores", async ({ page }) => {
    await login(page, "asarraf@altir.co", "asarraf");
    await expect(page).toHaveURL(/\/judge$/);

    await page.getByRole("link", { name: /Prompt Ops/i }).first().click();
    await expect(page).toHaveURL(/\/judge\/prompt-ops$/);
    await expect(page.getByRole("heading", { name: /Score Prompt Ops/i })).toBeVisible();

    const inputs = page.locator('input[type="number"]');
    const count = await inputs.count();
    for (let i = 0; i < count; i += 1) {
      await inputs.nth(i).fill("8");
    }

    await page.getByRole("button", { name: /Save scores/i }).click();
    await expect(page).toHaveURL(/\/judge$/);
  });
});
