
function FormatString(str: string, ...args: any[]): string {
    return str.replace(/\{(\d+)\}/g, (match, index) => {
        return typeof args[index] !== "undefined" ? args[index] : match;
    });
}

export {FormatString}