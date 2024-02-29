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
const string_util = __importStar(require("../../../util/string_util"));
let run = (() => __awaiter(void 0, void 0, void 0, function* () {
    let baseUrl = "https://finance.eastmoney.com/a/ccjdd_{0}.html";
    // 开启一个 chromium 进程
    const browser = yield playwright.chromium.launch({
        headless: true,
    });
    const context = yield browser.newContext();
    let jobList = new Array();
    for (let i = 0; i < 10; i++) {
        let urlNow = string_util.FormatString(baseUrl, i + 1);
        jobList.push(GetCjDD(urlNow, context));
    }
    let ansList = yield Promise.all(jobList);
    yield context.close();
    yield browser.close();
}));
let GetCjDD = function (url, context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("start url : " + url);
        // 开启一个详细的页面
        const page = yield context.newPage();
        yield Promise.all([
            page.goto(url),
            page.waitForLoadState('load')
        ]);
        // 使用local 实现
        let ans = yield GetByEvaluate(page);
        yield page.close();
        return ans;
    });
};
let GetByEvaluate = function (page) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield page.evaluate(() => {
            var _a;
            let ans = new Array();
            let item = document.querySelector("#newsListContent");
            if (item == null) {
                return ans;
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
                                ans.push({
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
            return ans;
        });
    });
};
run().then(() => { });
