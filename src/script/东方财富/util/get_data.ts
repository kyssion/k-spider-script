import * as playwright from "playwright";
import {consola} from "consola"
import * as string_util from "../../../util/string_util";
// 获取 列表页面 newsListContent 中的信息



let GetContextDataInfo = async function (baseUrl: string, pageNum: number, browser: playwright.Browser | null) {
    let isUseOtherBrowser = true;
    if (!browser) {
        browser = await playwright.chromium.launch(
            {
                headless: true,
            }
        );
        isUseOtherBrowser = false;
    }
    const context = await browser.newContext();
    let jobList = new Array<Promise<any>>();
    for (let i = 0; i < pageNum; i++) {
        let urlNow = string_util.FormatString(baseUrl, i + 1)
        jobList.push(GetNewsListContentDataInfo(urlNow, context))
    }
    let ansList = await Promise.all(jobList)
    await context.close()
    if (!isUseOtherBrowser) {
        await browser.close()
    }
}

let GetNewsListContentDataInfo = async function (url: string, context: playwright.BrowserContext) {
    // 开启一个详细的页面
    const page = await context.newPage();
    await Promise.all([
        page.goto(url),
        page.waitForLoadState('load')
    ])
    // 使用local 实现
    let ans = await page.evaluate(() => {
        let ans = new Array<any>();
        let item = document.querySelector("#newsListContent")
        if (item == null) {
            return ans
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
                        let dataUrl = titleA.href;
                        let dataTitle = titleA.innerHTML;
                        let dataInfo = info.getAttribute("title") ?? "";
                        let dataTime = timeNode.innerHTML
                        if (dataTitle) {
                            ans.push({
                                Url: dataUrl,
                                Title: dataTitle,
                                Info: dataInfo,
                                Time: dataTime
                            })
                        }
                    }
                }
            }
        }
        return ans
    })
    await page.close()
    consola.info("get url data succsee : " + url + " value : " + JSON.stringify(ans))
    return ans
}

// 抓取页面信息 : https://finance.eastmoney.com/a/202403012998758422.html

export {GetNewsListContentDataInfo, GetContextDataInfo}
