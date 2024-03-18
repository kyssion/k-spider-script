enum TagName{
    DIV,
    CENTER,
    P
}

function IsTag(tagName :string):boolean{
    return tagName in TagName
}

export {IsTag,TagName}
