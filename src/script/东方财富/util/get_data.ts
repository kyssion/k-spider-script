import * as playwright from "playwright";
import {consola} from "consola"
import * as string_util from "../../../util/string_util";
// 获取 列表页面 newsListContent 中的信息


// 东方财富 列表页抓取方法
class DFCFListUtil {
    public async GetContextDataInfo(baseUrl: string, pageNum: number, browser: playwright.Browser | null){
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
            jobList.push(this.GetNewsListContentDataInfo(urlNow, context))
        }
        let ansList = await Promise.all(jobList)
        await context.close()
        if (!isUseOtherBrowser) {
            await browser.close()
        }
    }

    public async GetNewsListContentDataInfo(url: string, context: playwright.BrowserContext){
        // 开启一个列表页面
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
}

// 东方财富详情页面抓取方法
class DFCFDetailUtil{
    public async GetContextDataInfo(url: string, browser: playwright.Browser | null, useConsole: boolean){
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
        if (useConsole){
            // 开启收集console 信息 , 方便进行debug
            context.on('console', async msg => {
                const values = [];
                for (const arg of msg.args())
                    values.push(await arg.jsonValue());
                console.log(...values);
            });
        }
        // 开启一个详细的页面
        const page = await context.newPage();
        await Promise.all([
            page.goto(url),
            page.waitForLoadState('load')
        ])




        await page.close()
        await context.close()
        if (!isUseOtherBrowser) {
            await browser.close()
        }
        return
    }

    public async getContextData(page : playwright.Page){
        let ansData = new DFCJContextDataModel();

        // 设置m3u8 监听


        // 1. 获取正文信息
        let needDetailInfo = page.locator("css=.contentwrap").nth(0);
        if (await needDetailInfo.count()==0){
            return null
        }
        ansData.title =await needDetailInfo.locator("css=.title").nth(0).innerText();
        let infosNodeChild = needDetailInfo.locator("css=div.infos>div.item")
        if (await infosNodeChild.count()==0){
            return null
        }
        ansData.newDate = await infosNodeChild.nth(0).innerText();
        let newsFrom = await infosNodeChild.nth(1).innerText();
        ansData.newsFrom = newsFrom.split("：")[1]



    }
}


class DFCJContextDataModel{
    public title!:string;
    public abstract!:string;
    public newDate!:string;
    public newsFrom!:string;
    public dataContext!:string;

}

function TestPPP(){
    for (let a=0;a<1000;a++){
        console.log("sdfsfsdf")
    }
}


async function Test(){
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
    let item = new DFCFDetailUtil()
    await item.GetContextDataInfo("https://finance.eastmoney.com/a/202403012999948393.html",browser,true)
    await browser.close()
}

Test().then(()=>{

})

// 获取m3u8 https://h5.lvb.eastmoney.com/lvbcooperation/api/av/GetAVInfo?reqtype=server&channel_id=4390990&callback=__jp0

// https://finance.eastmoney.com/a/202401172964192889.html
// 推流测试代码 https://finance.eastmoney.com/a/202403012999948393.html
export {DFCFListUtil,DFCFDetailUtil}
