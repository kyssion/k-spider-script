
export function convertToTimestamp(dateStr: string) {
    // 正则表达式匹配年、月、日、时、分
    const regex = /(\d{4})年(\d{2})月(\d{2})日 (\d{2}):(\d{2})/;
    const match = dateStr.match(regex);

    if (match) {
        // 提取匹配到的年、月、日、时、分
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // 月份从0开始计数
        const day = parseInt(match[3], 10);
        const hour = parseInt(match[4], 10);
        const minute = parseInt(match[5], 10);

        // 创建Date对象
        return new Date(year, month, day, hour, minute);

        // 获取时间戳
    } else {
        // 如果字符串格式不正确，返回null或者抛出错误
        return null;
    }
}

