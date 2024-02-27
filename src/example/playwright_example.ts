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
        let ansInfo = new Map<string, any>();

        let item =  document.querySelector("#newsListContent")
        if (item==null){
            return null
        }
        let childLi = item.getElementsByTagName("li")
        if (childLi) {
            for (let li of childLi) {
                let textDiv = li.getElementsByClassName("text")[0];
                if (textDiv) {
                    let title = textDiv.getElementsByClassName("title")[0];
                    let info = textDiv.getElementsByClassName("info")[0];
                    let timeNode = textDiv.getElementsByClassName("time")[0];
                    if (title && info) {
                        let titleA = title.getElementsByTagName("a")[0];
                        let infoUrl = titleA.href;
                        let titleValue = titleA.innerHTML;
                        let titleInfo = info.getAttribute("title");
                        let newsTime = timeNode.innerHTML
                        if (titleValue) {
                            ansInfo.set(titleValue, {
                                InfoUrl: infoUrl,
                                TitleValue: titleValue,
                                TitleInfo: titleInfo,
                                Time :newsTime
                            })
                            return JSON.stringify(ansInfo)
                        }
                    }
                }
                return JSON.stringify(ansInfo)
            }
        }
    })
    console.log(ans)
    await page.close()
    await context.close()
    await browser.close()
})

run().then(()=>{

});