import * as jsdom from "jsdom";

// type 这个就是jsdom的使用方法, 总是下来其实感觉并不是很好的.
let JSDOM = jsdom.JSDOM;
// jsdom 请求服务端, 并且开启脚本解析
let cookieJar = new jsdom.CookieJar() // todo 启用cookie - 暂时爬虫用不到如果需要可以用playwritgh爬取
// todo 这个是简单的解析dom  , 用的是下面的工厂方法 : fromURL 或者 fromFile
// let dom = new JSDOM(``, {
//     url: "https://finance.eastmoney.com/",
//     runScripts: "dangerously", // 启用js脚本能力支持
//     pretendToBeVisual: true, // 虚拟化渲染能力
//     resources: new jsdom.ResourceLoader({// 启用资源加载能力
//         userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
//     }),
//     virtualConsole: virtualConsole, // 启用虚拟控制台监听能力 , 监听输出
//     includeNodeLocations: false, // 是否查找节点在源文档中的位置 - 暂时不需要
//     beforeParse(window: DOMWindow): void { // 在页面渲染前做点啥
//     }
// })


class CustomLoader extends jsdom.ResourceLoader {
    fetch(url: string, options: jsdom.FetchOptions): jsdom.AbortablePromise<Buffer> | null {
        if (isInImg(url)) {
            return null
        }
        return super.fetch(url, options)
    }
}

function isInImg(url: string) {
    var reg = new RegExp(".(png|jpe?g|gif|bmp|psd|tiff|tga|eps|aspx)");
    return reg.test(url)
}

let run = async () => {
    let virtualConsole = new jsdom.VirtualConsole() // 请注意，最好在调用之前new JSDOM()设置这些事件侦听器，因为在解析过程中可能会出现错误或控制台调用脚本。）
    let dom = await JSDOM.fromURL("https://finance.eastmoney.com/a/ccjdd.html", {
        runScripts: "dangerously", // 启用js脚本能力支持
        pretendToBeVisual: false, // 虚拟化渲染能力
        resources: new CustomLoader({// 启用资源加载能力
            strictSSL: true, // 启用https 能力
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        }),
        virtualConsole: virtualConsole, // 启用虚拟控制台监听能力 , 监听输出
        includeNodeLocations: true, // 是否查找节点在源文档中的位置 - 暂时不需要
        beforeParse(window: jsdom.DOMWindow): void { // 在页面渲染前做点啥
            window.scrollTo = function () {
            }
        }
    })
    virtualConsole.sendTo(console, { // 将虚拟平台的信息输出到console中
        omitJSDOMErrors: false // todo 这个参数暂时意义不明 如果您使用sendTo(c)将错误发送到c，默认情况下它将c.error(errorStack[, errorDetail])使用事件中的信息进行调用"jsdomError"。如果您希望维护事件到方法调用的严格一对一映射，并且可能"jsdomError"自己处理，那么您可以这样做
    });

    dom.window.onload = function () { // 监听dom是否完成

        let ansInfo = new Map<string, any>();
        let nowItem =dom.window.document.getElementById("newsListContent");
        let childLi = nowItem?.getElementsByTagName("li")
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
                        let titleInfo = info.getAttribute("title");
                        let newsTime = timeNode.innerHTML
                        if (titleValue) {
                            ansInfo.set(titleValue, {
                                InfoUrl: infoUrl,
                                TitleValue: titleValue,
                                TitleInfo: titleInfo,
                                Time :newsTime
                            })
                        }
                    }
                }
            }
            console.log(ansInfo)
        }
        dom.window.close()
    }


}

run().then(r => {
})