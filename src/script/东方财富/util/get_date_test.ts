
// 获取m3u8 https://h5.lvb.eastmoney.com/lvbcooperation/api/av/GetAVInfo?reqtype=server&channel_id=4390990&callback=__jp0

// https://finance.eastmoney.com/a/202401172964192889.html
// 推流测试代码 https://finance.eastmoney.com/a/202403012999948393.html
import * as get_date from "./get_data"
import * as playwright from "playwright";
import {it} from "node:test";
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
    let item = new get_date.DFCFContextUtil()
    await item.GetContextInfo("https://finance.eastmoney.com/a/202403183015473340.html", browser, true)
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
    let listUtil = new get_date.DFCFListUtil()
    let ans = await listUtil.GetListDataInfo("https://finance.eastmoney.com/a/cssgs_{0}.html",1,browser)
    let contextUtil = new get_date.DFCFContextUtil()
    for (let items of ans){
        for (let listItem of items){
            let ans =await contextUtil.GetContextInfo(listItem.url,browser,true)
            console.log(ans)
        }
    }
    await browser.close()
}


//TestContextInfo().then()
TestListfo().then()

