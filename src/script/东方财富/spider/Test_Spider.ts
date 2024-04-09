
// 获取m3u8 https://h5.lvb.eastmoney.com/lvbcooperation/api/av/GetAVInfo?reqtype=server&channel_id=4390990&callback=__jp0

// https://finance.eastmoney.com/a/202401172964192889.html
// 推流测试代码 https://finance.eastmoney.com/a/202403012999948393.html
import * as df_list_spider from "./DFListSpider"
import * as df_context_spider from "./DFContextSpider"

import * as playwright from "playwright";
import {DFListSpider} from "./DFListSpider";
import {DFContextSpider} from "./DFContextSpider";
async function TestContextInfo() {
    // 开启一个 chromium 进程
    const browser = await playwright.chromium.launch(
        {
            headless: false,
            logger: {
                isEnabled: (name, severity) => name === 'browser',
                log: (name, severity, message, args) => console.log(`${name} ${message}`)
            }
        },
    );
    let item = new df_context_spider.DFContextSpider()
    await item.GetContextInfo("https://finance.eastmoney.com/a/202403193016926098.html", browser, true)
    await browser.close()
}

async function TestListfo() {
    // 开启一个 chromium 进程
    const browser = await playwright.chromium.launch(
        {
            headless: false,
            logger: {
                isEnabled: (name, severity) => name === 'browser',
                log: (name, severity, message, args) => console.log(`${name} ${message}`)
            }
        },
    );
    let listUtil = new df_list_spider.DFListSpider()
    let ans = await listUtil.GetListDataInfo("https://finance.eastmoney.com/a/cssgs_{0}.html",1,browser)
    let contextUtil = new df_context_spider.DFContextSpider()
    for (let items of ans){
        for (let listItem of items){
            let ans =await contextUtil.GetContextInfo(listItem.url,browser,true)
            console.log(ans)
        }
    }
    await browser.close()
}


TestContextInfo().then()
// TestListfo().then()

