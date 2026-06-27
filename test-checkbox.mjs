import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto('http://localhost:5174/to-do-app-vite/');
await page.waitForLoadState('networkidle');
await page.fill('#todo-input', 'Buy groceries');
await page.keyboard.press('Enter');
await page.click('.todo-item-checkbox');
await page.waitForTimeout(100);
const cb = await page.$('.todo-item-checkbox');
const box = await cb.boundingBox();
await page.screenshot({
  path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\checkbox-zoom.png`,
  clip: { x: box.x - 10, y: box.y - 10, width: box.width + 20, height: box.height + 20 }
});
await browser.close();
