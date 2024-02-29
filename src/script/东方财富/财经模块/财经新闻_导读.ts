import * as playwright from 'playwright';
import * as string_util from "../../../util/string_util"

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
    for(let i = 0;i<10;i++){
        let urlNow = string_util.FormatString(baseUrl,i+1)
        jobList.push(GetCjDD(urlNow, context))
    }
    let ansList = await Promise.all(jobList)
    await context.close()
    await browser.close()
})


let GetCjDD = async  function (url:string , context:playwright.BrowserContext){
    console.log("start url : "+url)
    // 开启一个详细的页面
    const page = await context.newPage();
    await Promise.all([
        page.goto(url),
        page.waitForLoadState('load')
    ])
    // 使用local 实现
    let ans = await GetByEvaluate(page)
    await page.close()
    return ans
}

let GetByEvaluate = async function (page: playwright.Page) {
    return await page.evaluate(() => {
        let ans=new Array<any>();
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
}

run().then(() => {});