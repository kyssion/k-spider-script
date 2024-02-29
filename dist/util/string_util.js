"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatString = void 0;
function FormatString(str, ...args) {
    return str.replace(/\{(\d+)\}/g, (match, index) => {
        return typeof args[index] !== "undefined" ? args[index] : match;
    });
}
exports.FormatString = FormatString;
