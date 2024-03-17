
import axios from "axios";
import fs from "fs/promises"

// 声明头
let header ={
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
    "Referer":"https://www.bilibili.com/",
}

async function run (){
    try {
        let resp = await axios.get("https://www.bilibili.com/video/BV1Tz421X7EX/",{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
                "Referer":"https://www.bilibili.com/",
            }
        })
        // bilibili的视频是在 这里的方法存储的url地址
        let re = new RegExp("window.__playinfo__=(.*?)</script>");
        // console.log(resp.data)
        let data = re.exec(resp.data);
        let dataStr = data?.at(0)??"";
        dataStr = dataStr.substring(20);
        dataStr = dataStr.substring(0,dataStr.length-9)
        let z = JSON.parse(dataStr)
        // 获取对应的字段信息
        let videoUrl = z.data.dash.video[0].baseUrl
        let audioUrl = z.data.dash.audio[0].baseUrl

        console.log(videoUrl)
        let respValue = await fetch(videoUrl, {
            method:"GET",
            headers: {
                "User-Agent":"Mzilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
                "Referer":"https://www.bilibili.com/",
            }
        })
        await fs.writeFile("./demo.mp4",Buffer.from(await respValue.arrayBuffer()))
        respValue = await fetch(audioUrl, {
            method:"GET",
            headers: {
                "User-Agent":"Mzilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
                "Referer":"https://www.bilibili.com/",
            }
        })
        // 这个地方是关键 , 需要用二进制数据流
        await fs.writeFile("./demo.mp3",Buffer.from(await respValue.arrayBuffer()))



    }catch (error){
        console.error(error)
    }
}

run().then(()=>{})
