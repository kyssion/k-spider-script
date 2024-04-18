// df_news 列表页抓取方法
import * as playwright from "playwright";
import * as nodeTag from "../../../util/node_util"
import fs from "fs/promises"

export class DataContextInfo {
    public title!: string;
    public abstract!: string;
    public newsDate!: string;
    public newsFrom!: string;
    public dataContext!: DataContextDetailInfo[];
    public dataContextAll!: string
    public fromUrl!: string
}

export class DataContextDetailInfo {
    public tagType!: string
    public value!: string
    public valueType!: string
    public baseUrl!: string
    public webUrl!: string
}

// 东方财富详情页面抓取方法
export class DFContextSpider {
    // 使用进程维度爬取
    public async GetDFContextInfo(url: string, browser: playwright.Browser | null, useConsole: boolean): Promise<DataContextInfo | null> {
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
        let ans = await this.GetDFContextInfoWithPlaywrightContext(url, context, useConsole)
        await context.close()
        if (!isUseOtherBrowser) {
            await browser.close()
        }
        return ans
    }

    // 使用context 维度优化
    public async GetDFContextInfoWithPlaywrightContext(url: string, context: playwright.BrowserContext, useConsole: boolean): Promise<DataContextInfo | null> {
        try {
            if (context == null) {
                console.log("context not find")
                return null
            }
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
            page.setDefaultTimeout(20000)
            let ans = await this.getContextInfoData(url, page)
            await page.close()
            return ans
        } catch (error) {
            console.error("page err " + error + "url :" + url)
            return null
        }
    }

    // 页面详情解析
    private async getContextInfoData(url: string, page: playwright.Page): Promise<DataContextInfo | null> {
        let ansData = new DataContextInfo();

        // 设置m3u8 监听 -- 暂时不做
        let urlToImageBufferMap = new Map<String, Buffer>()
        // 设置监听
        await page.route('**/*', async route => {
            // Fetch original response.
            let reg = /\.(html)$/;
            if (reg.test(route.request().url())) {
                let url = route.request().url()
                const response = await route.fetch();
                urlToImageBufferMap.set(url, await response.body())
                return route.continue()
            } else {
                return route.abort()
            }
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
        ansData.fromUrl = url
        ansData.newsDate = await infosNodeChild.nth(0).innerText();
        let newsFrom = await infosNodeChild.nth(1).innerText();
        ansData.newsFrom = newsFrom.split("：")[1]

        let zwInfo = needDetailInfo.locator("css=.contentbox").locator("css=.zwinfos")
        let abstractNode = zwInfo.locator("css=.abstract")
        if (await abstractNode.count() != 0) {
            ansData.abstract = await abstractNode.locator("css=.txt").nth(0).innerText()
        }
        let textInfo = await zwInfo.locator("css=.txtinfos > *").all()
        ansData.dataContext = new Array<DataContextDetailInfo>()
        for (let a = 0; a < textInfo.length; a++) {
            let textItemInfo = textInfo[a]
            let nodeType = await textItemInfo.evaluate(nodeItem => nodeItem.tagName)
            if (!nodeTag.IsTag(nodeType)) {
                console.error("node type not find " + nodeType)
                continue
            }
            let valueItem = new DataContextDetailInfo()
            switch (nodeTag.TagName[nodeType as keyof typeof nodeTag.TagName]) {
                case nodeTag.TagName.DIV:
                    break;
                case nodeTag.TagName.CENTER:
                    let imgItem = textItemInfo.locator("css=img")
                    if (await imgItem.count() == 0) {
                        continue
                    }
                    let url = await imgItem.nth(0).getAttribute("src") ?? "";
                    valueItem.tagType = nodeType
                    valueItem.valueType = "IMG"
                    valueItem.webUrl = url
                    ansData.dataContext.push(valueItem)
                    break;
                case nodeTag.TagName.P:
                    let className = await textItemInfo.getAttribute("class")
                    if (className != null) {
                        continue
                    }
                    let pImgItem = textItemInfo.locator("css=img")
                    if (await pImgItem.count() != 0) {
                        let url = await pImgItem.nth(0).getAttribute("src") ?? "";
                        valueItem.tagType = nodeType
                        valueItem.valueType = "IMG"
                        valueItem.webUrl = url
                        ansData.dataContext.push(valueItem)
                    } else {
                        valueItem.tagType = nodeType
                        valueItem.valueType = "TEXT"
                        valueItem.value = await textInfo[a].innerText()
                        valueItem.value = valueItem.value.replace(/\s*/g, "")
                        if (!valueItem.value.startsWith("主力资金加仓名单实时更新")) {
                            ansData.dataContext.push(valueItem)
                        }
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
                    let path = "spider_img/" + "df_news/" + ansData.title.replace(/\s*/g, "") + "/"
                    await fs.mkdir(path, {recursive: true})
                    let baseUrl = path + item.webUrl.split("/").at(-1)
                    await fs.writeFile(baseUrl, fileBuffer)
                    item.baseUrl = baseUrl
                }
            }
            if (item.valueType == "TEXT") {
                allTextInfo = allTextInfo + item.value + "\n"
            }
        }
        ansData.dataContextAll = allTextInfo
        return ansData
    }
}
