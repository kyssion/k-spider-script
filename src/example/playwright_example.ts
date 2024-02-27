import * as playwright from 'playwright';
import {chromium, test} from "@playwright/test";

let run = (async ()=>{
    // 开启一个 chromium 进程
    const browser = await chromium.launch(
        {
            headless: false,
        }
    );
    // 开启一个页面窗口
    const context =await browser.newContext();
    // 开启一个详细的页面
    const page = await context.newPage();

    await Promise.all([
        page.goto("https://finance.eastmoney.com/a/ccjdd.html"),
        page.waitForLoadState('load')
    ])

    // 传入script脚本获取数据
    let ans = await page.evaluate( ()=>{
        let item =  document.querySelector("#newsListContent")
        if (item==null){
            return null
        }
        return item.getElementsByClassName("title")[0].innerHTML
    })
    console.log(ans)
    await page.close()
    await context.close()
    await browser.close()
})

run().then(()=>{

});