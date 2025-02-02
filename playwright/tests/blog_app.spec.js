const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, blogloginWith, createBlog } = require('./helpers');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('Log in to application');
    await expect(locator).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await blogloginWith(page, 'mluukkai', 'salainen');
      await expect(page.getByText('Matti Luukkainen logged-in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await blogloginWith(page, 'mluukkai', 'wrongPassword');
      await expect(page.getByText('Wrong username or password')).toBeVisible();
    });
  });

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await blogloginWith(page, 'mluukkai', 'salainen');
      await page.getByText('Matti Luukkainen logged-in').waitFor();
      await page.getByRole('button', { name: 'new blog' }).click();
      await createBlog(page, {
        title: 'e2etesttitle',
        author: 'e2etestauthor',
        url: 'https://www.test.url',
      });
    });

    test('A new blog can be created', async ({ page }) => {
      await expect(page.getByText('e2etesttitle e2etestauthor')).toBeVisible();
    });

    test('A blog can be liked', async ({ page }) => {
      await page.getByText('view').click();
      await page.getByText('likes 0').waitFor();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(page.getByText('likes 1')).toBeVisible();
    });

    test('A blog can be deleted', async ({ page }) => {
      page.on('dialog', async dialog => {
        console.log(dialog.message());
        await dialog.accept();
      });
      await page.getByText('view').click();
      await page.getByRole('button', { name: 'remove' }).click();
      await expect(
        page.getByText('e2etesttitle e2etestauthor')
      ).not.toBeVisible();
    });

    test('Blogs are ordered by likes', async ({ page }) => {
      await expect(page.getByText('e2etesttitle e2etestauthor')).toBeVisible();

      await createBlog(page, {
        title: 'e2etesttitle2',
        author: 'e2etestauthor',
        url: 'https://www.test.url',
        likes: 2,
      });
      await expect(page.getByText('e2etesttitle2 e2etestauthor')).toBeVisible();
      await createBlog(page, {
        title: 'e2etesttitle3',
        author: 'e2etestauthor',
        url: 'https://www.test.url',
        likes: 3,
      });
      // click the view buttons
      const viewButtons = await page
        .getByRole('button', { name: 'view' })
        .all();
      for (let i = 0; i < viewButtons.length; i++) {
        await viewButtons[0].click();
      }
      // click the like buttons
      const likeButtons = await page
        .getByRole('button', { name: 'like' })
        .all();
      const clickCounts = [1, 2, 3]; // Number of times to click each button

      for (let i = 0; i < likeButtons.length; i++) {
        for (let j = 0; j < clickCounts[i]; j++) {
          await likeButtons[i].click();
        }
      }
      await page.reload();
      for (let i = 0; i < viewButtons.length; i++) {
        await viewButtons[0].click();
      }
      const likesElements = await page.getByText(/likes \d+/).all();
      const likesArray = await Promise.all(
        likesElements.map(async element => {
          return await element.textContent();
        })
      );
      expect(likesArray).toEqual(['likes 3like', 'likes 2like', 'likes 1like']);
    });
  });
});
