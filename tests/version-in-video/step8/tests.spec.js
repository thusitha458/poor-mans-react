import { basename, dirname } from "path";
// @ts-check
import { expect, test } from "@playwright/test";

import { fileURLToPath } from "url";
import { getTestDirectoryPath } from "../../utils.cjs";

const getParentDirectory = () => {
  return basename(dirname(fileURLToPath(import.meta.url)));
};

test.describe("Step 8", () => {
  test("should render a div with text", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step1.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
    expect(
      await page.getByText("Hello, World!").evaluate((node) => node?.nodeName)
    ).toBe("DIV");
  });

  test("should render a h1 with text", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step2.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
    expect(
      await page.getByText("Hello, World!").evaluate((node) => node?.nodeName)
    ).toBe("H1");
  });

  test("should render a functional component", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step3.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
  });

  test("should render children who are functional components, objects etc", async ({
    page,
  }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step4.html`
    );
    await expect(page.getByText("Hello, World!").nth(0)).toBeVisible();
    await expect(page.getByText("Hello, World!").nth(1)).toBeVisible();
    await expect(page.getByText("Just a div")).toBeVisible();
    await expect(page.getByText("Just a text")).toBeVisible();
  });

  test("should render React class components", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step5.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
  });

  test("should work as before", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step6.html`
    );
    await expect(page.getByText("Hello, World!").nth(0)).toBeVisible();
    await expect(page.getByText("Hello, World!").nth(1)).toBeVisible();
    await expect(page.getByText("Just a div")).toBeVisible();
    await expect(page.getByText("Just a text")).toBeVisible();
  });

  test("should be able to use props for a functional component", async ({
    page,
  }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step7.html`
    );
    await expect(page.getByText("Hello, Thusitha!")).toBeVisible();
  });

  test("should be able to use props for a class component", async ({
    page,
  }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/version-in-video/${getParentDirectory()}/step8.html`
    );
    await expect(page.getByText("Hello, Thusitha!")).toBeVisible();
  });
});
