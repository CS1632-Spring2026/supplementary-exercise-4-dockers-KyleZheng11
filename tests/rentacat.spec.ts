import { test, expect } from '@playwright/test';

var baseURL = 'http://localhost:8080';

test('TEST-CONNECTION', async ({ page }) => {
  await page.goto(baseURL);
});

test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
    await page.evaluate(() => {
        document.cookie = "1=false";
        document.cookie = "2=false";
        document.cookie = "3=false";
    });
    await page.reload();
})

// TODO: Fill in with test cases.
test('TEST-1-RESET', async ({ page }) => {
    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });
    await page.reload();
    await page.getByRole('link', { name: 'Reset' }).click();
    const items = page.locator('#listing').getByRole('listitem');
    await expect(items.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    await expect(page.getByRole('main').locator('ol').getByRole('listitem').nth(1).locator('img')).toHaveAttribute('src', '/images/cat2.jpg');
});


test('TEST-3-LISTING', async ({ page }) => {
    await page.getByRole('link', { name: 'Catalog' }).click();
    const items = page.locator('#listing').getByRole('listitem');
    await expect(items).toHaveCount(3);
    await expect(items.nth(2)).toContainText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to rent:' }).fill('1');
    await page.getByRole('button', { name: 'Rent' }).click();
    const items = page.locator('#listing').getByRole('listitem');
    await expect(items.nth(0)).toHaveText('Rented out');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('ID 3. Mistoffelees');
    await expect(page.getByTestId('rentResult')).toHaveText('Success!');
});

test('TEST-6-RETURN', async ({ page }) => {
    await page.evaluate(() => {
        document.cookie = "2=true";
        document.cookie = "3=true";
    });
    await page.reload();
    await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).click();
    await page.getByRole('textbox', { name: 'Enter the ID of the cat to return:' }).fill('2');
    await page.getByRole('button', { name: 'Return' }).click();
    const items = page.locator('#listing').getByRole('listitem');
    await expect(items.nth(0)).toHaveText('ID 1. Jennyanydots');
    await expect(items.nth(1)).toHaveText('ID 2. Old Deuteronomy');
    await expect(items.nth(2)).toHaveText('Rented out');
    await expect(page.locator('#returnResult')).toContainText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).click();
    await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('6');
    await page.getByRole('button', { name: 'Feed' }).click();
    await expect(page.locator('#feedResult')).toContainText('Nom, nom, nom.', { timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
    await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
    await expect(page.getByText('Meow!Meow!Meow!')).toBeVisible();
});

// test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
//     await page.goto(baseURL);
//     await expect(page.getByText('Meow! from Jennyanydots.')).toBeVisible();
// });

test('TEST-11-FEED-A-CAT-SCREENSHOT', async ({ page }) => {
    await page.evaluate(() => {
        document.cookie = "1=true";
        document.cookie = "2=true";
        document.cookie = "3=true";
    });
    await page.reload();
    await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
    await expect(page.locator('body')).toHaveScreenshot();
});

//  ###DEFECTS###

// // When you feed the cats 0, it returns "nom, nom, nom" but it should return Cat Fight
// test('DEFECT1-FUN-FEED', async ({ page }) => {
//     await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
//     await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).click();
//     await page.getByRole('textbox', { name: 'Number of catnips to feed:' }).fill('0');
//     await page.getByRole('button', { name: 'Feed' }).click();
//     await expect(page.locator('//*[@id="feedResult"]')).toContainText('Cat fight!', { timeout: 10000 });
// });

// // When you go to the 'greet a cat' page, it always prints out 3 meows and doesn't change even if cats are rented out
// test('DEFECT2-FUN-GREET-A-CAT', async ({ page }) => {
//     await page.evaluate(() => {
//         document.cookie = "2=true";
//     });
//     await page.reload();
//     await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
//     await expect(page.getByText('Meow!Meow!')).toBeVisible();
// });

// /**
//  * When you are on the greet-a-cat page and access another page with /{catname}, the result doesn't change according to a cat's rent status.
//  */
// test('DEFECT3-FUN-GREET-A-CAT-WITH-NAME', async ({ page }) => {
//     await page.evaluate(() => {
//         document.cookie = "1=true";
//     });
//     await page.goto(baseURL);
//     await expect(page.getByText('Jennyanydots is not here.')).toBeVisible();
// });