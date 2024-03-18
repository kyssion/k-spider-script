import * as playwright from "playwright";
import {consola} from "consola"
import * as string_util from "../../../util/string_util";
import * as nodeTag from "../../../util/Node"
import fs from "fs/promises"

// 获取 列表页面 newsListContent 中的信息


// 东方财富 列表页抓取方法
class DFCFListUtil {
    public async GetContextDataInfo(baseUrl: string, pageNum: number, browser: playwright.Browser | null) {
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

    public async GetNewsListContentDataInfo(url: string, context: playwright.BrowserContext) {
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

async function Test() {
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
    await item.GetContextDataInfo("https://finance.eastmoney.com/a/202403173014477932.html", browser, true)
    await browser.close()
}

Test().then(() => {

})

class DFCJContextDataModel {
    public title!: string;
    public abstract!: string;
    public newsDate!: string;
    public newsFrom!: string;
    public dataContext!: DataContextInfo[];
    public dataContextAll!: string
}

class DataContextInfo {
    public tagType!: string
    public value!: string
    public valueType!: string
    public baseUrl!: string
    public webUrl!: string
}

// 东方财富详情页面抓取方法
class DFCFDetailUtil {
    public async GetContextDataInfo(url: string, browser: playwright.Browser | null, useConsole: boolean) {
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
        if (useConsole) {
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
        let ans = await this.getContextData(url, page)
        console.log(JSON.stringify(ans))
        await page.close()
        await context.close()
        if (!isUseOtherBrowser) {
            await browser.close()
        }
        return
    }

    public async getContextData(url: string, page: playwright.Page) {
        let ansData = new DFCJContextDataModel();

        // 设置m3u8 监听 -- 暂时不做
        let urlToImageBufferMap = new Map<String, Buffer>()
        // 设置监听
        await page.route('**/*.{png,jpg,jpeg}', async route => {
            // Fetch original response.
            let url = route.request().url()
            const response = await route.fetch();
            urlToImageBufferMap.set(url, await response.body())
            return route.continue()
        })
        await Promise.all([
            page.goto(url),
            page.waitForLoadState('load')
        ])

        // 1. 获取正文信息
        let needDetailInfo = page.locator("css=.contentwrap").nth(0);
        if (await needDetailInfo.count() == 0) {
            return null
        }
        ansData.title = await needDetailInfo.locator("css=.title").nth(0).innerText();
        let infosNodeChild = needDetailInfo.locator("css=div.infos>div.item")
        if (await infosNodeChild.count() == 0) {
            return null
        }
        ansData.newsDate = await infosNodeChild.nth(0).innerText();
        let newsFrom = await infosNodeChild.nth(1).innerText();
        ansData.newsFrom = newsFrom.split("：")[1]

        let zwInfo = needDetailInfo.locator("css=.contentbox").locator("css=.zwinfos")
        ansData.abstract = await zwInfo.locator("css=.abstract").locator("css=.txt").nth(0).innerText()
        let textInfo = await zwInfo.locator("css=.txtinfos > *").all()
        ansData.dataContext = new Array<DataContextInfo>()
        for (let a = 0; a < textInfo.length; a++) {
            let textItemInfo = textInfo[a]
            let nodeType = await textItemInfo.evaluate(nodeItem => nodeItem.tagName)
            if (!nodeTag.IsTag(nodeType)) {
                console.error("node type not find " + nodeType)
                continue
            }
            let valueItem = new DataContextInfo()
            switch (nodeTag.TagName[nodeType as keyof typeof nodeTag.TagName]) {
                case nodeTag.TagName.DIV:
                    break;
                case nodeTag.TagName.CENTER:
                    let url = await textItemInfo.locator("css=img").nth(0).getAttribute("src") ?? "";
                    valueItem.tagType = nodeType
                    valueItem.valueType = "IMG"
                    valueItem.webUrl = url
                    ansData.dataContext.push(valueItem)
                    break;
                case nodeTag.TagName.P:
                    let className = await textItemInfo.getAttribute("class")
                    if (className !=null){
                        continue
                    }
                    valueItem.tagType = nodeType
                    valueItem.valueType = "TEXT"
                    valueItem.value = await textInfo[a].innerText()
                    valueItem.value =  valueItem.value.replace(/\s*/g,"")
                    if (!valueItem.value.startsWith("主力资金加仓名单实时更新")){
                        ansData.dataContext.push(valueItem)
                    }
                    break;
                default:
                    break;
            }
        }
        let allTextInfo = ""
        for (let a = 0; a < ansData.dataContext.length; a++) {
            let item = ansData.dataContext[a]
            if (item.valueType == "IMG") {
                let fileBuffer = urlToImageBufferMap.get(item.webUrl)
                if (fileBuffer) {
                    let path = "spider_img/"+"东方财富/" + ansData.title.replace(/\s*/g, "") + "/"
                    await fs.mkdir(path, {recursive: true})
                    let baseUrl = path + item.webUrl.split("/").at(-1)
                    await fs.writeFile(baseUrl, fileBuffer)
                    item.baseUrl = baseUrl
                }
            }
            if(item.valueType == "TEXT"){
                allTextInfo = allTextInfo + item.value +"\n"
            }
        }
        ansData.dataContextAll = allTextInfo
        return ansData
    }
}

// 获取m3u8 https://h5.lvb.eastmoney.com/lvbcooperation/api/av/GetAVInfo?reqtype=server&channel_id=4390990&callback=__jp0

// https://finance.eastmoney.com/a/202401172964192889.html
// 推流测试代码 https://finance.eastmoney.com/a/202403012999948393.html
export {DFCFListUtil, DFCFDetailUtil}
