import { test } from '@applitools/eyes-playwright/fixture';

test('sign in with english-based steps', async ({ page, eyes }) => {
  await page.goto('/login');

  await eyes.run('Verify that the "Sign in" button is visible');
  await eyes.run('Verify that "Invalid email or password" is not visible');
  await eyes.check('Sign in form');

  await eyes.run(
    'type "wrong@example.com" in the "Email" field and type secret "badpassword" in the "Password" field and click the "Sign in" button',
  );

  await eyes.run('Verify that "Invalid emailssss or password" is visible');
  await eyes.check('Invalid credentials error');

  await eyes.run('clear the "Email" field');
  await eyes.run('clear the "Password" field');

  const steps = await eyes.run(
    'type "demo@visionbank.com" in the "Email" field and type secret "demo1234" in the "Password" field and click the "Sign in" button',
  );
  console.log(JSON.stringify(steps, null, 2));

  await eyes.run('Wait 5 seconds for "Welcome back" element to appear');
  await eyes.run('Verify that "Signed in as demo@visionbank.com" is visible');
  await eyes.check('Dashboard after sign in');
});
