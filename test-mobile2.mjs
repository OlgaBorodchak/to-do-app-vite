import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 375, height: 812 });
await page.goto('http://localhost:5174/to-do-app-vite/');
await page.waitForLoadState('networkidle');

await page.fill('#todo-input', 'Buy groceries');
await page.keyboard.press('Enter');

const statusBar = await page.$('.status-bar');
const box = await statusBar.boundingBox();
await page.screenshot({
  path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\mobile-statusbar.png`,
  clip: { x: 0, y: box.y - 10, width: 375, height: box.height + 80 }
});
await browser.close();
