// 东方财富 列表页抓取方法
import * as playwright from "playwright";
import * as string_util from "../../../util/string_util";

export class DataListInfo{
    public url!: string
    public title!: string
    public info!: string
    public time!: string
}

export class DFListSpider {
    // 抓取一个网页中中的所有的数据 分下标榨取数据
    public async GetListDataInfo(baseUrl: string, pageNum: number, browser: playwright.Browser | null): Promise<DataListInfo[][]> {
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
        let ansList = await this.GetListDataInfoWithPlaywright(baseUrl,pageNum,context)
        await context.close()
        if (!isUseOtherBrowser) {
            await browser.close()
        }
        return ansList
    }

    // context 维度抓取, 并且拆分成下标页面
    public async GetListDataInfoWithPlaywright(baseUrl:string , pageNum:number,context:playwright.BrowserContext){
        let jobList = new Array<Promise<DataListInfo[]>>();
        for (let i = 0; i < pageNum; i++) {
            let urlNow = string_util.FormatString(baseUrl, i + 1)
            jobList.push(this.getListContentDataInfo(urlNow, context))
        }
        return await Promise.all(jobList)
    }


    // 抓取一个列表页面详细数据
    private async getListContentDataInfo(url: string, context: playwright.BrowserContext) : Promise<DataListInfo[]> {
        // 开启一个列表页面
        const page = await context.newPage();
        await Promise.all([
            page.goto(url),
            page.waitForLoadState('load')
        ])
        // 使用local 实现
        let pageInfos = await page.evaluate(() => {
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
                                    url: dataUrl,
                                    title: dataTitle,
                                    info: dataInfo,
                                    time: dataTime
                                })
                            }
                        }
                    }
                }
            }
            return ans
        })
        let ans = new Array<DataListInfo>();
        for (let item of pageInfos){
            let newItem = new DataListInfo()
            newItem.info = item.info
            newItem.title = item.title
            newItem.url = item.url
            newItem.time= item.time
            ans.push(newItem)
        }
        await page.close()
        return ans
    }
}
