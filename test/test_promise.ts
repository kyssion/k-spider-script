//模拟获取接口  

async function fetchName() {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("数据请求结束");
            resolve("lujs");
        }, 3000);
    });
    return 123;
}

let GetCjDD = async  function (){
    // 开启一个页面窗口
    const context = await fetchName();
    // 开启一个详细的页面
    const page = await fetchName();
    await Promise.all([
        fetchName(),
        fetchName()
    ])
    // 使用local 实现
    let ans = await fetchName()
    await fetchName()
    await fetchName()
    return true
}
let jobList = new Array<Promise<boolean>>();
for(let i = 0;i<3;i++){
    jobList.push(GetCjDD())
}
let item = [GetCjDD(),GetCjDD()]

let startTime = Date.now();
Promise.all(jobList).then(()=>{
    console.log(Date.now()-startTime);
})

