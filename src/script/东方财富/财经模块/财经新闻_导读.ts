import * as playwright from 'playwright';
import * as string_util from "../../../util/string_util"
import {GetNewsListContentDataInfo} from "../util/get_data";

let run = (async () => {
    let baseUrl = "https://finance.eastmoney.com/a/ccjdd_{0}.html"
    // 开启一个 chromium 进程
    const browser = await playwright.chromium.launch(
        {
            headless: true,
        }
    );
    const context = await browser.newContext();
    let jobList = new Array<Promise<any>>();
    for(let i = 0;i<5;i++){
        let urlNow = string_util.FormatString(baseUrl,i+1)
        jobList.push(GetNewsListContentDataInfo(urlNow, context))
    }
    let ansList = await Promise.all(jobList)
    await context.close()
    await browser.close()
})


run().then(() => {});
