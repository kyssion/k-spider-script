// 东方财富 列表页抓取方法
import * as playwright from "playwright";
import * as string_util from "../../../util/string_util";
import * as wasi from "wasi";

export class DataListInfo {
    public url!: string
    public title!: string
    public info!: string
    public time!: string
}

export class CjOption {
    public ModuleName: string
    public Url: string;
    public PageNum: number;


    constructor(ModuleName: string, Url: string, PageNum: number) {
        this.ModuleName = ModuleName;
        this.Url = Url;
        this.PageNum = PageNum;
    }
}


export class DFListSpider {
    public DefaultPageNum = 8;
    public UrlOption: CjOption[] = [
        {
            ModuleName: "导读",
            Url: "https://finance.eastmoney.com/a/ccjdd_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "时评",
            Url: "https://finance.eastmoney.com/a/cjjsp_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "股评",
            Url: "https://finance.eastmoney.com/a/cgspl_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "国内经济",
            Url: "https://finance.eastmoney.com/a/cgnjj_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "证劵聚焦",
            Url: "https://finance.eastmoney.com/a/czqyw_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "国际经济",
            Url: "https://finance.eastmoney.com/a/cgjjj_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "宏观研究",
            Url: "https://finance.eastmoney.com/a/chgyj_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "沪深公司",
            Url: "https://finance.eastmoney.com/a/cssgs_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "港股公司",
            Url: "https://hk.eastmoney.com/a/cgsbd_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "中概股",
            Url: "https://stock.eastmoney.com/a/czggng_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "欧美公司",
            Url: "https://stock.eastmoney.com/a/cmgpj_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "产经咨询",
            Url: "https://finance.eastmoney.com/a/ccjxw_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "商业咨询",
            Url: "https://biz.eastmoney.com/a/csyzx_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "行业研究",
            Url: "https://stock.eastmoney.com/a/chyyj_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "财富观察",
            Url: "https://enterprise.eastmoney.com/a/ccfgc_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "热点扫描",
            Url: "https://finance.eastmoney.com/a/crdsm_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "纵深调查",
            Url: "https://finance.eastmoney.com/a/czsdc_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "产业透视",
            Url: "https://finance.eastmoney.com/a/ccyts_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "商业观察",
            Url: "https://finance.eastmoney.com/a/csygc_{0}.html",
            PageNum: this.DefaultPageNum
        },
        {
            ModuleName: "创业研究",
            Url: "https://enterprise.eastmoney.com/a/ccyyj_{0}.html",
            PageNum: this.DefaultPageNum
        }
    ]
    // GetListDataInfo 开启抓取脚本,从一个指定的url 地址开始抓取 .
    public async GetDFListInfo(baseUrl: string, pageNum: number, browser: playwright.Browser | null): Promise<DataListInfo[][]> {
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
        let ansList = await this.GetListInfoWithPlaywright(baseUrl, pageNum, context)
        await context.close()
        if (!isUseOtherBrowser) {
            await browser.close()
        }
        return ansList
    }

    // context 维度抓取, 并且拆分成下标页面
    public async GetListInfoWithPlaywright(baseUrl: string, pageNum: number, context: playwright.BrowserContext) {
        let ans = new Array<DataListInfo[]>();
        for (let i = 0; i < pageNum; i++) {
            let urlNow = string_util.FormatString(baseUrl, i + 1)
            ans.push(await this.getListContentDataInfo(urlNow, context))
        }
        return ans
    }


    // 抓取一个列表页面详细数据
    private async getListContentDataInfo(url: string, context: playwright.BrowserContext): Promise<DataListInfo[]> {
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
        for (let item of pageInfos) {
            let newItem = new DataListInfo()
            newItem.info = item.info
            newItem.title = item.title
            newItem.url = item.url
            newItem.time = item.time
            ans.push(newItem)
        }
        await page.close()
        return ans
    }
}
