import { test, expect, Page } from "@playwright/test";

const someName = "John Doe";
const someEmail = "test@test.com";
const someComment = "Nice!";

test("Form is submitted with required fields", async ({ page }) => {
  let formSubmitted = false;
  page.on("dialog", async (dialog) => {
    await dialog.accept();
    formSubmitted = true;
  });

  await page.goto("FeedBackForm.html");

  await completeFields(page);

  await clickButton(page, "Submit");

  expect(formSubmitted).toBeTruthy();
  await page.close();
});

test("Form is not submitted with required fields will fail", async ({ page }) => {
  let formSubmitted = false;
  page.on("dialog", async (dialog) => {
    await dialog.accept();
    formSubmitted = true;
  });

  await page.goto("FeedBackForm.html");

  await completeFields(page);

  await clickButton(page, "Submit");

  expect(formSubmitted).toBeFalsy();
  await page.close();
});

test("Form is submitted with required fields - form is cleared after submit", async ({
  page,
}) => {
  let formSubmitted = false;
  page.on("dialog", async (dialog) => {
    await dialog.accept();
    formSubmitted = true;
  });

  await page.goto("FeedBackForm.html");

  await completeFields(page);
  await clickButton(page, "Submit");

  expect(formSubmitted).toBeTruthy();
  await expect(page.locator("#name")).toBeEmpty();
  await expect(page.locator("#email")).toBeEmpty();
  await expect(page.locator("#comment")).toBeEmpty();
  await expect(page.locator("#tos")).not.toBeChecked();
  await page.close();
});

test("Form is not submitted without minimum fields", async ({ page }) => {
  let formSubmitted = false;
  page.on("dialog", async (dialog) => {
    await dialog.accept();
    formSubmitted = true;
  });

  await page.goto("FeedBackForm.html");

  await completeFields(page);
  await page.locator("#name").clear();
  await clickButton(page, "Submit");

  expect(formSubmitted).toBeFalsy();
  await page.close();
});

test("Form is not submitted if user selects NO on dialog", async ({ page }) => {
  let formSubmitted = false;
  page.on("dialog", async (dialog) => {
    await dialog.dismiss();
    formSubmitted = false;
  });

  await page.goto("FeedBackForm.html");
  await completeFields(page);
  await clickButton(page, "Submit");

  expect(formSubmitted).toBeFalsy();
  await checkIfItemsNotEmpty(page);
  await page.close();
});

test("Form is completed - clear button clears inputs", async ({ page }) => {
  let formSubmitted = false;
  page.on("dialog", async (dialog) => {
    await dialog.accept();
    formSubmitted = false;
  });

  await page.goto("FeedBackForm.html");
  await completeFields(page);
  await clickButton(page, "Clear");

  expect(formSubmitted).toBeFalsy();
  await expect(page.locator("#name")).toBeEmpty();
  await expect(page.locator("#email")).toBeEmpty();
  await expect(page.locator("#comment")).toBeEmpty();
  await expect(page.locator("#tos")).not.toBeChecked();
  await page.close();
});

test("Form is completed - clear button clears memory", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await page.goto("FeedBackForm.html");
  await page.evaluate(() => {
    localStorage.setItem("email", "alex@email.com");
  });
  await page.reload();

  await clickButton(page, "Clear");
  await page.reload();

  await expect(page.locator("#email")).toBeEmpty();
  await page.close();
});

test("Form is completed - clear button does not inputs if dialog rejected", async ({
  page,
}) => {
  let dataSaved = false;
  page.on("dialog", async (dialog) => {
    await dialog.dismiss();
    dataSaved = true;
  });

  await page.goto("FeedBackForm.html");

  await completeFields(page);
  await clickButton(page, "Save");

  await checkIfItemsNotEmpty(page);
  expect(dataSaved).toBeTruthy();
  await page.close();
});

test("Form is completed - save button saves data", async ({ page }) => {
  page.on("dialog", async (dialog) => {
    await dialog.dismiss();
  });

  await page.goto("FeedBackForm.html");

  await completeFields(page);
  await clickButton(page, "Clear");

  await checkIfItemsNotEmpty(page);
  await page.close();
});

const completeFields = async (page: Page) => {
  await page.fill("#name", someName);
  await page.fill("#email", someEmail);
  await page.fill("#comment", someComment);
  await page.check("#tos");
};

const checkIfItemsNotEmpty = async (page: Page) => {
  await expect(page.locator("#name")).toHaveValue(someName);
  await expect(page.locator("#email")).toHaveValue(someEmail);
  await expect(page.locator("#comment")).toHaveValue(someComment);
  await expect(page.locator("#tos")).toBeChecked();
};

const clickButton = async (
  page: Page,
  buttonName: "Submit" | "Save" | "Clear"
) => {
  await page.getByRole("button", { name: buttonName }).click();
};
