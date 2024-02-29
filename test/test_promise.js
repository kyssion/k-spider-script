"use strict";
//模拟获取接口  
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
function fetchName() {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("数据请求结束");
                resolve("lujs");
            }, 3000);
        });
        return 123;
    });
}
let GetCjDD = function () {
    return __awaiter(this, void 0, void 0, function* () {
        // 开启一个页面窗口
        const context = yield fetchName();
        // 开启一个详细的页面
        const page = yield fetchName();
        yield Promise.all([
            fetchName(),
            fetchName()
        ]);
        // 使用local 实现
        let ans = yield fetchName();
        yield fetchName();
        yield fetchName();
        return true;
    });
};
let jobList = new Array();
for (let i = 0; i < 3; i++) {
    jobList.push(GetCjDD());
}
let item = [GetCjDD(), GetCjDD()];
let startTime = Date.now();
Promise.all(jobList).then(() => {
    console.log(Date.now() - startTime);
});
