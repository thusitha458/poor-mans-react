import { basename, dirname } from "path";
// @ts-check
import { expect, test } from "@playwright/test";

import { fileURLToPath } from "url";
import { getTestDirectoryPath } from "../../utils.cjs";

const getParentDirectory = () => {
  return basename(dirname(fileURLToPath(import.meta.url)));
};

test.describe("Step 4", () => {
  test("should render a div with text", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step1.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
    expect(
      await page.getByText("Hello, World!").evaluate((node) => node?.nodeName)
    ).toBe("DIV");
  });

  test("should render a h1 with text", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step2.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
    expect(
      await page.getByText("Hello, World!").evaluate((node) => node?.nodeName)
    ).toBe("H1");
  });

  test("should render a functional component", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step3.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
  });

  test("should render children who are functional components, objects etc", async ({
    page,
  }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step4.html`
    );
    await expect(page.getByText("Hello, World!").nth(0)).toBeVisible();
    await expect(page.getByText("Hello, World!").nth(1)).toBeVisible();
    await expect(page.getByText("Just a div")).toBeVisible();
    await expect(page.getByText("Just a text")).toBeVisible();
  });
});
