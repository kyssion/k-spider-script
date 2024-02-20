import puppeteer from "puppeteer";

const init = async() => {
    // 开启一个浏览器进程
    const browser = await puppeteer.launch({
            headless: false,
        }
    )
    // 开启浏览器窗口
    const defaultContext = browser.defaultBrowserContext()
    const newContextA = await browser.createBrowserContext()
    const newContextB = await browser.createBrowserContext()
    // 开启新的标签页 - 默认的的context 默认就有一个pages
    const defaultPage = (await defaultContext.pages())[0]
    const pageA = await newContextA.newPage()
    const pageB = await newContextB.newPage()

    // 隐藏的内部层级 frame => 对应的是一个page 中的页面
    // defaultPage.mainFrame()
    await defaultPage.goto("https://www.baidu.com")
    await pageA.goto("https://www.bilibili.com")
    await pageB.goto("https://www.bing.com")
    // 操作...
    setTimeout(async ()=>{
        await browser.close()
    },10000000)
}

init()