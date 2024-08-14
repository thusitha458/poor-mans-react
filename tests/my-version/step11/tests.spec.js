import { basename, dirname } from "path";
// @ts-check
import { expect, test } from "@playwright/test";

import { fileURLToPath } from "url";
import { getTestDirectoryPath } from "../../utils.cjs";

const getParentDirectory = () => {
  return basename(dirname(fileURLToPath(import.meta.url)));
};

test.describe("Step 11", () => {
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

  test("should render React class components", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step5.html`
    );
    await expect(page.getByText("Hello, World!")).toBeVisible();
  });

  test("should work as before", async ({ page }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step6.html`
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
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step7.html`
    );
    await expect(page.getByText("Hello, Thusitha!")).toBeVisible();
  });

  test("should be able to use props for a class component", async ({
    page,
  }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step8.html`
    );
    await expect(page.getByText("Hello, Thusitha!")).toBeVisible();
  });

  test("should be able to add attributes and events to html components", async ({
    page,
  }) => {
    let dialogAccepted = false;
    page.on("dialog", (dialog) => {
      dialogAccepted = true;
      dialog.accept();
    });

    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step9.html`
    );
    await expect(page.getByTestId("my-button")).toBeVisible();
    await page.getByTestId("my-button").click();
    expect(dialogAccepted).toBe(true);
  });

  test("should be able to manage state in React class components", async ({
    page,
  }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step10.html`
    );

    await expect(page.getByText("0")).toBeVisible();

    await page.getByText("Increment").click();
    await expect(page.getByText("1")).toBeVisible();

    await page.getByText("Increment").click();
    await expect(page.getByText("2")).toBeVisible();

    await page.getByText("Decrement").click();
    await expect(page.getByText("1")).toBeVisible();
  });

  test("should be able to manage state in React class components when the root component is a React class component and has multiple class components inside it", async ({
    page,
  }) => {
    await page.goto(
      `file://${getTestDirectoryPath()}/my-version/${getParentDirectory()}/step11.html`
    );

    await expect(page.getByText("Count 1 = 0")).toBeVisible();
    await page.getByText("Increment 1").click();
    await expect(page.getByText("Count 1 = 1")).toBeVisible();
    await page.getByText("Increment 1").click();
    await expect(page.getByText("Count 1 = 2")).toBeVisible();
    await page.getByText("Decrement 1").click();
    await expect(page.getByText("Count 1 = 1")).toBeVisible();

    await expect(page.getByText("Count 2 = 0")).toBeVisible();
    await page.getByText("Increment 2").click();
    await expect(page.getByText("Count 2 = 1")).toBeVisible();
  });
});
