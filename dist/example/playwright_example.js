"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const playwright = __importStar(require("playwright"));
let run = (() => __awaiter(void 0, void 0, void 0, function* () {
    // 开启一个 chromium 进程
    const browser = yield playwright.chromium.launch({
        headless: false,
        logger: {
            isEnabled: (name, severity) => name === 'browser',
            log: (name, severity, message, args) => console.log(`${name} ${message}`)
        }
    });
    // 开启一个页面窗口
    const context = yield browser.newContext();
    // 开启收集console 信息 , 方便进行debug
    context.on('console', (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const values = [];
        for (const arg of msg.args())
            values.push(yield arg.jsonValue());
        console.log(...values);
    }));
    // 开启一个详细的页面
    const page = yield context.newPage();
    yield Promise.all([
        page.goto("https://finance.eastmoney.com/a/ccjdd.html"),
        page.waitForLoadState('load')
    ]);
    // 传入script脚本获取数据 -- 注意evaluate 只能使用的序列化的对象
    // let ans = await getByEvaluate(page);
    // 当程序崩溃或者手动关闭的页面的时候触发.
    browser.on('disconnected', data => {
    });
    // 使用css查询方法获取数据
    console.log("use by $ : " + (yield GetByApiBy$(page)));
    // 使用内部js代码实现
    console.log("use by evaluate js : " + (yield GetByEvaluate(page)));
    // 使用local 实现
    console.log("use by locator : " + (yield GetByApiByLocator(page)));
    yield page.close();
    yield context.close();
    yield browser.close();
}));
let GetByEvaluate = function (page) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.evaluate(() => {
            var _a;
            let ans = new Map();
            let item = document.querySelector("#newsListContent");
            if (item == null) {
                return "{}";
            }
            let childLi = item.getElementsByTagName("li");
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
                            let dataInfo = (_a = info.getAttribute("title")) !== null && _a !== void 0 ? _a : "";
                            let dataTime = timeNode.innerHTML;
                            if (dataTitle) {
                                ans.set(dataTitle, {
                                    Url: dataUrl,
                                    Title: dataTitle,
                                    Info: dataInfo,
                                    Time: dataTime
                                });
                            }
                        }
                    }
                }
            }
            return JSON.stringify(Object.fromEntries(ans));
        });
    });
};
let GetByApiBy$ = function (page) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // 这个会阻止 js的垃圾回收处理.
        let ans = new Map();
        let needListItem = yield page.$("#newsListContent");
        if (needListItem == null) {
            return "";
        }
        let childLi = yield needListItem.$$("li");
        for (let liItem of childLi.values()) {
            let textDiv = (yield liItem.$$(".text")).at(0);
            if (textDiv != null) {
                let title = (yield textDiv.$$(".title")).at(0);
                let info = (yield textDiv.$$(".info")).at(0);
                let timeNode = (yield textDiv.$$(".time")).at(0);
                if (title && info) {
                    let titleA = (yield title.$$("a")).at(0);
                    if (titleA == null || timeNode == null) {
                        continue;
                    }
                    let dataUrl = (_a = yield titleA.getAttribute("href")) !== null && _a !== void 0 ? _a : "";
                    let dataTitle = yield titleA.innerHTML();
                    let dataTime = yield timeNode.innerHTML();
                    let dataInfo = (_b = yield info.getAttribute("title")) !== null && _b !== void 0 ? _b : "";
                    if (dataTitle) {
                        ans.set(dataTitle, {
                            Url: dataUrl,
                            Title: dataTitle,
                            Info: dataInfo,
                            Time: dataTime
                        });
                    }
                }
            }
        }
        return JSON.stringify(Object.fromEntries(ans));
    });
};
let GetByApiByLocator = function (page) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let ans = new Map();
        let needListItem = page.locator("css=#newsListContent");
        if ((yield needListItem.count()) == 0) {
            return "";
        }
        let childLi = needListItem.locator("css=li");
        if ((yield childLi.count()) == 0) {
            return "";
        }
        for (let rowItem of yield childLi.all()) {
            // 注意这里有一个坑, playwright 需要手动指定对应的css样式
            let textDiv = rowItem.locator("css= .text").nth(0);
            if ((yield textDiv.count()) != 0) {
                let title = textDiv.locator("css=.title").nth(0);
                let info = textDiv.locator("css=.info").nth(0);
                let timeNode = textDiv.locator("css=.time").nth(0);
                if ((yield title.count()) != 9 && (yield info.count()) != 0) {
                    let titleA = title.locator("css=a").nth(0);
                    let dataUrl = (_a = yield titleA.getAttribute("href")) !== null && _a !== void 0 ? _a : "";
                    let dataTitle = yield titleA.innerHTML();
                    let dataInfo = (_b = yield info.getAttribute("title")) !== null && _b !== void 0 ? _b : "";
                    let dataTime = yield timeNode.innerHTML();
                    if (dataTitle) {
                        ans.set(dataTitle, {
                            Url: dataUrl,
                            Title: dataTitle,
                            Info: dataInfo,
                            Time: dataTime
                        });
                    }
                }
            }
        }
        return JSON.stringify(Object.fromEntries(ans));
    });
};
run().then(() => {
});
