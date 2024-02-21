import puppeteer, {Puppeteer} from "puppeteer";

const demo = async() => {
    // 开启一个浏览器进程
    const browser = await puppeteer.launch({
            headless: false,
        }
    )
    // 开启浏览器窗口
    const defaultContext = browser.defaultBrowserContext()
    // const newContextA = await browser.createBrowserContext()
    // const newContextB = await browser.createBrowserContext()
    // 开启新的标签页 - 默认的的context 默认就有一个pages
    const defaultPage = (await defaultContext.pages())[0]
    // 如果有需要可以再这里再添加
    // const pageA = await newContextA.newPage()
    // const pageB = await newContextB.newPage()

    // goto 方法跳转到百度中
    await defaultPage.goto("https://www.bilibili.com")
    const element = await defaultPage.waitForSelector('div > .bili-header__channel');
    console.log(element)

    const node = await defaultPage.waitForSelector('::-p-getById(i_cecream)');
    console.log(element)

    // -- 这里是浏览器页面中的操作
    // 操作...
    setTimeout(async ()=>{
        // 关闭页面
        await defaultPage.close()
        // 关闭标签
        await defaultPage.close()
        // 关闭整个浏览器
        await browser.close()
    },10000000)
}

demo()


