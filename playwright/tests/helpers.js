const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'log in' }).click();
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const blogloginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click();
  await page.getByRole('textbox').fill(content);
  await page.getByRole('button', { name: 'save' }).click();
  await page.getByText(content).waitFor();
};

const createBlog = async (page, blog) => {
  await page.getByRole('textbox', { name: 'title' }).fill(blog.title);
  await page.getByRole('textbox', { name: 'author' }).fill(blog.author);
  await page.getByRole('textbox', { name: 'url' }).fill(blog.url);
  await page.getByRole('button', { name: 'create' }).click();
  await page.getByText(`${blog.title} ${blog.author}`).waitFor();
};

const clickViewButtons = async (page, viewButtons) => {
  for (let i = 0; i < viewButtons.length; i++) {
    await page.getByRole('button', { name: 'view' }).first().click();
  }
};

export { loginWith, createNote, blogloginWith, createBlog, clickViewButtons };
