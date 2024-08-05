import { basename, dirname } from "path";
// @ts-check
import { expect, test } from "@playwright/test";

import { fileURLToPath } from "url";
import { getTestDirectoryPath } from "../utils.cjs";

const getParentDirectory = () => {
  return basename(dirname(fileURLToPath(import.meta.url)));
};

test("should render a div with text", async ({ page }) => {
  await page.goto(
    `file://${getTestDirectoryPath()}/${getParentDirectory()}/step1.html`
  );
  await expect(page.getByText("Hello, World!")).toBeVisible();
  expect(
    await page.getByText("Hello, World!").evaluate((node) => node?.nodeName)
  ).toBe("DIV");
});

test("should render a h1 with text", async ({ page }) => {
  await page.goto(
    `file://${getTestDirectoryPath()}/${getParentDirectory()}/step2.html`
  );
  await expect(page.getByText("Hello, World!")).toBeVisible();
  expect(
    await page.getByText("Hello, World!").evaluate((node) => node?.nodeName)
  ).toBe("H1");
});

test("should render a react component", async ({ page }) => {
  await page.goto(
    `file://${getTestDirectoryPath()}/${getParentDirectory()}/step3.html`
  );
  await expect(page.getByText("Hello, World!")).toBeVisible();
});
