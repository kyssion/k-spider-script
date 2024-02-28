import * as playwright from 'playwright';
import {chromium, test} from "@playwright/test";
import {match} from "node:assert";
import {inflate} from "node:zlib";


let run = (async () => {
    // 开启一个 chromium 进程
    const browser = await chromium.launch(
        {
            headless: false,
        }
    );
    // 开启一个页面窗口
    const context = await browser.newContext();

    // 开启收集console 信息 , 方便进行debug
    context.on('console', async msg => {
        const values = [];
        for (const arg of msg.args())
            values.push(await arg.jsonValue());
        console.log(...values);
    });
    // 开启一个详细的页面
    const page = await context.newPage();

    await Promise.all([
        page.goto("https://finance.eastmoney.com/a/ccjdd.html"),
        page.waitForLoadState('load')
    ])
    // 传入script脚本获取数据 -- 注意evaluate 只能使用的序列化的对象
    // let ans = await getByEvaluate(page);

    // 当程序崩溃或者手动关闭的页面的时候触发.
    browser.on('disconnected', data => {

    });
    // 使用查询方法获取数据
    let ansV2 = await GetByApiBy$(page);
    console.log(ansV2)
    await page.close()
    await context.close()
    await browser.close()
})

let GetByApiBy$ = async  function (page: playwright.Page){
    // 这个会阻止 js的垃圾回收处理.
    let ans = new Map<string, any>();
    let needListItem =await page.$("#newsListContent")
    if (needListItem== null){
        return "";
    }
    let childLi =await needListItem.$$("li")
    for (let liItem of childLi.values()) {
        let textDiv = (await liItem.$$(".text")).at(0);
        if (textDiv != null) {
            let title = (await textDiv.$$(".title")).at(0);
            let info = (await textDiv.$$(".info")).at(0);
            let timeNode = (await textDiv.$$(".time")).at(0);
            if (title && info) {
                let titleA = (await title.$$("a")).at(0);
                if (titleA==null || timeNode==null){
                    continue
                }
                let dataUrl = await titleA.getAttribute("href")??"";
                let dataTitle = await titleA.innerHTML();
                let dataTime = await timeNode.innerHTML()
                let dataInfo = await info.getAttribute("title") ?? "";

                if (dataTitle) {
                    ans.set(dataTitle, {
                        Url: dataUrl,
                        Title: dataTitle,
                        Info: dataInfo,
                        Time: dataTime
                    })
                }
            }
        }
    }
    return JSON.stringify(Object.fromEntries(ans))
}

let getByApiByLocator = async function (page: playwright.Page) {
    let ans = new Map<string, any>();
    let needListItem = page.locator("css=#newsListContent");
    if (await needListItem.count() == 0) {
        return ""
    }
    let childLi = needListItem.locator("css=li")
    if (await childLi.count() == 0) {
        return ""
    }
    for (let rowItem of await childLi.all()) {
        // 注意这里有一个坑, playwright 需要手动指定对应的css样式
        let textDiv = rowItem.locator("css= .text").nth(0);
        if (await textDiv.count() != 0) {
            let title = textDiv.locator("css=.title").nth(0);
            let info = textDiv.locator("css=.info").nth(0);
            let timeNode = textDiv.locator("css=.time").nth(0);
            if (await title.count() != 9 && await info.count() != 0) {
                let titleA = title.locator("css=a").nth(0);
                let dataUrl = await titleA.getAttribute("href") ?? "";
                let dataTitle = await titleA.innerHTML();
                let dataInfo = await info.getAttribute("title") ?? "";
                let dataTime = await timeNode.innerHTML()
                if (dataTitle) {
                    ans.set(dataTitle, {
                        Url: dataUrl,
                        Title: dataTitle,
                        Info: dataInfo,
                        Time: dataTime
                    })
                }
            }
        }
    }
    return JSON.stringify(Object.fromEntries(ans))
}


let getByEvaluate = async function (page: playwright.Page) {
    return await page.evaluate(() => {
        let ans = new Map<string, string>();
        let item = document.querySelector("#newsListContent")
        if (item == null) {
            return "{}"
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
                        let infoUrl = titleA.href;
                        let titleValue = titleA.innerHTML;
                        let titleInfo = info.getAttribute("title") ?? "";
                        let newsTime = timeNode.innerHTML
                        if (titleValue) {
                            ans.set(infoUrl, titleInfo)
                        }
                    }
                }
            }
        }
        return JSON.stringify(Object.fromEntries(ans))
    })
}

run().then(() => {
});