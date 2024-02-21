import { chromium, devices } from 'playwright';
import assert from 'node:assert';

(async () => {
    // 创建一个浏览器进程 - 这里客户以指定启动本机浏览器
    const browser = await chromium.launch(
        {
            executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            headless:false
        }
    );
    // 创建一个串口
    const context = await browser.newContext();


    // 抓取数据
    const page1 = await context.newPage();
    await page1.goto('https://www.bilibili.com/');
    const page2 = await context.newPage();
    await page2.goto('https://www.baidu.com/');
    const page3 = await context.newPage();
    await page3.goto('https://www.bing.com/');

    setTimeout(async ()=>{
        await context.close();
        await browser.close();
    },1000000)
    // Teardown
})();