import { test, expect } from '@playwright/test';

test('has title and can navigate to search', async ({ page }) => {
    await page.goto('/');

    // Check the title exists
    await expect(page).toHaveTitle(/Eilat Booking Premium/);

    // Example navigation to the search/apartments page
    const apartmentsLink = page.getByRole('link', { name: 'View Apartments' });
    if (await apartmentsLink.isVisible()) {
        await apartmentsLink.click();
        await expect(page).toHaveURL(/.*apartments/);
    }
});

test('property page loads and shows booking card', async ({ page }) => {
    // Use a known demo property for test
    await page.goto('/he/property/demo_1');

    // Check the booking card exists
    await expect(page.getByText('סה"כ')).toBeVisible();
});
