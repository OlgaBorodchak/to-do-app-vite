import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5174/to-do-app-vite/');
await page.waitForLoadState('networkidle');

// Add todos
await page.fill('#todo-input', 'Buy groceries');
await page.keyboard.press('Enter');
await page.fill('#todo-input', 'Read a book');
await page.keyboard.press('Enter');
await page.fill('#todo-input', 'Go for a walk');
await page.keyboard.press('Enter');
await page.screenshot({ path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\1-added.png` });

// Complete first item
await page.click('.todo-item:first-child .todo-item-checkbox');
await page.screenshot({ path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\2-completed.png` });

// Filter Active
await page.click('#active');
await page.screenshot({ path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\3-active.png` });

// Filter Completed
await page.click('#completed');
await page.screenshot({ path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\4-completed-filter.png` });

// Toggle dark mode
await page.click('#all');
await page.click('#theme-toggle');
await page.screenshot({ path: String.raw`C:\Users\olgal\AppData\Local\Temp\claude\c--Users-olgal-Documents-Development-todo-app\609d1868-46ca-499f-8c46-22ec899f7f92\scratchpad\5-dark.png` });

await browser.close();
console.log('Done');
