"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const demo = () => __awaiter(void 0, void 0, void 0, function* () {
    // 开启一个浏览器进程
    const browser = yield puppeteer_1.default.launch({
        headless: false,
    });
    // 开启浏览器窗口
    const defaultContext = browser.defaultBrowserContext();
    // const newContextA = await browser.createBrowserContext()
    // const newContextB = await browser.createBrowserContext()
    // 开启新的标签页 - 默认的的context 默认就有一个pages
    const defaultPage = (yield defaultContext.pages())[0];
    // 如果有需要可以再这里再添加
    // const pageA = await newContextA.newPage()
    // const pageB = await newContextB.newPage()
    // goto 方法跳转到百度中
    yield defaultPage.goto("https://www.bilibili.com");
    const element = yield defaultPage.waitForSelector('div > .bili-header__channel');
    console.log(element);
    const node = yield defaultPage.waitForSelector('::-p-getById(i_cecream)');
    console.log(element);
    // -- 这里是浏览器页面中的操作
    // 操作...
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        // 关闭页面
        yield defaultPage.close();
        // 关闭标签
        yield defaultPage.close();
        // 关闭整个浏览器
        yield browser.close();
    }), 10000000);
});
demo();
