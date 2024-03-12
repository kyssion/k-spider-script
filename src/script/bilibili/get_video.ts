
import axios from "axios";
import http from "https"
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
        let re = new RegExp("window.__playinfo__=(.*?)</script>");
        // console.log(resp.data)
        let data = re.exec(resp.data);
        if (data==null){
            return
        }
        let dataStr = data.at(0)??"";
        dataStr = dataStr.substring(20);
        dataStr = dataStr.substring(0,dataStr.length-9)
        let z = JSON.parse(dataStr)
        let videoUrl = z.data.dash.video[0].baseUrl
        let audioUrl = z.data.dash.audio[0].baseUrl

        let respVideo = await axios.get(videoUrl,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
                "Referer":"https://www.bilibili.com/",
            }
        })

        await fs.writeFile("./test_ts.mp4",respVideo.data)

        console.log(respVideo.data)


        // let respAudio = await axios.get(audioUrl,{
        //     headers:{
        //         "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.2088.76",
        //         "Referer":"https://www.bilibili.com/",
        //     }
        // })
        // await fs.writeFile("./test_ts.mp3",respAudio.data)



    }catch (error){
        console.error(error)
    }
}

run().then(()=>{})
