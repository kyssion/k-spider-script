 function getNeedData(){
    let liInfo = document.querySelector("#newsListContent");
    let childNode = liInfo.childNodes
    let ansInfo = {}
    for (let li of childNode) {
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
                    ansInfo[titleValue] = {
                        InfoUrl: infoUrl,
                        TitleValue: titleValue,
                        TitleInfo: titleInfo,
                        Time: newsTime
                    }
                }
            }
        }
    }
    return ansInfo
}