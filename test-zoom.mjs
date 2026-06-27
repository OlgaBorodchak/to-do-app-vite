import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 800 });
await page.goto('http://localhost:5174/to-do-app-vite/');
await page.waitForLoadState('networkidle');

await page.fill('#todo-input', 'Buy groceries');
await page.keyboard.press('Enter');
await page.click('.todo-item-checkbox');
await page.waitForTimeout(200);

const label = await page.$('.todo-item-label');
const box = await label.boundingBox();
await page.screenshot({
  path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\zoom-completed.png`,
  clip: { x: box.x - 20, y: box.y - 20, width: box.width + 40, height: box.height + 40 }
});

const classList = await label.getAttribute('class');
console.log('Label classes:', classList);

await browser.close();
